# 🚀 How to Start Backend Server

## Step-by-Step Instructions

### Method 1: Using Command Line (Recommended)

1. **Open a NEW Terminal/Command Prompt**
   - Keep your frontend terminal running
   - Open a separate terminal for backend

2. **Navigate to Backend Folder**
   ```bash
   cd D:\GlobeTrotter\backend
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   
   OR directly:
   ```bash
   node server.js
   ```

4. **You Should See:**
   ```
   GlobeTrotter backend listening on http://localhost:5000
   ```

5. **Keep This Terminal Open!** 
   - Don't close it while using the app
   - The backend must stay running

### Method 2: Using the Batch File (Windows)

1. **Double-click:** `start-backend.bat`
2. A terminal window will open
3. Wait for: "GlobeTrotter backend listening on http://localhost:5000"
4. Keep the window open

### Method 3: Start Both Servers at Once

1. **Double-click:** `start-all.bat`
2. Two windows will open:
   - One for backend (port 5000)
   - One for frontend (port 3000)
3. Keep both windows open

## ✅ Verify Backend is Running

### Test 1: Check Terminal Output
Look for this message:
```
GlobeTrotter backend listening on http://localhost:5000
```

### Test 2: Open in Browser
Go to: **http://localhost:5000/api/health**

Should show:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

### Test 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for requests to `localhost:5000`
5. Should show status 200 (not failed)

## 🔧 Troubleshooting

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use a different port
set PORT=5001
npm start
```

### Problem: "Cannot find module"

**Solution:**
```bash
cd backend
npm install
npm start
```

### Problem: "Database error"

**Solution:**
```bash
cd backend
npm run seed
npm start
```

### Problem: Backend starts but stops immediately

**Check:**
1. Look for error messages in terminal
2. Check if `data.sqlite` exists in `backend/` folder
3. Run `npm run seed` to create database

## 📋 Complete Startup Checklist

- [ ] Backend terminal shows: "listening on http://localhost:5000"
- [ ] Browser test: http://localhost:5000/api/health works
- [ ] Frontend is running on http://localhost:3000
- [ ] No errors in backend terminal
- [ ] Can see request logs in backend terminal when trying to login

## 🎯 Quick Test

Once backend is running, try this in browser console (F12):
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "ok", message: "GlobeTrotter API is running"}`

---

**Remember: Backend must be running BEFORE you try to login!** 🚀

