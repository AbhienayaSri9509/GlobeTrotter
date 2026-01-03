# 🔍 Quick Backend Check Guide

## "Failed to Fetch" Error - Quick Fix

This error means the frontend cannot connect to the backend server.

### Step 1: Check if Backend is Running

Open a new terminal and run:
```bash
cd backend
npm start
```

You should see:
```
GlobeTrotter backend listening on http://localhost:5000
```

### Step 2: Test Backend Connection

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"GlobeTrotter API is running"}
```

If you see an error or "This site can't be reached":
- ❌ Backend is NOT running
- ✅ Start it with: `cd backend && npm start`

### Step 3: Check Port Conflicts

If port 5000 is already in use:

**Option A: Use a different port**
```bash
# In backend directory
PORT=5001 npm start
```

Then update frontend `.env` file:
```
REACT_APP_API_URL=http://localhost:5001/api
```

**Option B: Find and stop the process using port 5000**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
# Note the PID, then:
taskkill /PID <PID> /F
```

### Step 4: Verify Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Should show: "GlobeTrotter backend listening on http://localhost:5000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Should open browser to http://localhost:3000
```

### Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Go to **Network** tab
5. Try to login
6. Check if `/api/auth/login` request shows:
   - ❌ Red (failed) = Backend not running
   - ✅ Status 200 = Working!
   - ✅ Status 401 = Wrong credentials (this is OK, means backend is working)

### Common Issues

| Problem | Solution |
|---------|----------|
| Backend not running | `cd backend && npm start` |
| Port 5000 in use | Use different port or kill process |
| CORS error | Backend CORS is configured, restart backend |
| "Cannot GET /" | This is normal, backend is running |
| Connection refused | Backend not started or wrong port |

### Quick Test Commands

**Test backend health:**
```bash
curl http://localhost:5000/api/health
```

**Test login endpoint:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@local\",\"password\":\"password\"}"
```

If these work, backend is fine. The issue is in the frontend connection.

---

**Most Common Fix:** Just make sure backend is running! 🚀

