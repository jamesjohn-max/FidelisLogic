# Local Development Setup — MacBook M2 Pro

Complete steps to clone the repo and run Fidelis Logic locally.
Total time: **~15 minutes** the first time.

Legend: 🍎 = commands run in Terminal.app on your Mac.

---

## Prerequisites (one-time install)

If any of these are missing, install them first.

### 🍎 1. Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
After install, follow the two "Next steps" lines Homebrew prints (they add brew to your PATH).

### 🍎 2. Git, Node 20, Yarn, Python 3.12
```bash
brew install git node@20 yarn python@3.12
brew link --overwrite node@20
```

Verify:
```bash
git --version        # git ≥ 2.40
node --version       # v20.x
yarn --version       # 1.22.x
python3 --version    # 3.12.x
```

### 🍎 3. MongoDB — pick ONE option below

Both work. **Option A (local)** is simplest for pure dev; **Option B (Atlas)** mirrors production.

---

## Option A — Local MongoDB (recommended for dev)

Runs entirely offline on your Mac, uses ~150 MB RAM.

### 🍎 A1. Install
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

### 🍎 A2. Start it as a background service
```bash
brew services start mongodb-community@7.0
```
Verify:
```bash
brew services list | grep mongodb   # should say "started"
```

### 🍎 A3. Connection string for local Mongo
```
mongodb://localhost:27017
```
Nothing else needed — no user, no password.

To stop it later: `brew services stop mongodb-community@7.0`
To fully uninstall: `brew uninstall mongodb-community@7.0`

---

## Option B — MongoDB Atlas (mirror production)

Free forever, no install on your Mac. Follow **Part A** of `DEPLOYMENT_GUIDE.md`
(steps A1–A5) to get an Atlas connection string. When adding a network access rule,
add your **home IP** (Atlas shows a "Add Current IP Address" button).

Your connection string will look like:
```
mongodb+srv://fidelis_app:PASSWORD@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Step-by-step — clone & run

### 🍎 1. Clone the repo
```bash
mkdir -p ~/Projects && cd ~/Projects
git clone https://github.com/YOUR-USERNAME/fidelislogic.git
cd fidelislogic
```
Replace `YOUR-USERNAME/fidelislogic` with your actual repo.

### 🍎 2. Backend setup
```bash
cd backend

# create venv
python3 -m venv venv
source venv/bin/activate

# install dependencies
pip install --upgrade pip
pip install -r requirements-prod.txt
```

Create the backend `.env` file:
```bash
cat > .env <<'EOF'
# --- Database ---
# Option A (local Mongo):
MONGO_URL=mongodb://localhost:27017
# Option B (Atlas) — comment the line above and uncomment below:
# MONGO_URL=mongodb+srv://fidelis_app:PASSWORD@fidelislogic.xxxxx.mongodb.net/?retryWrites=true&w=majority

DB_NAME=fidelislogic_dev
CORS_ORIGINS=*
SITE_BASE_URL=http://localhost:3000

# --- Auth ---
JWT_SECRET_KEY=dev-only-secret-change-me-in-production
EOF
```

If you picked Atlas (Option B), edit `.env` and paste your real Atlas URI.

### 🍎 3. Start the backend
Keep this terminal window open:
```bash
# still in backend/ with venv activated
uvicorn server:app --reload --host 127.0.0.1 --port 8001
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8001
INFO:     Application startup complete.
```

Quick smoke test in another Mac terminal:
```bash
curl http://127.0.0.1:8001/api/brands
```
Should print `[]` (empty array — DB has no data yet) or existing brands.

### 🍎 4. Create your admin user (one-time)
In a **new terminal tab**, run:
```bash
curl -X POST "http://127.0.0.1:8001/api/auth/create-admin?username=admin&password=MyDevPass123"
```
Expected response: `{"message":"Admin user created successfully"}`

You can log in at `http://localhost:3000/admin` later with these credentials.

### 🍎 5. Frontend setup

Open a **second terminal tab** (leave the backend one running):
```bash
cd ~/Projects/fidelislogic/frontend

# install dependencies (takes ~2 min the first time)
yarn install
```

Create the frontend `.env`:
```bash
cat > .env <<'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
EOF
```

### 🍎 6. Start the frontend
```bash
yarn start
```
Wait ~30 seconds. Your browser auto-opens **http://localhost:3000**.

If the browser doesn't open, visit it manually. You should see the Fidelis Logic site.

**Admin login**: http://localhost:3000/admin → `admin` / `MyDevPass123`

---

## Daily workflow

You need **two terminal tabs** running at the same time:

**Tab 1 — Backend**
```bash
cd ~/Projects/fidelislogic/backend
source venv/bin/activate
uvicorn server:app --reload --host 127.0.0.1 --port 8001
```

**Tab 2 — Frontend**
```bash
cd ~/Projects/fidelislogic/frontend
yarn start
```

Both have **hot reload**: save any file → change appears in the browser automatically.

Stop each with **Ctrl+C**.

---

## Optional — seed some sample data

If your local Mongo is empty and you want realistic content:

```bash
# grab the auth token
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"MyDevPass123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# create a sample FAQ
curl -X POST http://localhost:8001/api/faqs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What services does Fidelis Logic provide?",
    "answer": "We offer IT consulting, cloud advisory, and cybersecurity services.",
    "order": 1,
    "is_published": true
  }'
```

You can also log into `/admin` in the browser and use the dashboard UI.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ModuleNotFoundError` when starting uvicorn | You forgot `source venv/bin/activate`. Or run `pip install -r requirements-prod.txt` again. |
| `Address already in use` on port 8001 | Another uvicorn is running. `lsof -i :8001` then `kill <PID>`. |
| `Address already in use` on port 3000 | Kill it: `lsof -i :3000` then `kill <PID>`. Or run `PORT=3001 yarn start`. |
| MongoDB "connection refused" | Local Mongo isn't running. `brew services start mongodb-community@7.0`. |
| Atlas "IP not whitelisted" | Add your Mac's current public IP in Atlas → Network Access. |
| Frontend loads but API calls fail (CORS or 404) | Check `frontend/.env` says `REACT_APP_BACKEND_URL=http://localhost:8001` — no trailing slash. Restart `yarn start` after any `.env` change. |
| Login says "Incorrect username or password" | You skipped step 4. Run the `create-admin` curl call. |
| bcrypt install fails on M2 | `brew install openssl` then rerun `pip install -r requirements-prod.txt`. |

---

## Useful GUI tools (optional)

- **MongoDB Compass** — GUI for your local (or Atlas) database. `brew install --cask mongodb-compass`. Connect to `mongodb://localhost:27017`.
- **Bruno** or **Postman** — hit API endpoints without curl. `brew install --cask bruno`.
- **VS Code** with the "Python" + "ES7+ React" extensions.

---

## Keeping local in sync with the server

```bash
# pull latest changes
cd ~/Projects/fidelislogic
git pull

# if backend deps changed:
cd backend && source venv/bin/activate
pip install -r requirements-prod.txt

# if frontend deps changed:
cd ../frontend
yarn install
```

Then restart whichever server (they usually hot-reload automatically anyway).

You're ready. 🚀
