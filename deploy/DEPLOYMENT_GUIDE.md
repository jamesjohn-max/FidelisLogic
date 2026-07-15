# Fidelis Logic — Complete Deployment Walkthrough
### AWS Lightsail + MongoDB Atlas (Free) + MacBook build

This guide assumes **zero prior server experience**. Follow each step in order.
Total time: about **60–90 minutes** the first time.

Legend:
- 🖥️ = do this on your **MacBook**
- ☁️ = do this in a **browser** (AWS / Atlas / registrar console)
- 🐧 = do this on the **Lightsail server** (SSH terminal)

---

## Part A — MongoDB Atlas (free database) — ~10 min

### A1. ☁️ Create an Atlas account
1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with email or Google. Skip the paid options; pick **"Build a database"**.

### A2. ☁️ Create a free cluster
1. Choose the **M0 FREE** tier.
2. Provider: **AWS**. Region: pick the one closest to where your Lightsail server will live (e.g. `Bahrain (me-south-1)` or `Frankfurt (eu-central-1)` for UAE users).
3. Cluster name: `fidelislogic`. Click **Create**.

### A3. ☁️ Create a database user
1. Left sidebar → **Database Access** → **Add New Database User**.
2. Authentication Method: **Password**.
3. Username: `fidelis_app`
4. Password: click **Autogenerate Secure Password** → 📋 **COPY IT NOW** (paste it into a note; you'll need it in a minute).
5. Built-in Role: **Read and write to any database**.
6. **Add User**.

### A4. ☁️ Allow your server IP (temporarily use "anywhere" for setup)
1. Left sidebar → **Network Access** → **Add IP Address**.
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`). We'll tighten this in Part F.
3. **Confirm**.

### A5. ☁️ Grab the connection string
1. Left sidebar → **Database** → click **Connect** on your cluster.
2. Choose **Drivers**.
3. Driver: **Python**, Version: **3.12 or later**.
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://fidelis_app:<password>@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you saved in step A3.
6. 📋 Paste this final string into your note. You'll paste it into the server later.

✅ **Done with Atlas.**

---

## Part B — AWS Lightsail server — ~10 min

### B1. ☁️ Create the instance
1. Go to **https://lightsail.aws.amazon.com/**
2. Click **Create instance**.
3. **Instance location** — same region you picked in A2.
4. **Platform** — Linux/Unix.
5. **Blueprint** — **OS Only** → **Ubuntu 24.04 LTS**.
6. **Instance plan** — pick **$5/month** (1 GB RAM, 2 vCPU, 40 GB SSD). Do NOT pick $3.50 (512 MB won't work).
7. **Identify your instance** — name it `fidelislogic-prod`.
8. Click **Create instance**. Wait ~1 minute for status → **Running**.

### B2. ☁️ Give it a static IP
1. Click your instance → **Networking** tab.
2. Scroll to **Public IPv4** → click **Attach static IP**.
3. Name it `fidelislogic-ip` → **Create and attach**.
4. 📋 Copy the static IP shown (e.g. `13.245.67.89`). You'll need it for DNS.

### B3. ☁️ Open firewall ports
Still on **Networking** tab → **IPv4 Firewall** should already show:
- SSH (22) ✓
- HTTP (80) ✓
- HTTPS (443) ✓

If any is missing, click **Add rule** and add it.

### B4. ☁️ Download the SSH key
1. Top-right dropdown → **Account** → **SSH keys** tab.
2. Find the key for your region → **Download**. Save as `~/Downloads/LightsailDefaultKey.pem`.

### B5. 🖥️ Prepare the key on your Mac
Open **Terminal.app** and run:
```bash
mkdir -p ~/.ssh
mv ~/Downloads/LightsailDefaultKey-*.pem ~/.ssh/fidelislogic.pem
chmod 600 ~/.ssh/fidelislogic.pem
```

### B6. 🖥️ Test SSH login
Replace `13.245.67.89` with your actual static IP:
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89
```
Type **yes** when it asks about fingerprints. You should land in a prompt like `ubuntu@ip-xxx:~$`. Type `exit` to leave.

✅ **Server is reachable.**

---

## Part C — Point your domain at the server — ~5 min

### C1. ☁️ In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
Create **two A records**:

| Type | Name    | Value (your static IP)      | TTL     |
|------|---------|-----------------------------|---------|
| A    | `@`     | `13.245.67.89`              | 300     |
| A    | `www`   | `13.245.67.89`              | 300     |

Save. DNS usually propagates in 1–5 minutes.

### C2. 🖥️ Verify DNS is live
```bash
dig +short fidelislogic.com
dig +short www.fidelislogic.com
```
Both should print your static IP. If not, wait a bit longer.

---

## Part D — Initial server setup — ~15 min

### D1. 🖥️ SSH in
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89
```

### D2. 🐧 Update Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
```
(If prompted about GRUB or SSH config, press **Enter** on the default.)

### D3. 🐧 Get the code onto the server

**Option 1 (recommended) — clone from GitHub:**
```bash
sudo mkdir -p /app && sudo chown $USER:$USER /app
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git /app
```

**Option 2 — if the repo is private**, on your **Mac** first push it, then on the server generate a deploy key:
```bash
ssh-keygen -t ed25519 -C "lightsail-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```
Copy that public key → add it to GitHub → **Repo → Settings → Deploy keys → Add key** (read-only is fine).
Then:
```bash
sudo mkdir -p /app && sudo chown $USER:$USER /app
git clone git@github.com:YOUR-USERNAME/YOUR-REPO.git /app
```

### D4. 🐧 Run the one-shot bootstrap
```bash
bash /app/deploy/bootstrap.sh
```
This installs Nginx, Python, Supervisor, sets up the firewall, and creates the backend virtualenv. It takes about **5 minutes**.

When it finishes it will print a **NEXT STEPS** box. Don't panic — we do them next.

### D5. 🐧 Fill in the backend `.env`
Generate two secrets first (still on the server):
```bash
# JWT secret
python3 -c "import secrets; print('JWT_SECRET=' + secrets.token_urlsafe(64))"

# Admin password hash — REPLACE 'MyStrongPass!' with your real admin password
/app/backend/venv/bin/python -c "from passlib.hash import bcrypt; print('ADMIN_PASSWORD_HASH=' + bcrypt.hash('MyStrongPass!'))"
```
📋 Copy both lines it prints.

Now open the `.env`:
```bash
sudo nano /app/backend/.env
```
Edit these values (paste from your notes):
```env
MONGO_URL=mongodb+srv://fidelis_app:YOUR_PASSWORD@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=fidelislogic
JWT_SECRET=paste_the_line_you_just_generated
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=paste_the_bcrypt_line_you_just_generated
```
Save & exit: **Ctrl+O**, **Enter**, **Ctrl+X**.

### D6. 🐧 Restart the backend so it picks up the .env
```bash
sudo supervisorctl restart fidelislogic-backend
sleep 3
sudo supervisorctl status fidelislogic-backend
```
Expected: `RUNNING`. If not:
```bash
sudo tail -n 100 /var/log/supervisor/fidelislogic-backend.err.log
```

### D7. 🐧 Get the HTTPS certificate
```bash
sudo certbot --nginx \
    -d fidelislogic.com -d www.fidelislogic.com \
    --redirect --agree-tos --no-eff-email \
    -m you@fidelislogic.com
```
When it succeeds you'll see "Congratulations! Your certificate…". Auto-renewal is now enabled.

### D8. 🐧 Quick health check
```bash
curl -I https://fidelislogic.com/
curl -s https://fidelislogic.com/api/brands | head -c 300
```
The first should say `HTTP/2 200`. The second should print some JSON.

At this point the **API is live** but the site still shows the placeholder page. We fix that next.

---

## Part E — Build on MacBook & push to server — ~10 min

### E1. 🖥️ One-time: install Node 20 and Yarn
```bash
# Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node 20 + Yarn
brew install node@20
brew link --overwrite node@20
npm install -g yarn
```

### E2. 🖥️ Clone the repo (skip if you already have it)
```bash
cd ~/Projects   # or wherever
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git fidelislogic
cd fidelislogic/frontend
```

### E3. 🖥️ Create the frontend `.env`
```bash
echo 'REACT_APP_BACKEND_URL=https://fidelislogic.com' > .env
```

### E4. 🖥️ Install dependencies (only needed once, and again when they change)
```bash
yarn install
```

### E5. 🖥️ Build the production bundle
```bash
yarn build
```
Takes ~2 min. Result lands in `frontend/build/`.

### E6. 🖥️ First-time — let the deploy user write to the web root
SSH in once and give ownership of the web root to your login user so rsync doesn't need sudo:
```bash
ssh -i ~/.ssh/fidelislogic.pem ubuntu@13.245.67.89 \
    'sudo chown -R ubuntu:www-data /var/www/fidelislogic && sudo chmod -R 775 /var/www/fidelislogic'
```

### E7. 🖥️ Push the build to the server
```bash
rsync -avz --delete \
      -e "ssh -i ~/.ssh/fidelislogic.pem" \
      build/ \
      ubuntu@13.245.67.89:/var/www/fidelislogic/
```

### E8. 🖥️ Open the site in your browser
Go to **https://fidelislogic.com** — you should see the real Fidelis Logic site. 🎉

Admin: **https://fidelislogic.com/admin** — log in with `admin` + the password you used in step D5.

---

## Part F — Tighten security (do this once everything works) — ~5 min

### F1. ☁️ Restrict Atlas to only your server
1. Atlas → **Network Access** → delete the `0.0.0.0/0` entry.
2. Add a new entry with your Lightsail static IP + `/32` (e.g. `13.245.67.89/32`).

### F2. 🐧 Disable password SSH (keys only)
Already the default on Lightsail — no action needed unless you enabled passwords manually.

### F3. 🐧 Enable unattended security updates
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   # answer Yes
```

---

## Cheat sheet — Day 2 operations

### 🖥️ Deploy a frontend change
```bash
cd ~/Projects/fidelislogic/frontend
git pull
yarn build
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
sudo tail -f /var/log/supervisor/fidelislogic-backend.err.log   # API errors
sudo tail -f /var/log/nginx/access.log                          # web traffic
sudo tail -f /var/log/nginx/error.log                           # nginx errors
```

### 🐧 Restart everything
```bash
sudo supervisorctl restart fidelislogic-backend
sudo systemctl reload nginx
```

### 🖥️ Make an SSH shortcut (optional)
Add to `~/.ssh/config` on your Mac:
```
Host fidelis
    HostName 13.245.67.89
    User ubuntu
    IdentityFile ~/.ssh/fidelislogic.pem
```
Then you can simply type `ssh fidelis`.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `502 Bad Gateway` on the site | Backend crashed. `sudo supervisorctl restart fidelislogic-backend` and check the error log. |
| `certbot` fails with "DNS problem" | DNS hasn't propagated. Wait 5 min, retry. |
| Site loads but `/admin` login fails | `.env` `ADMIN_PASSWORD_HASH` was pasted wrong. Regenerate hash (step D5) and restart backend. |
| MongoDB "Authentication failed" in logs | Password in `MONGO_URL` has a special character; URL-encode it (e.g. `@` → `%40`). |
| MongoDB "IP not whitelisted" | Add Lightsail static IP to Atlas Network Access. |
| `yarn build` runs out of memory on Mac | `NODE_OPTIONS=--max-old-space-size=4096 yarn build` |
| Website shows old content after deploy | Browser cache. Cmd+Shift+R to hard-refresh. |

---

## What to expect for costs

| Item | Cost |
|---|---|
| Lightsail 1 GB instance | **$5/month** |
| Lightsail static IP (while attached) | **free** |
| MongoDB Atlas M0 | **free forever** |
| Let's Encrypt TLS cert | **free** |
| Domain (varies) | ~$12/year |
| **Total** | **~$5/month + domain** |

You're done. Bookmark this file. 👍
