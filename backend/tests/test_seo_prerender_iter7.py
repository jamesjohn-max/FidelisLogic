"""
Iteration 7: Regression tests for the prerender-seo.mjs idempotency fix.

Covers:
  - P0 Idempotency: two consecutive `yarn prerender` runs produce identical output.
  - Duplicate detection: JSON-LD count == 2 (Service + BreadcrumbList) and
    __seo_prerender count == 1 after two runs.
  - Snapshot artifact: build/_shell.html exists after first run and does NOT
    contain any injected SEO markers.
  - Safety guard: if _shell.html is deleted but build/index.html has been
    injected, prerender must exit non-zero with an instructive message that
    mentions `yarn build:no-prerender`.
  - Regression on iter5/iter6: /api/prerender still returns full SEO for
    /solutions/business-apps, static /brands/roomz/index.html still valid,
    og:image URLs still absolute (https://).
  - Fresh build path: rm -rf build && yarn build:no-prerender && yarn prerender
    yields >=13 files + _shell.html snapshot cleanly.
"""

import hashlib
import os
import re
import shutil
import subprocess
from pathlib import Path

import pytest
import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

FRONTEND_DIR = Path("/app/frontend")
BUILD_DIR = FRONTEND_DIR / "build"
INDEX_HTML = BUILD_DIR / "index.html"
SHELL_SNAPSHOT = BUILD_DIR / "_shell.html"
BUSINESS_APPS_HTML = BUILD_DIR / "solutions" / "business-apps" / "index.html"
ROOMZ_HTML = BUILD_DIR / "brands" / "roomz" / "index.html"

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
# Fallback: read frontend/.env if not injected into env
if not BASE_URL:
    env_path = FRONTEND_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line.startswith("REACT_APP_BACKEND_URL"):
                BASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'").rstrip("/")
                break


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def run_yarn(cmd: str, cwd: Path = FRONTEND_DIR, timeout: int = 180):
    """Run a yarn command, return CompletedProcess."""
    return subprocess.run(
        ["yarn", cmd],
        cwd=str(cwd),
        capture_output=True,
        text=True,
        timeout=timeout,
    )


# ---------------------------------------------------------------------------
# Prereq
# ---------------------------------------------------------------------------

def test_prereq_backend_url_available():
    assert BASE_URL, "REACT_APP_BACKEND_URL missing from env and frontend/.env"


def test_prereq_build_dir_present():
    assert BUILD_DIR.is_dir(), f"Missing build dir: {BUILD_DIR}"
    assert INDEX_HTML.is_file(), f"Missing {INDEX_HTML}"


# ---------------------------------------------------------------------------
# P0: Idempotency across two consecutive prerender runs
# ---------------------------------------------------------------------------

class TestIdempotency:
    """Run yarn prerender twice, verify md5 stability across all outputs."""

    @pytest.fixture(scope="class")
    def two_runs(self):
        # Ensure we start with an already-prerendered build (snapshot exists).
        # If _shell.html missing, do a clean rebuild once to establish baseline.
        if not SHELL_SNAPSHOT.is_file() or not BUSINESS_APPS_HTML.is_file():
            r = run_yarn("prerender")
            assert r.returncode == 0, f"Baseline prerender failed: {r.stderr}"

        # Snapshot md5 of key outputs BEFORE the (second) idempotency-check run
        targets = [
            INDEX_HTML,
            BUSINESS_APPS_HTML,
            ROOMZ_HTML,
            BUILD_DIR / "solutions" / "index.html",
        ]
        targets = [t for t in targets if t.is_file()]
        assert BUSINESS_APPS_HTML in targets, "business-apps not prerendered"

        before = {str(t): md5(t) for t in targets}

        # Run prerender AGAIN (no rebuild in between).
        r = run_yarn("prerender")
        assert r.returncode == 0, f"Second prerender failed: {r.stderr}\n{r.stdout}"

        after = {str(t): md5(t) for t in targets}
        return before, after, r

    def test_md5_index_html_stable(self, two_runs):
        before, after, _ = two_runs
        assert before[str(INDEX_HTML)] == after[str(INDEX_HTML)], (
            "build/index.html md5 changed after second prerender run — NOT idempotent"
        )

    def test_md5_business_apps_stable(self, two_runs):
        before, after, _ = two_runs
        assert before[str(BUSINESS_APPS_HTML)] == after[str(BUSINESS_APPS_HTML)], (
            "solutions/business-apps/index.html md5 changed — NOT idempotent"
        )

    def test_md5_all_targets_stable(self, two_runs):
        before, after, _ = two_runs
        diffs = [k for k in before if before[k] != after[k]]
        assert not diffs, f"md5 changed for: {diffs}"

    def test_uses_existing_snapshot_message(self, two_runs):
        _, _, r = two_runs
        combined = (r.stdout or "") + (r.stderr or "")
        assert "pristine shell snapshot" in combined.lower() or "using existing" in combined.lower(), (
            f"Expected reuse-of-snapshot log message not found. Output:\n{combined[:1000]}"
        )


