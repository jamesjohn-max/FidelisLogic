# Fidelis Logic — AWS Lightsail Deployment Guide

Complete, no-assumptions walkthrough for a first-time Ubuntu user.
Stack: **AWS Lightsail (Ubuntu 24.04, 1 GB RAM)** + **MongoDB Atlas Free** + **build on MacBook**.

Legend:
- 🍎 = MacBook Terminal
- ☁️ = a browser tab (AWS / Atlas / your domain registrar)
- 🐧 = the Lightsail server (SSH terminal)

---

# Part A — MongoDB Atlas (free database)

### A1. ☁️ Create an Atlas account
Visit **https://www.mongodb.com/cloud/atlas/register** → sign up (Google works). Click **"Build a database"**.

### A2. ☁️ Create the M0 free cluster
- Tier: **M0 FREE**
- Provider: **AWS**
- Region: nearest to Lightsail (e.g. **Bahrain me-south-1** or **Frankfurt eu-central-1**)
- Cluster name: `fidelislogic`
- **Create**

### A3. ☁️ Create a database user
- Left sidebar → **Database Access** → **Add New Database User**
- Method: **Password**
- Username: `fidelis_app`
- Password: click **Autogenerate Secure Password** → 📋 **COPY IT NOW** to a note
- Built-in Role: **Read and write to any database**
- **Add User**

### A4. ☁️ Whitelist IPs (temporarily open)
- Left sidebar → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**
- We tighten this in Part G.

### A5. ☁️ Copy the connection string
- **Database** → click **Connect** → **Drivers**
- Driver **Python**, Version **3.12 or later**
- Copy the string and replace `<password>` with the one from A3:
```
mongodb+srv://fidelis_app:REAL_PASSWORD_HERE@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
📋 Paste this final full string into your note. **Do not** leave `<password>` literal.

---

# Part B — Create the Lightsail server

### B1. ☁️ Launch the instance
1. Go to **https://lightsail.aws.amazon.com/**
2. **Create instance**
3. Region: same as your Atlas region (A2)
4. Platform: **Linux/Unix**
5. Blueprint: **OS Only → Ubuntu 24.04 LTS**
6. Plan: **$5 / month** (1 GB RAM, 2 vCPU, 40 GB SSD)  ← do **not** pick $3.50, 512 MB is too small
7. Name: `fidelislogic-prod` → **Create instance**
8. Wait ~1 min → status **Running**

### B2. ☁️ Attach a static IP
- Click the instance → **Networking** tab → **Public IPv4** → **Attach static IP**
- Name: `fidelislogic-ip` → **Create and attach**
- 📋 Copy the static IP (e.g. `13.245.67.89`) — you'll use it for DNS and SSH.

### B3. ☁️ Verify firewall ports
Still on **Networking**, in the **IPv4 Firewall** table you should see:
- SSH port **22**
- HTTP port **80**
- HTTPS port **443**

If HTTPS is missing, click **Add rule → HTTPS → Create**.

### B4. ☁️ Download the SSH key
- Top-right → **Account → SSH keys tab**
- Find the key for your region → **Download**
- File lands in `~/Downloads/LightsailDefaultKey-<region>.pem`

### B5. 🍎 Move the key to `~/.ssh/`
```bash
mkdir -p ~/.ssh
mv ~/Downloads/LightsailDefaultKey-*.pem ~/.ssh/fidelislogic.pem
chmod 600 ~/.ssh/fidelislogic.pem
```

### B6. 🍎 Test SSH connectivity
Replace `13.245.67.89` with your static IP everywhere below.
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89
```
Type **yes** at the fingerprint prompt. You should land at `ubuntu@ip-xxx:~$`. Type `exit` for now.

---

# Part C — Point your domain to the server

### C1. ☁️ Add DNS records at your registrar (GoDaddy/Namecheap/Cloudflare/etc.)

| Type | Name  | Value (your static IP) | TTL |
|------|-------|------------------------|-----|
| A    | `@`   | `13.245.67.89`         | 300 |
| A    | `www` | `13.245.67.89`         | 300 |

