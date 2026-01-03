# 🚀 QUICK START GUIDE

## ⚠️ YOU NEED TO START THE BACKEND SERVER!

Your frontend is running, but you're getting "Failed to fetch" because **the backend is not running**.

---

## ✅ EASIEST WAY: Use the Batch File

### Double-click this file:
**`start-backend.bat`**

A terminal window will open. Wait for this message:
```
GlobeTrotter backend listening on http://localhost:5000
```

**Keep that window open!** Don't close it.

Then try logging in again. ✅

---

## 📝 Manual Method (If batch file doesn't work)

### Step 1: Open a NEW Terminal
- Keep your frontend terminal running
- Open a **second** terminal window

### Step 2: Go to Backend Folder
```bash
cd D:\GlobeTrotter\backend
```

### Step 3: Start Server
```bash
npm start
```

### Step 4: Wait for This Message
```
GlobeTrotter backend listening on http://localhost:5000
```

### Step 5: Keep Terminal Open
**Don't close it!** The backend must stay running.

---

## 🎯 Test if Backend is Running

Open in browser:
```
http://localhost:5000/api/health
```

Should show:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

If you see an error → Backend is NOT running → Start it!

---

## 📋 What You Should See

**Terminal 1 (Frontend):**
```
webpack compiled successfully
Local: http://localhost:3000
```

**Terminal 2 (Backend):**
```
GlobeTrotter backend listening on http://localhost:5000
```

**Both must be running!**

---

## 🔧 Troubleshooting

### "Cannot find module"
```bash
cd backend
npm install
npm start
```

### "Port 5000 already in use"
Something else is using port 5000. Close it or use:
```bash
set PORT=5001
npm start
```

### Backend starts then stops
Check for error messages in terminal. Common issues:
- Missing database: Run `npm run seed`
- Missing dependencies: Run `npm install`

---

## ✅ Success!

Once backend is running:
1. Go to http://localhost:3000/login
2. Login with: `demo@local` / `password`
3. Should work! 🎉

---

**Remember: Backend must be running BEFORE you can login!**

