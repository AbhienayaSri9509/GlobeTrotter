# 🔧 Troubleshooting Login & Signup Issues

## Common Issues and Solutions

### Issue: "Login failed" or "Signup failed" error

#### 1. Check Backend is Running
```bash
cd backend
npm start
```
You should see: `GlobeTrotter backend listening on http://localhost:5000`

#### 2. Check Frontend API URL
The frontend connects to `http://localhost:5000/api` by default.

If your backend is on a different port, set:
```bash
# In frontend directory
export REACT_APP_API_URL=http://localhost:5000/api
# Or create .env file with:
# REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab**: Look for error messages
- **Network tab**: Check if requests to `/api/auth/login` or `/api/auth/signup` are failing

#### 4. CORS Issues
If you see CORS errors:
- Ensure backend has `cors` package installed: `npm install cors`
- Backend should have `app.use(cors())` in server.js
- Check that frontend URL matches CORS origin

#### 5. Database Issues
If signup fails with "email already exists":
- The email is already registered
- Try a different email or use the login page

#### 6. Network Errors
If you see "Network error" or "Failed to fetch":
- Backend is not running
- Backend is on wrong port
- Firewall blocking connection
- Check backend console for errors

### Testing the Connection

1. **Test Backend Health:**
   Open browser: `http://localhost:5000/api/health`
   Should return: `{"status":"ok","message":"GlobeTrotter API is running"}`

2. **Test Login Endpoint:**
   Use Postman or curl:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@local","password":"password"}'
   ```

3. **Check Browser Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login
   - Check the `/api/auth/login` request:
     - Status should be 200 (success) or 401 (wrong credentials)
     - If status is 0 or failed, backend is not reachable

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Network error" | Backend not running | Start backend server |
| "Invalid email or password" | Wrong credentials | Use correct email/password |
| "Email already exists" | Email registered | Use different email or login |
| "Password must be at least 6 characters" | Password too short | Use longer password |
| "Email and password are required" | Missing fields | Fill all required fields |
| CORS error | CORS not configured | Check backend CORS settings |

### Debug Steps

1. **Clear Browser Cache:**
   - Clear localStorage: `localStorage.clear()` in browser console
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check Backend Logs:**
   - Look at terminal where backend is running
   - Check for error messages

3. **Verify Database:**
   ```bash
   cd backend
   npm run seed  # Re-seed database
   ```

4. **Test with Demo Account:**
   - Email: `demo@local`
   - Password: `password`
   - If this works, the issue is with your credentials

### Still Not Working?

1. **Check all files are saved**
2. **Restart both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend again
   - Start frontend again

3. **Check for typos in:**
   - Email address
   - Password
   - API URL

4. **Verify dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

**If issues persist, check the browser console and backend terminal for specific error messages.**