Save. DNS usually propagates in 1–5 minutes.

### C2. 🍎 Verify DNS is live
```bash
dig +short fidelislogic.com
dig +short www.fidelislogic.com
```
Both must print your static IP before you attempt certbot (Part F).

---

# Part D — Ubuntu system dependencies

**All commands below are 🐧 on the Lightsail server**, reached via:
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89
```

Each section below is one dependency: **what it is → install → verify**.

---

### D1. Refresh the package index — always first

**Why**: Ubuntu's apt cache may be days old. Refresh it before installing anything.

```bash
sudo apt update
sudo apt upgrade -y
```
If a purple screen asks about GRUB / SSH config, press **Enter** on the default (Keep current version).

**Verify**:
```bash
apt list --upgradable 2>/dev/null | wc -l
# 0 or 1 lines = fully upgraded
```

---

### D2. `build-essential` — C/C++ compiler toolchain

**Why**: Some Python packages (`bcrypt`, `cryptography`) compile native code the first time they install. Without a compiler, pip fails with `error: gcc not found`.

**Install**:
```bash
sudo apt install -y build-essential
```

**Verify**:
```bash
gcc --version    # gcc (Ubuntu 13.x.x) ...
make --version   # GNU Make 4.x
```

---

### D3. `git` — clone the repo

**Why**: To pull your GitHub repo down to the server.

**Install**:
```bash
sudo apt install -y git
```

**Verify**:
```bash
git --version    # git version 2.43.x or newer
```

---

### D4. `curl` and `rsync` — download & sync files

**Why**:
- `curl` — used by many install scripts and by us for smoke tests.
- `rsync` — used by your Mac to push the built frontend to the server.

**Install** (usually pre-installed but confirm):
```bash
sudo apt install -y curl rsync
```

**Verify**:
```bash
curl --version | head -1     # curl 8.x
rsync --version | head -1    # rsync version 3.2.x
```

---

### D5. Python 3.12 + venv + dev headers + pip

**Why**: Ubuntu 24.04 ships with Python 3.12 as `python3`. We need three extra bits:
- `python3-venv` → to create the isolated virtualenv for the backend.
- `python3-dev` → header files so pip can compile `bcrypt` and `cryptography`.
- `python3-pip` → package manager for Python.

**Install**:
```bash
sudo apt install -y python3 python3-venv python3-pip python3-dev
```

**Verify**:
```bash
python3 --version           # Python 3.12.x
python3 -m venv --help >/dev/null && echo "venv OK"
pip3 --version              # pip 24.x
```

---

### D6. `nginx` — web server & reverse proxy

**Why**: Serves the compiled React `build/` folder as a static website, and forwards every request beginning with `/api/` to the FastAPI backend running on port 8001.

**Install**:
```bash
sudo apt install -y nginx
```

**Verify**:
```bash
nginx -v                    # nginx version: nginx/1.24.x
sudo systemctl status nginx | head -5
# should say "active (running)"
curl -I http://127.0.0.1/   # HTTP/1.1 200 OK (default page)
```

You can also open **http://YOUR-STATIC-IP/** in a browser — you should see the default nginx welcome page. This confirms port 80 is reachable from the internet.

---

### D7. `supervisor` — process manager for uvicorn

**Why**: Keeps the FastAPI backend running 24/7. If it crashes, supervisor auto-restarts it. It also starts the backend automatically on reboot.

**Install**:
```bash
sudo apt install -y supervisor
```

**Verify**:
```bash
supervisord --version       # 4.2.x
sudo systemctl status supervisor | head -5
# should say "active (running)"
sudo supervisorctl status
# empty output = installed correctly, no programs yet
```

---

### D8. `certbot` + Nginx plugin — free HTTPS certificates

**Why**: Automates Let's Encrypt SSL. It talks to Let's Encrypt, proves you control the domain, gets a cert, edits your nginx config to use it, and sets up auto-renewal.

**Install**:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**Verify**:
```bash
certbot --version                                # certbot 2.x
sudo certbot plugins 2>/dev/null | grep nginx    # * nginx
```

(We don't run certbot yet — that comes in Part F once nginx has our site config.)

---

### D9. `ufw` — firewall

**Why**: Ubuntu's default firewall. Blocks every port except SSH, HTTP, HTTPS. Lightsail already has its own firewall (B3), but a host-level firewall is defence-in-depth.

**Install** (usually pre-installed on Ubuntu):
```bash
sudo apt install -y ufw
```

**Configure & enable**:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

**Verify**:
```bash
sudo ufw status
# Status: active
# OpenSSH        ALLOW  Anywhere
# Nginx Full     ALLOW  Anywhere
```

⚠️ If you SSH from a shared network and get locked out, re-open SSH from the Lightsail web-based "Connect using SSH" browser terminal.

---

### D10. `unattended-upgrades` — automatic security patches

**Why**: Ubuntu will apply security updates in the background so you don't have to. Highly recommended for a production server.

**Install**:
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Answer: Yes
```

