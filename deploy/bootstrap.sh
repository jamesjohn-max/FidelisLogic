#!/usr/bin/env bash
# ============================================================================
# Fidelis Logic — one-shot bootstrap for Ubuntu 24.04 LTS (1 GB RAM + Atlas)
# ============================================================================
# Run as a normal sudo user, NOT root. Example:
#   curl -fsSL https://your-repo/deploy/bootstrap.sh | sudo -u ubuntu bash
# or after cloning:
#   sudo -u ubuntu bash /app/deploy/bootstrap.sh
#
# What it does:
#   1. Installs system packages
#   2. Configures UFW firewall
#   3. Sets up Python venv + installs backend prod deps
#   4. Copies example env files (you MUST edit them after)
#   5. Registers supervisor unit for the FastAPI backend
#   6. Installs nginx site config
#   7. Prepares /var/www/fidelislogic for the built frontend
#   8. Prints next-step checklist (certbot, admin hash, rsync build)
#
# It does NOT:
#   - Build the React frontend (do that on your laptop and rsync)
#   - Issue an SSL certificate (run certbot manually after DNS is live)
#   - Fill in .env values
# ============================================================================
set -euo pipefail

# ---- config (edit if your paths differ) -----------------------------------
APP_ROOT="/app"
BACKEND_DIR="${APP_ROOT}/backend"
DEPLOY_DIR="${APP_ROOT}/deploy"
WEB_ROOT="/var/www/fidelislogic"
DOMAIN_PRIMARY="fidelislogic.com"
DOMAIN_WWW="www.fidelislogic.com"
NGINX_SITE_NAME="fidelislogic"
SUPERVISOR_UNIT="fidelislogic-backend"
# ---------------------------------------------------------------------------

