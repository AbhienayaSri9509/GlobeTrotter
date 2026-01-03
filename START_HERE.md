# 🚀 START HERE - Complete Setup Guide

## ✅ All Issues Fixed - Ready to Run!

### Quick Start (3 Steps)

#### Step 1: Start Backend Server

**Option A: Use Batch File (Easiest)**
- Double-click: **`start-backend.bat`**
- Wait for: "GlobeTrotter backend listening on http://localhost:5000"
- **Keep window open!**

**Option B: Manual Start**
```bash
cd backend
npm start
```

#### Step 2: Verify Backend is Running

Open browser: **http://localhost:5000/api/health**

Should see:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

#### Step 3: Start Frontend (if not already running)

**Option A: Use Batch File**
- Double-click: **`start-frontend.bat`**

**Option B: Manual Start**
```bash
cd frontend
npm start
```

---

## 🎯 Test Login

1. Go to: **http://localhost:3000/login**
2. Use demo credentials:
   - **Email:** `demo@local`
   - **Password:** `password`
3. Click **Login**
4. Should work! ✅

---

## 🔧 If Something Goes Wrong

### Backend Not Starting?

**Check 1: Port 5000 in use?**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
# If something is using it, kill it or use different port
```

**Check 2: Database exists?**
```bash
cd backend
npm run seed
npm start
```

**Check 3: Dependencies installed?**
```bash
cd backend
npm install
npm start
```

### Login Still Fails?

**Check 1: Backend running?**
- Terminal should show: "listening on http://localhost:5000"
- Test: http://localhost:5000/api/health

**Check 2: Browser Console (F12)**
- Look for error messages
- Check Network tab

**Check 3: Test Database**
```bash
cd backend
npm test
```

Should show:
```
✅ Database connected!
✅ Cities in database: 15
✅ Activities in database: 20+
✅ All checks passed!
```

---

## 📋 Complete Checklist

Before trying to login, verify:

- [ ] Backend terminal shows: "listening on http://localhost:5000"
- [ ] http://localhost:5000/api/health works in browser
- [ ] Frontend is running on http://localhost:3000
- [ ] Database is seeded (run `npm run seed` if needed)
- [ ] No errors in backend terminal
- [ ] Browser console shows no connection errors

---

## 🎉 Success!

Once both servers are running:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ Login: demo@local / password

**Everything should work perfectly!** 🚀

---

## 📞 Quick Reference

| What | Command |
|------|---------|
| Start Backend | `cd backend && npm start` |
| Start Frontend | `cd frontend && npm start` |
| Seed Database | `cd backend && npm run seed` |
| Test Connection | `cd backend && npm test` |
| Health Check | http://localhost:5000/api/health |

---

**Remember: Backend MUST be running before you can login!**

