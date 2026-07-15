"""
One-time migration script: Seed legacy hardcoded blog posts from the former
frontend/src/data/mock.js into MongoDB. Idempotent by slug — safe to rerun.
"""
import asyncio
import os
import uuid
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")

LEGACY_POSTS = [
    {
        "title": "Choosing Between Microsoft Teams Rooms and Zoom Rooms in 2026",
        "slug": "teams-rooms-vs-zoom-rooms-2025",
        "excerpt": "A vendor-neutral comparison to help UAE organizations make informed meeting room technology decisions.",
        "category": "Meeting Rooms",
        "date": datetime(2026, 1, 15),
        "featured_image": "https://images.unsplash.com/photo-1770048532712-4fde5ef7eb90",
        "content": """
<p>Choosing between <strong>Microsoft Teams Rooms (MTR)</strong> and <strong>Zoom Rooms</strong> is one of the most common decisions UAE organizations face when standardizing meeting room technology. Both platforms offer enterprise-grade capabilities, but the right fit depends on your collaboration ecosystem, user adoption patterns, and long-term IT strategy.</p>
<h2>When Microsoft Teams Rooms Make Sense</h2>
<ul>
<li>Organizations standardized on Microsoft 365 and Teams as their primary UC platform</li>
<li>Deep integration requirements with Outlook calendaring, SharePoint, and OneDrive</li>
<li>Need for single-sign-on and centralized device management via Teams Admin Center</li>
</ul>
<h2>When Zoom Rooms Shine</h2>
<ul>
<li>Zoom is the daily driver for meetings and webinars across teams</li>
<li>Heavy external collaboration where attendees already use Zoom clients</li>
<li>Need for flexible room sizes, touch controllers, and Zoom Whiteboard integration</li>
</ul>
<h2>The BYOD Alternative</h2>
<p>For organizations using multiple UC platforms, a BYOD (Bring Your Own Device) meeting room supports any client via USB or wireless casting — offering maximum flexibility without vendor lock-in.</p>
<p>Our consulting approach helps you assess current usage, total cost of ownership, and user preferences before recommending a platform.</p>
""".strip(),
    },
    {
        "title": "The Hidden Costs of Poor Workplace Technology Decisions",
        "slug": "hidden-costs-poor-tech-decisions",
        "excerpt": "Why upfront consulting saves money and frustration in the long run.",
        "category": "Industry Insights",
        "date": datetime(2026, 1, 10),
        "featured_image": "https://images.unsplash.com/photo-1630283017802-785b7aff9aac",
        "content": """
<p>Workplace technology decisions made without structured evaluation often look cheap on day one and expensive over three years. The true cost of a wrong call shows up as rework, user frustration, and shadow IT — rarely in the original invoice.</p>
<h2>The Four Hidden Cost Drivers</h2>
<ol>
<li><strong>Rework</strong> — rooms re-commissioned because of acoustic issues or wrong camera framing</li>
<li><strong>Shadow IT</strong> — teams buying their own tools when the sanctioned platform fails them</li>
<li><strong>Support overhead</strong> — IT tickets multiply when user experience is inconsistent</li>
<li><strong>Missed adoption</strong> — licenses paid for, seats empty, ROI negative</li>
</ol>
<h2>What Structured Consulting Prevents</h2>
<p>A vendor-neutral discovery process surfaces requirements before RFPs go out. That single step typically saves 15–25% of the lifecycle cost of a meeting room or headset fleet.</p>
""".strip(),
    },
    {
        "title": "Hot Desking and Room Booking: Complete Guide for UAE Offices",
        "slug": "hot-desking-room-booking-guide",
        "excerpt": "How workspace experience platforms like Flowscape and ROOMZ optimize office utilization.",
        "category": "Workspace Technology",
        "date": datetime(2026, 1, 5),
        "featured_image": "https://images.unsplash.com/photo-1718220216044-006f43e3a9b1",
        "content": """
<p>Hybrid working has reshaped the UAE office. Employees come in three days a week on average, but the same thirty desks sit reserved for a hundred people. Workspace experience platforms exist to solve exactly this mismatch.</p>
<h2>Core Capabilities</h2>
<ul>
<li><strong>Desk booking</strong> — reserve in advance or claim on arrival via QR code</li>
<li><strong>Room panels</strong> — live availability at the door, no more ghost meetings</li>
<li><strong>Visitor management</strong> — digital check-in, host alerts, and compliance logs</li>
<li><strong>Analytics</strong> — occupancy heatmaps to right-size real estate</li>
</ul>
<h2>Platforms We Evaluate</h2>
<p>ROOMZ, Flowscape, Condeco, and Morbit each have strengths. The right choice depends on your existing identity provider, calendaring stack, and whether you need hardware panels or pure software.</p>
<h2>Typical ROI</h2>
<p>Clients consistently report 20–35% reduction in wasted floor space within six months of a structured rollout.</p>
""".strip(),
    },
    {
        "title": "Enterprise Headset Buying Guide: Call Center to Executive Suite",
        "slug": "enterprise-headset-buying-guide",
        "excerpt": "How to choose the right collaboration devices for different user personas and use cases.",
        "category": "Product Reviews",
        "date": datetime(2026, 1, 28),
        "featured_image": "https://images.unsplash.com/photo-1769069920308-40130d50ae58",
        "content": """
<p>Headsets look like a commodity until you standardize across a thousand users. Then comfort, certification, and fleet management become business-critical.</p>
<h2>Three Personas, Three Profiles</h2>
<ul>
<li><strong>Call Center agents</strong> — all-day comfort, dual-ear noise isolation, quick-disconnect cables</li>
<li><strong>Hybrid workers</strong> — Bluetooth + USB dongle, active noise cancellation, multi-device pairing</li>
<li><strong>Executives</strong> — premium audio, discreet form factor, seamless handoff between devices</li>
</ul>
<h2>Certifications Matter</h2>
<p>Microsoft Teams and Zoom certifications aren't marketing. They guarantee acoustic echo cancellation, sidetone handling, and reliable firmware updates on your UC platform.</p>
<h2>Fleet Management</h2>
<p>Tools like Jabra Xpress, Poly Lens, and Logitech Sync let IT push firmware, monitor utilization, and swap devices before failure — critical once you cross a few hundred units.</p>
""".strip(),
    },
    {
        "title": "ERP Implementation for SMBs: What to Expect",
        "slug": "erp-implementation-smb-guide",
        "excerpt": "A realistic timeline and approach to business application deployments in small and medium businesses.",
        "category": "Business Applications",
        "date": datetime(2026, 1, 20),
        "featured_image": "https://images.unsplash.com/photo-1642957323739-5632d8a2ff3d",
        "content": """
<p>ERP implementations fail for predictable reasons: unclear scope, weak change management, and mismatched expectations on timeline. SMBs can sidestep all three with a disciplined kickoff.</p>
<h2>Realistic Timeline</h2>
<ol>
<li><strong>Weeks 1–3</strong> — Discovery workshops, process mapping, data audit</li>
<li><strong>Weeks 4–8</strong> — Configuration, integration design, data migration dry-runs</li>
<li><strong>Weeks 9–12</strong> — User acceptance testing, training cohorts, parallel run</li>
<li><strong>Weeks 13+</strong> — Go-live, hypercare, and iterative optimization</li>
</ol>
<h2>Common Pitfalls</h2>
<ul>
<li>Signing before finishing discovery — forces expensive change orders later</li>
<li>Treating data migration as a task — it's a project in its own right</li>
<li>Skipping training — adoption dies quietly</li>
</ul>
<h2>Our Role</h2>
<p>As vendor-neutral advisors we run the discovery, set the scope, and stay on the customer side through go-live. The vendor executes; we protect your outcomes.</p>
""".strip(),
    },
    {
        "title": "Meeting Room Design Best Practices for Microsoft Teams",
        "slug": "meeting-room-design-best-practices",
        "excerpt": "Acoustic considerations, camera placement, network readiness, and commissioning standards.",
        "category": "Meeting Rooms",
        "date": datetime(2026, 2, 1),
        "featured_image": "https://images.unsplash.com/photo-1762176263996-a0713a49ee4d",
        "content": """
<p>A room that looks great in a brochure can fail a live Teams call within minutes. Great meeting rooms are boring on camera — consistent audio, clear video, minimal friction.</p>
<h2>Acoustics First</h2>
<p>Reverberation time (RT60) below 0.5 seconds is the gold standard for speech intelligibility. Soft ceilings, carpeted floors, and fabric panels do more for call quality than any expensive camera.</p>
<h2>Camera Placement</h2>
<ul>
<li>Eye-line camera at the far end of the display, not above</li>
<li>Avoid back-lighting from windows — shades or wall placement matters</li>
<li>Framing should include all seats at 120° FOV for typical rooms</li>
</ul>
<h2>Network Readiness</h2>
<p>Dedicate VLANs for MTR traffic, QoS tagged, with a minimum 2 Mbps symmetric per room. Wi-Fi is acceptable for BYOD rooms but wired is mandatory for dedicated MTR systems.</p>
<h2>Commissioning Checklist</h2>
<p>Audio DSP tuning, camera calibration, test call to IT and an external participant, user walkthrough, and a one-page quick-start card left in every room.</p>
""".strip(),
    },
]


async def seed():
    mongo_url = os.environ["MONGO_URL"]
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ["DB_NAME"]]

    created = 0
    skipped = 0

    for post in LEGACY_POSTS:
        existing = await db.blog_posts.find_one({"slug": post["slug"]})
        if existing:
            print(f"SKIP  {post['slug']} (already exists)")
            skipped += 1
            continue

        doc = {
            "id": str(uuid.uuid4()),
            "title": post["title"],
            "slug": post["slug"],
            "excerpt": post["excerpt"],
            "content": post["content"],
            "category": post["category"],
            "author": "Fidelis Logic",
            "featured_image": post["featured_image"],
            "date": post["date"],
            "published": True,
            "seo_title": None,
            "seo_description": post["excerpt"],
            "seo_keywords": None,
            "views": 0,
            "reading_time": None,
            "tags": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await db.blog_posts.insert_one(doc)
        print(f"CREATE {post['slug']}")
        created += 1

    print(f"\nDone. Created: {created}, Skipped: {skipped}")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