log()  { printf "\033[1;34m[deploy]\033[0m %s\n" "$*"; }
ok()   { printf "\033[1;32m[ ok  ]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn ]\033[0m %s\n" "$*"; }
die()  { printf "\033[1;31m[FAIL ]\033[0m %s\n" "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] && die "Do not run as root. Use a sudo user (e.g. 'ubuntu')."
command -v sudo >/dev/null || die "sudo not installed."
[[ -d "$BACKEND_DIR" ]] || die "Backend not found at $BACKEND_DIR — clone the repo first."
[[ -d "$DEPLOY_DIR"  ]] || die "Deploy dir not found at $DEPLOY_DIR."

# ---------------------------------------------------------------------------
log "1/8  Installing system packages…"
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    python3 python3-venv python3-pip python3-dev build-essential \
    nginx supervisor certbot python3-certbot-nginx \
    ufw curl git rsync
ok "packages installed"

# ---------------------------------------------------------------------------
log "2/8  Configuring UFW firewall…"
sudo ufw allow OpenSSH        >/dev/null
sudo ufw allow 'Nginx Full'   >/dev/null
sudo ufw --force enable       >/dev/null
ok "firewall active"

# ---------------------------------------------------------------------------
log "3/8  Creating Python venv + installing prod requirements…"
if [[ ! -d "$BACKEND_DIR/venv" ]]; then
    python3 -m venv "$BACKEND_DIR/venv"
fi
# shellcheck disable=SC1091
source "$BACKEND_DIR/venv/bin/activate"
pip install --upgrade pip
pip install -r "$BACKEND_DIR/requirements-prod.txt"
deactivate
ok "backend deps installed"

# ---------------------------------------------------------------------------
log "4/8  Preparing backend .env…"
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
    cp "$DEPLOY_DIR/backend.env.example" "$BACKEND_DIR/.env"
    warn ".env created from template — edit $BACKEND_DIR/.env before starting!"
else
    ok "existing .env kept"
fi
sudo chown -R www-data:www-data "$BACKEND_DIR"
sudo chmod 640 "$BACKEND_DIR/.env"

# ---------------------------------------------------------------------------
log "5/8  Registering supervisor unit…"
sudo cp "$DEPLOY_DIR/supervisor.conf" "/etc/supervisor/conf.d/${SUPERVISOR_UNIT}.conf"
sudo supervisorctl reread
sudo supervisorctl update
sleep 2
if sudo supervisorctl status "$SUPERVISOR_UNIT" | grep -q RUNNING; then
    ok "$SUPERVISOR_UNIT is RUNNING"
else
    warn "$SUPERVISOR_UNIT is not running — check logs:"
    warn "  sudo tail -n 100 /var/log/supervisor/${SUPERVISOR_UNIT}.err.log"
fi

# ---------------------------------------------------------------------------
log "6/8  Installing nginx site…"
sudo cp "$DEPLOY_DIR/nginx.conf" "/etc/nginx/sites-available/${NGINX_SITE_NAME}"
sudo ln -sf "/etc/nginx/sites-available/${NGINX_SITE_NAME}" \
            "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
ok "nginx reloaded"

# ---------------------------------------------------------------------------
log "7/8  Creating web root…"
sudo mkdir -p "$WEB_ROOT"
sudo chown -R www-data:www-data "$WEB_ROOT"
if [[ ! -f "$WEB_ROOT/index.html" ]]; then
    sudo tee "$WEB_ROOT/index.html" >/dev/null <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><title>Fidelis Logic</title></head>
<body style="font-family:system-ui;padding:2rem;">
<h1>Placeholder</h1>
<p>Bootstrap complete. rsync your React build here.</p>
</body></html>
HTML
    ok "placeholder index.html written to $WEB_ROOT"
fi

# ---------------------------------------------------------------------------
log "8/8  Bootstrap complete. Next steps:"
cat <<EOF

  ┌──────────────────────────────────────────────────────────────────────┐
  │  NEXT STEPS (manual)                                                 │
  ├──────────────────────────────────────────────────────────────────────┤
  │                                                                      │
  │  1. Edit backend config:                                             │
  │       sudo nano ${BACKEND_DIR}/.env                                  │
  │     - MONGO_URL      (from MongoDB Atlas)                            │
  │     - JWT_SECRET     python3 -c "import secrets;                     │
  │                       print(secrets.token_urlsafe(64))"              │
  │     - ADMIN_PASSWORD_HASH                                            │
  │        python3 -c "from passlib.hash import bcrypt;                  │
  │                    print(bcrypt.hash('YOUR_PASSWORD'))"              │
  │     Then:  sudo supervisorctl restart ${SUPERVISOR_UNIT}             │
  │                                                                      │
  │  2. Build frontend on your LAPTOP and rsync:                         │
  │       cd frontend && yarn install && yarn build                      │
  │       rsync -avz --delete build/ \\                                   │
  │             \$USER@${DOMAIN_PRIMARY}:${WEB_ROOT}/                     │
  │                                                                      │
  │  3. Point DNS A-records for ${DOMAIN_PRIMARY} and                    │
  │     ${DOMAIN_WWW} to this server's public IP.                        │
  │                                                                      │
  │  4. Issue TLS certificate (after DNS propagates):                    │
  │       sudo certbot --nginx \\                                         │
  │             -d ${DOMAIN_PRIMARY} -d ${DOMAIN_WWW} \\                  │
  │             --redirect --agree-tos --no-eff-email \\                  │
  │             -m you@${DOMAIN_PRIMARY}                                 │
  │                                                                      │
  │  5. Whitelist THIS server's public IP in MongoDB Atlas               │
  │       Atlas → Network Access → Add IP Address                        │
  │                                                                      │
  │  6. Smoke test:                                                      │
  │       curl -I https://${DOMAIN_PRIMARY}/                             │
  │       curl -s https://${DOMAIN_PRIMARY}/api/brands                   │
  │                                                                      │
  └──────────────────────────────────────────────────────────────────────┘

EOF
ok "done."