**Verify**:
```bash
systemctl status unattended-upgrades | head -5   # active
sudo unattended-upgrade --dry-run 2>&1 | tail -3
```

---

### D11. `nano` — text editor (already installed)

**Why**: The friendliest terminal editor. We'll use it to open `.env`.
Save with **Ctrl+O**, **Enter**. Exit with **Ctrl+X**.

**Verify**:
```bash
nano --version | head -1     # GNU nano, version 7.x
```

If missing: `sudo apt install -y nano`.

---

# Part E — Deploy the application

### E1. 🐧 Prepare the /app directory
```bash
sudo mkdir -p /app
sudo chown $USER:$USER /app
```

### E2. 🐧 Clone your GitHub repo

**Public repo:**
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git /app
```

**Private repo** — generate a read-only deploy key first:
```bash
ssh-keygen -t ed25519 -C "lightsail-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```
Copy that public key → GitHub **Repo → Settings → Deploy keys → Add key** (read-only). Then:
```bash
git clone git@github.com:YOUR-USERNAME/YOUR-REPO.git /app
```

**Verify**:
```bash
ls /app                     # backend  frontend  deploy  ...
ls /app/deploy              # bootstrap.sh, nginx.conf, supervisor.conf, ...
```

---

### E3. 🐧 Create the backend virtualenv

**Why a venv**: Isolates the Python packages this app needs from the system Python. Safe, reversible, standard.

```bash
cd /app/backend
python3 -m venv venv
source venv/bin/activate
```
Your prompt should now start with `(venv)`.

**Verify**:
```bash
which python                 # /app/backend/venv/bin/python
python --version             # Python 3.12.x
```

---

### E4. 🐧 Install Python dependencies

**Why**: `requirements-prod.txt` lists exactly what the backend imports — nothing more (no LLM, no Stripe, no boto3). ~180 MB total.

```bash
pip install --upgrade pip
pip install -r requirements-prod.txt
```
(Takes 2–3 minutes on the first run.)

**Verify**:
```bash
python -c "import fastapi, motor, jose, passlib; print('imports OK')"
# imports OK
```

Then leave the venv:
```bash
deactivate
```

---

### E5. 🐧 Fill in the backend `.env`

**Generate two secrets**:
```bash
# JWT secret
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(64))"

# Admin password hash — REPLACE 'MyStrongPass!' with your real password
/app/backend/venv/bin/python -c "from passlib.hash import bcrypt; print('ADMIN_PASSWORD_HASH=' + bcrypt.hash('MyStrongPass!'))"
```
📋 Copy both output lines.

**Copy the template**:
```bash
cp /app/deploy/backend.env.example /app/backend/.env
sudo nano /app/backend/.env
```

**Edit the file** so it looks like this (paste your real values from your notes):
```env
MONGO_URL=mongodb+srv://fidelis_app:YOUR_ATLAS_PASSWORD@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=fidelislogic
CORS_ORIGINS=https://fidelislogic.com,https://www.fidelislogic.com
SITE_BASE_URL=https://fidelislogic.com
JWT_SECRET_KEY=paste_the_JWT_line_you_generated
```
Save with **Ctrl+O**, **Enter**. Exit with **Ctrl+X**.