# ---------------------------------------------------------------------------
# Duplicate detection in business-apps output
# ---------------------------------------------------------------------------

class TestDuplicateDetection:
    def test_jsonld_count_exactly_two(self):
        html = BUSINESS_APPS_HTML.read_text()
        count = len(re.findall(r'application/ld\+json', html))
        assert count == 2, (
            f"Expected 2 JSON-LD scripts (Service + BreadcrumbList) in "
            f"business-apps/index.html, got {count}"
        )

    def test_seo_prerender_main_count_exactly_one(self):
        html = BUSINESS_APPS_HTML.read_text()
        count = len(re.findall(r'__seo_prerender', html))
        # One id="__seo_prerender" ⇒ one occurrence in HTML.
        assert count == 1, (
            f"Expected exactly 1 __seo_prerender occurrence, got {count}"
        )

    def test_main_seo_prerender_open_close_pair(self):
        html = BUSINESS_APPS_HTML.read_text()
        opens = len(re.findall(r'<main\s+id="__seo_prerender"', html, re.I))
        assert opens == 1, f"Expected 1 <main id='__seo_prerender'> element, got {opens}"


# ---------------------------------------------------------------------------
# Snapshot artifact integrity
# ---------------------------------------------------------------------------

class TestShellSnapshot:
    def test_snapshot_exists(self):
        assert SHELL_SNAPSHOT.is_file(), f"Missing snapshot: {SHELL_SNAPSHOT}"

    def test_snapshot_has_no_seo_prerender(self):
        content = SHELL_SNAPSHOT.read_text()
        assert "__seo_prerender" not in content, (
            "_shell.html contains __seo_prerender — snapshot is NOT pristine"
        )

    def test_snapshot_has_no_jsonld(self):
        content = SHELL_SNAPSHOT.read_text()
        assert "application/ld+json" not in content, (
            "_shell.html contains application/ld+json — snapshot is NOT pristine"
        )

    def test_snapshot_still_has_react_bundle(self):
        content = SHELL_SNAPSHOT.read_text()
        # CRA shells always reference /static/js/ bundles.
        assert "/static/js/" in content, "_shell.html missing React JS bundle references"


# ---------------------------------------------------------------------------
# Safety guard: corrupted state ⇒ non-zero exit + instructive error
# ---------------------------------------------------------------------------

class TestSafetyGuard:
    def test_die_when_shell_missing_and_index_already_injected(self):
        # Precondition: index.html should already contain __seo_prerender from prior runs.
        assert "__seo_prerender" in INDEX_HTML.read_text(), (
            "Precondition failed: build/index.html should be pre-injected before this test"
        )
        assert SHELL_SNAPSHOT.is_file(), "Precondition failed: _shell.html should exist"

        backup_path = SHELL_SNAPSHOT.with_suffix(".html.bak_iter7")
        shutil.move(str(SHELL_SNAPSHOT), str(backup_path))
        try:
            r = run_yarn("prerender")
            assert r.returncode != 0, (
                f"Expected non-zero exit when _shell.html missing and index.html injected. "
                f"stdout:\n{r.stdout}\nstderr:\n{r.stderr}"
            )
            combined = (r.stdout or "") + (r.stderr or "")
            assert "yarn build:no-prerender" in combined, (
                f"Error message should mention `yarn build:no-prerender`. Got:\n{combined[:2000]}"
            )
        finally:
            # Restore snapshot so subsequent tests / real usage aren't broken.
            if backup_path.exists():
                shutil.move(str(backup_path), str(SHELL_SNAPSHOT))


