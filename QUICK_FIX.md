# ⚡ Quick Fix for "Failed to Fetch"

## The Problem
Your frontend is running but **backend is not running**, causing "Failed to fetch" errors.

## ✅ Solution (3 Easy Steps)

### Step 1: Open a NEW Terminal Window
Keep your frontend terminal running, open a **second terminal** for the backend.

### Step 2: Start the Backend
In the new terminal, run:
```bash
cd backend
npm start
```

You should see:
```
GlobeTrotter backend listening on http://localhost:5000
```

### Step 3: Try Login Again
Go back to your browser and try logging in with:
- Email: `demo@local`
- Password: `password`

## 🚀 Quick Start Scripts (Windows)

I've created helper scripts for you:

### Option A: Start Both Servers at Once
Double-click: **`start-all.bat`**
- Opens backend in one window
- Opens frontend in another window
- Both start automatically

### Option B: Start Separately
- **`start-backend.bat`** - Starts only backend
- **`start-frontend.bat`** - Starts only frontend

## ✅ Verify Backend is Running

Open in browser: **http://localhost:5000/api/health**

Should show:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

If you see an error → Backend is NOT running → Start it!

## 📋 What You Need Running

**Terminal 1 (Backend):**
```
cd backend
npm start
→ Should show: "GlobeTrotter backend listening on http://localhost:5000"
```

**Terminal 2 (Frontend):**
```
cd frontend  
npm start
→ Should show: "webpack compiled successfully"
→ Browser opens to http://localhost:3000
```

## 🎯 Test Login

Once both are running:
1. Go to http://localhost:3000/login
2. Use: `demo@local` / `password`
3. Should work! ✅

---

**The backend server must be running for the frontend to work!** 🚀