**Lock down permissions**:
```bash
sudo chown -R www-data:www-data /app/backend
sudo chmod 640 /app/backend/.env
```

---

### E6. 🐧 Install the supervisor unit — starts the backend

**Why**: This registers a supervisor "program" that runs `uvicorn` as user `www-data` on port 8001 and auto-restarts if it crashes.

```bash
sudo cp /app/deploy/supervisor.conf /etc/supervisor/conf.d/fidelislogic-backend.conf
sudo supervisorctl reread
sudo supervisorctl update
```

**Verify**:
```bash
sudo supervisorctl status
# fidelislogic-backend    RUNNING   pid 1234, uptime 0:00:05
```

If status is not `RUNNING`, inspect the log:
```bash
sudo tail -n 100 /var/log/supervisor/fidelislogic-backend.err.log
```
Most common cause: typo in `MONGO_URL` (special character in password not URL-encoded — replace `@` with `%40`, `#` with `%23`, etc.).

**Smoke test the API locally**:
```bash
curl -s http://127.0.0.1:8001/api/brands
# [] or a JSON array
```

---

### E7. 🐧 Install the nginx site

**Why**: Nginx will serve your React files at `/` and forward `/api/*` to `127.0.0.1:8001`.

```bash
sudo cp /app/deploy/nginx.conf /etc/nginx/sites-available/fidelislogic
sudo ln -sf /etc/nginx/sites-available/fidelislogic /etc/nginx/sites-enabled/fidelislogic
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**Verify**:
```bash
sudo nginx -t
# nginx: syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### E8. 🐧 Prepare the web root
```bash
sudo mkdir -p /var/www/fidelislogic
sudo chown -R ubuntu:www-data /var/www/fidelislogic
sudo chmod -R 775 /var/www/fidelislogic
```

**Verify**:
```bash
ls -la /var/www/fidelislogic
# drwxrwxr-x 2 ubuntu www-data ...
```

We give ownership to `ubuntu` so future `rsync` calls from your Mac don't need `sudo`.

---

# Part F — Build on your MacBook and push to the server

### F1. 🍎 Install Homebrew, Node 20, Yarn (one-time)
```bash
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node & Yarn
brew install node@20
brew link --overwrite node@20
npm install -g yarn
```
**Verify**:
```bash
node --version   # v20.x
yarn --version   # 1.22.x
```

### F2. 🍎 Clone the repo locally
```bash
mkdir -p ~/Projects && cd ~/Projects
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git fidelislogic
cd fidelislogic/frontend
```

### F3. 🍎 Write the production frontend `.env`
This bakes the API URL into the JS bundle at build time.
```bash
echo 'REACT_APP_BACKEND_URL=https://fidelislogic.com' > .env
```

### F4. 🍎 Install and build
```bash
yarn install       # ~2 min the first time
yarn build         # ~2 min
```
Result: a static site in `frontend/build/`.

### F5. 🍎 Rsync the build to the server
```bash
rsync -avz --delete \
      -e "ssh -i ~/.ssh/fidelislogic.pem" \
      build/ \
      ubuntu@13.245.67.89:/var/www/fidelislogic/
```
Takes ~10 seconds.

### F6. 🍎 Test the site over HTTP (before SSL)
Open **http://fidelislogic.com/** in a browser. You should see the real site (not the nginx welcome page).
API check:
```bash
curl -s http://fidelislogic.com/api/brands
```

---

# Part G — Enable HTTPS with Let's Encrypt

### G1. 🐧 Run certbot
```bash
sudo certbot --nginx \
     -d fidelislogic.com -d www.fidelislogic.com \
     --redirect --agree-tos --no-eff-email \
     -m you@fidelislogic.com
```

What each flag does:
- `--nginx` → automatically edits your nginx config.
- `-d ...` → the domains to issue the cert for.
- `--redirect` → also add a 301 redirect from HTTP to HTTPS.
- `--agree-tos --no-eff-email` → skip interactive prompts.
- `-m` → email for renewal reminders.