# ---------------------------------------------------------------------------
# Iter5 + Iter6 regression sanity
# ---------------------------------------------------------------------------

class TestRegression:
    def test_api_prerender_business_apps_200(self):
        r = requests.get(
            f"{BASE_URL}/api/prerender",
            params={"path": "/solutions/business-apps"},
            timeout=20,
        )
        assert r.status_code == 200, f"/api/prerender returned {r.status_code}"
        html = r.text
        assert re.search(r"<title>[^<]+</title>", html, re.I)
        assert 'name="description"' in html
        assert 'property="og:image"' in html
        assert 'rel="canonical"' in html
        assert "application/ld+json" in html

    def test_static_roomz_has_bundle_and_title(self):
        assert ROOMZ_HTML.is_file(), f"Missing {ROOMZ_HTML}"
        content = ROOMZ_HTML.read_text()
        assert "/static/js/" in content, "Roomz static file missing React bundle"
        title_match = re.search(r"<title>([^<]+)</title>", content, re.I)
        assert title_match, "Roomz static file missing <title>"
        assert len(title_match.group(1).strip()) > 5

    def test_og_image_absolute_https(self):
        content = ROOMZ_HTML.read_text()
        m = re.search(r'property="og:image"\s+content="([^"]+)"', content, re.I)
        assert m, "og:image not found in roomz static"
        assert m.group(1).startswith("https://"), f"og:image not absolute https: {m.group(1)}"


# ---------------------------------------------------------------------------
# Fresh build path (destructive; runs last thanks to class name ordering)
# ---------------------------------------------------------------------------

class TestZFreshBuildPath:
    """
    Simulate the standard workflow. Marked with 'Z' prefix so pytest's default
    alphabetical class ordering places it after other tests — this class
    rebuilds the entire /app/frontend/build directory.
    """

    @pytest.fixture(scope="class")
    def fresh_build(self):
        # Wipe build/
        if BUILD_DIR.exists():
            shutil.rmtree(BUILD_DIR)
        # yarn build:no-prerender
        r1 = subprocess.run(
            ["yarn", "build:no-prerender"],
            cwd=str(FRONTEND_DIR),
            capture_output=True,
            text=True,
            timeout=600,
        )
        assert r1.returncode == 0, (
            f"yarn build:no-prerender failed:\n{r1.stdout}\n{r1.stderr}"
        )
        # yarn prerender
        r2 = run_yarn("prerender", timeout=300)
        assert r2.returncode == 0, f"yarn prerender failed:\n{r2.stdout}\n{r2.stderr}"
        return r1, r2

    def test_snapshot_created(self, fresh_build):
        assert SHELL_SNAPSHOT.is_file(), "Fresh build did not create _shell.html"
        content = SHELL_SNAPSHOT.read_text()
        assert "__seo_prerender" not in content
        assert "application/ld+json" not in content

    def test_snapshot_log_message_first_run(self, fresh_build):
        _, r2 = fresh_build
        combined = (r2.stdout or "") + (r2.stderr or "")
        assert "snapshot" in combined.lower(), (
            f"Expected snapshot creation log on first run. Got:\n{combined[:1500]}"
        )

    def test_at_least_13_prerendered_files(self, fresh_build):
        # Count all index.html files under build/ (root + subroutes)
        files = list(BUILD_DIR.rglob("index.html"))
        assert len(files) >= 13, (
            f"Expected >=13 prerendered index.html files, got {len(files)}: "
            f"{[str(f.relative_to(BUILD_DIR)) for f in files]}"
        )

    def test_business_apps_present_after_fresh_build(self, fresh_build):
        assert BUSINESS_APPS_HTML.is_file()
        content = BUSINESS_APPS_HTML.read_text()
        assert "__seo_prerender" in content
        # Exactly 2 JSON-LD and 1 __seo_prerender still hold on fresh build.
        assert len(re.findall(r"application/ld\+json", content)) == 2
        assert len(re.findall(r"__seo_prerender", content)) == 1
