# Fidelis Logic — Ubuntu 24.04 Deployment Guide

Target: single Ubuntu 24.04 LTS VPS with **1 GB RAM** + **MongoDB Atlas** (external).

Runtime footprint: ~300 MB RAM (Nginx + Uvicorn + OS).

---

## 0. Provision

- Ubuntu 24.04 LTS, 1 GB RAM, 1 vCPU, 20 GB SSD.
- A DNS **A record** pointing `fidelislogic.com` (and `www`) to the server's public IP.
- A **MongoDB Atlas** free-tier (M0) cluster. Whitelist the server IP in Atlas → *Network Access*.

## 1. System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y \
    python3 python3-venv python3-pip python3-dev build-essential \
    nginx supervisor certbot python3-certbot-nginx \
    ufw curl git rsync
```

## 2. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 3. Clone the repo

```bash
sudo mkdir -p /app && sudo chown $USER:$USER /app
cd /app
git clone <your-git-url> .
```

## 4. Backend — Python venv

```bash
cd /app/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements-prod.txt
deactivate
```

Copy env:
```bash
cp /app/deploy/backend.env.example /app/backend/.env
nano /app/backend/.env       # fill in Atlas URI, JWT_SECRET, admin hash
```

Generate the admin password hash on any machine:
```bash
python3 -c "from passlib.hash import bcrypt; print(bcrypt.hash('YOUR_ADMIN_PASSWORD'))"
```

## 5. Frontend — **build off-server** (recommended on 1 GB RAM)

On your **laptop** (or CI):
```bash
cd frontend
cp /app/deploy/frontend.env.example .env
# edit .env so REACT_APP_BACKEND_URL=https://fidelislogic.com
yarn install
yarn build
rsync -avz --delete build/ user@fidelislogic.com:/var/www/fidelislogic/
```

If you insist on building on the server, add a 2 GB swapfile first (see Appendix A).

Set correct owner on the server:
```bash
sudo mkdir -p /var/www/fidelislogic
sudo chown -R www-data:www-data /var/www/fidelislogic
```

## 6. Supervisor — run the FastAPI backend

```bash
sudo cp /app/deploy/supervisor.conf /etc/supervisor/conf.d/fidelislogic.conf
sudo chown -R www-data:www-data /app/backend
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
# expect: fidelislogic-backend   RUNNING
```

Sanity check:
```bash
curl -s http://127.0.0.1:8001/api/health || curl -s http://127.0.0.1:8001/api/
```

## 7. Nginx + HTTPS

```bash
sudo cp /app/deploy/nginx.conf /etc/nginx/sites-available/fidelislogic
sudo ln -s /etc/nginx/sites-available/fidelislogic /etc/nginx/sites-enabled/fidelislogic
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Issue a Let's Encrypt cert (uncomments SSL lines automatically)
sudo certbot --nginx -d fidelislogic.com -d www.fidelislogic.com \
     --redirect --agree-tos -m you@fidelislogic.com --no-eff-email
```

Certbot installs a systemd timer that auto-renews — nothing else to do.

## 8. Smoke test

```bash
curl -I https://fidelislogic.com/            # 200
curl -s https://fidelislogic.com/api/brands  # JSON payload
```
Then log in at `https://fidelislogic.com/admin` with the admin credentials from step 4.

---

## Ongoing operations

### View logs
```bash
sudo tail -f /var/log/supervisor/fidelislogic-backend.err.log
sudo tail -f /var/log/nginx/access.log
```

### Deploy a code update
```bash
# On server:
cd /app && git pull
sudo supervisorctl restart fidelislogic-backend

# On your laptop (frontend changes):
cd frontend && yarn build
rsync -avz --delete build/ user@fidelislogic.com:/var/www/fidelislogic/
```

### Rotate admin password
Regenerate the bcrypt hash and update `ADMIN_PASSWORD_HASH` in `/app/backend/.env`,
then `sudo supervisorctl restart fidelislogic-backend`.

---

## Appendix A — Building the frontend on a 1 GB server (not recommended)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn

cd /app/frontend
cp /app/deploy/frontend.env.example .env
yarn install
NODE_OPTIONS=--max-old-space-size=1536 yarn build
sudo rsync -a --delete build/ /var/www/fidelislogic/
sudo chown -R www-data:www-data /var/www/fidelislogic
```

## Appendix B — MongoDB Atlas connection tips

- Use the **SRV** connection string (`mongodb+srv://…`). It requires the `dnspython`
  package, which is already in `requirements-prod.txt`.
- Prefer a dedicated DB user with role **readWrite** on the `fidelislogic` DB only.
- In *Network Access* whitelist the server's public IP. Avoid `0.0.0.0/0` for production.
- Free M0 tier limits: 512 MB storage, shared CPU, 500 connections. Enough for a
  marketing/CMS site. Upgrade to M10 (~US$60/mo) once daily traffic > 50k requests.

## Appendix C — What was intentionally removed vs. the dev requirements.txt

The dev image ships with these packages, none of which the codebase imports.
They are excluded from `requirements-prod.txt`:

- `emergentintegrations`, `openai`, `litellm`, `google-genai`, `google-generativeai`,
  `tiktoken`, `tokenizers`, `huggingface_hub`, `hf-xet` — no LLM features are used.
- `stripe` — no payment integration is used.
- `boto3`, `botocore`, `s3transfer`, `s5cmd` — no S3 usage (uploads go to Mongo).
- `pandas`, `numpy` — not used at runtime.
- `black`, `flake8`, `isort`, `mypy`, `pytest` — dev-only tools.

Trimming these drops the install size from ~1.2 GB to ~180 MB.