**Verify**:
```bash
sudo certbot certificates
# expires in ~90 days, will auto-renew
curl -I https://fidelislogic.com/   # HTTP/2 200
```

Open **https://fidelislogic.com** — you now have the padlock icon.

---

# Part H — Create the admin user

```bash
curl -X POST "https://fidelislogic.com/api/auth/create-admin?username=admin&password=MyStrongPass!"
# {"message":"Admin user created successfully"}
```
(You'll get an error if a user already exists — that's fine.)

Log in at **https://fidelislogic.com/admin** with `admin` / `MyStrongPass!`.

---

# Part I — Lock down Atlas

### I1. ☁️ Whitelist only the Lightsail IP
1. Atlas → **Network Access**
2. Delete the `0.0.0.0/0` entry
3. Add new: `13.245.67.89/32` (your static IP)
4. **Confirm**

Give it 2 minutes — the backend should keep working. If it can't connect, `sudo supervisorctl restart fidelislogic-backend` and check logs.

---

# Day-2 operations

### 🍎 Deploy a frontend change
```bash
cd ~/Projects/fidelislogic
git pull
cd frontend && yarn build
rsync -avz --delete -e "ssh -i ~/.ssh/fidelislogic.pem" \
      build/ ubuntu@13.245.67.89:/var/www/fidelislogic/
```

### 🐧 Deploy a backend change
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89
cd /app && git pull
# only if requirements-prod.txt changed:
/app/backend/venv/bin/pip install -r backend/requirements-prod.txt
sudo supervisorctl restart fidelislogic-backend
```

### 🐧 View logs
```bash
sudo tail -f /var/log/supervisor/fidelislogic-backend.err.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 🐧 Restart services
```bash
sudo supervisorctl restart fidelislogic-backend
sudo systemctl reload nginx
```

### 🍎 Handy SSH shortcut
Add to `~/.ssh/config`:
```
Host fidelis
    HostName 13.245.67.89
    User ubuntu
    IdentityFile ~/.ssh/fidelislogic.pem
```
Then just `ssh fidelis`.

---

# Troubleshooting

| Symptom | Fix |
|---|---|
| `502 Bad Gateway` | Backend crashed. `sudo supervisorctl restart fidelislogic-backend`, check `/var/log/supervisor/fidelislogic-backend.err.log`. |
| Certbot fails: "DNS problem" | DNS hasn't propagated. `dig +short fidelislogic.com` must return your IP. Wait 5 min. |
| Certbot fails: "Timeout during connect" | Port 80 blocked. Check UFW (`sudo ufw status`) and Lightsail Networking firewall. |
| `/admin` login fails | Admin never created (step H) OR `JWT_SECRET_KEY` was changed since (invalidates existing tokens). |
| Mongo "Authentication failed" in logs | Password in `MONGO_URL` has a special char. URL-encode: `@` → `%40`, `#` → `%23`, `!` → `%21`. |
| Mongo "IP not whitelisted" | Add Lightsail static IP to Atlas Network Access (`x.x.x.x/32`). |
| `yarn build` OOM on your Mac | `NODE_OPTIONS=--max-old-space-size=4096 yarn build` |
| Site shows old content after deploy | Hard-refresh (Cmd+Shift+R). CRA hashes assets so cache is safe; only `index.html` cache matters. |
| `nginx -t` says "duplicate default server" | You left the default site enabled. `sudo rm /etc/nginx/sites-enabled/default && sudo systemctl reload nginx`. |
| SSH says "Permission denied (publickey)" | Wrong path or permissions on the .pem. `chmod 600 ~/.ssh/fidelislogic.pem`. |

---

# Costs

| Item | Cost |
|---|---|
| Lightsail 1 GB instance | **$5 / month** |
| Lightsail static IP (attached) | **free** |
| MongoDB Atlas M0 | **free forever** |
| Let's Encrypt TLS | **free** |
| Domain | ~$12 / year |
| **Total** | **~$5 / month + domain** |

Done. Bookmark this file — you're production-ready. 🚀
