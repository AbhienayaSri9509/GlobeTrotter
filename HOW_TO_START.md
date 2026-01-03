# 🚀 HOW TO START BACKEND SERVER - STEP BY STEP

## ⚠️ IMPORTANT: You Need TWO Terminal Windows

1. **Terminal 1** = Frontend (already running on port 3000) ✅
2. **Terminal 2** = Backend (MUST START THIS!) ❌

---

## 📝 Step-by-Step Instructions

### Step 1: Open a NEW Terminal Window
- **Don't close your frontend terminal!**
- Open a **second** terminal/command prompt
- You need BOTH running at the same time

### Step 2: Navigate to Backend Folder

In the NEW terminal, type:
```bash
cd D:\GlobeTrotter\backend
```

Press Enter.

### Step 3: Start the Backend Server

Type:
```bash
npm start
```

Press Enter.

### Step 4: Wait for This Message

You should see:
```
GlobeTrotter backend listening on http://localhost:5000
```

✅ **If you see this, backend is running!**

### Step 5: Keep Terminal Open

**IMPORTANT:** Don't close this terminal window!
- The backend must stay running
- Minimize it if needed, but don't close it

### Step 6: Test in Browser

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

### Step 7: Try Login Again

Now go back to your login page and try:
- Email: `demo@local`
- Password: `password`

It should work! ✅

---

## 🎯 Quick Visual Guide

```
┌─────────────────────────────────────┐
│  TERMINAL 1 (Frontend)              │
│  cd frontend                         │
│  npm start                           │
│  ✅ Running on http://localhost:3000 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TERMINAL 2 (Backend) - START THIS! │
│  cd backend                          │
│  npm start                           │
│  ✅ Running on http://localhost:5000│
└─────────────────────────────────────┘
```

---

## 🔧 Alternative: Use Batch Files (Windows)

### Option 1: Start Backend Only
1. Double-click: **`start-backend.bat`**
2. Wait for: "listening on http://localhost:5000"
3. Keep window open

### Option 2: Start Both at Once
1. Double-click: **`start-all.bat`**
2. Two windows open automatically
3. Keep both open

---

## ❌ Common Mistakes

### ❌ Mistake 1: Only Running Frontend
- Frontend alone = "Failed to fetch" error
- **Fix:** Start backend too!

### ❌ Mistake 2: Closing Backend Terminal
- Closing terminal = Backend stops
- **Fix:** Keep terminal open (minimize it)

### ❌ Mistake 3: Wrong Directory
- Running `npm start` in wrong folder
- **Fix:** Make sure you're in `D:\GlobeTrotter\backend`

---

## ✅ Success Checklist

- [ ] Backend terminal shows: "listening on http://localhost:5000"
- [ ] http://localhost:5000/api/health works in browser
- [ ] Frontend still running on http://localhost:3000
- [ ] Can login without "Failed to fetch" error

---

## 🆘 Still Not Working?

1. **Check backend terminal for errors**
2. **Verify you're in correct folder:** `cd D:\GlobeTrotter\backend`
3. **Try:** `node server.js` directly
4. **Check if port 5000 is free:** Close other apps using port 5000
5. **Reinstall dependencies:** `npm install` in backend folder

---

**Remember: Backend MUST be running for frontend to work!** 🚀

