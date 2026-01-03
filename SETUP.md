# GlobeTrotter - Quick Setup Guide

## 🚀 Quick Start

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Initialize Database

```bash
cd backend
npm run seed
```

This will create:
- Demo user: `demo@local` / `password`
- Admin user: `admin@local` / `admin`
- 15 cities with cost indices
- 20+ activities across multiple cities

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

The browser will automatically open to `http://localhost:3000`

## 📋 Features Checklist

✅ **Authentication**
- Login/Signup with validation
- JWT-based session management
- Password hashing with bcrypt

✅ **Trip Management**
- Create, view, edit, delete trips
- Add cities (stops) to trips
- Assign dates to stops
- Reorder stops

✅ **Activity Management**
- Browse activities by city/category
- Add activities to trip stops
- View activity costs and durations
- Remove activities from trips

✅ **Budget & Cost Tracking**
- Automatic budget calculation
- Category breakdown (Transport, Accommodation, Activities, Meals)
- Visual budget charts
- Per-stop cost analysis

✅ **Views & Visualization**
- Dashboard with trip overview
- Itinerary builder interface
- Calendar/Timeline view
- List view of trips

✅ **Search & Discovery**
- City search with filters
- Activity search by category/cost
- Country-based filtering
- Popular destinations display

✅ **Sharing & Collaboration**
- Public trip sharing
- Shareable links
- Social media integration (Twitter, Facebook, LinkedIn)
- Read-only public view

✅ **User Management**
- Profile editing
- Password change
- Account deletion
- User preferences

✅ **Admin Features**
- Analytics dashboard
- User engagement metrics
- Popular cities/activities tracking
- Platform usage statistics

## 🎯 Key Routes

### Public Routes
- `/login` - Login/Signup page
- `/public/:id` - Public trip view (no auth required)

### Protected Routes
- `/` - Dashboard
- `/trips` - My Trips list
- `/create` - Create new trip
- `/trips/:id` - Itinerary builder
- `/trips/:id/view` - Read-only itinerary view
- `/trips/:id/budget` - Budget breakdown
- `/trips/:id/calendar` - Calendar/Timeline view
- `/search` - City search
- `/activity-search` - Activity search
- `/profile` - User profile & settings
- `/admin` - Admin dashboard (admin only)

## 🔧 Troubleshooting

### Database Issues
If you encounter database errors:
1. Delete `backend/data.sqlite`
2. Run `npm run seed` again

### Port Already in Use
If port 5000 or 3000 is in use:
- Backend: Set `PORT` environment variable
- Frontend: React will prompt to use a different port

### CORS Errors
Ensure backend is running before frontend. Backend has CORS enabled for `localhost:3000`.

### Authentication Issues
- Clear browser localStorage
- Re-login with demo credentials
- Check backend console for JWT errors

## 📊 Database Schema

**Core Tables:**
- `users` - User accounts with authentication
- `trips` - User-created trips
- `stops` - Cities/destinations in trips
- `activities` - Available activities
- `trip_activities` - Activities assigned to stops
- `cities` - City database with cost indices
- `stop_costs` - Budget estimates per stop

## 🎨 Tech Stack

- **Frontend:** React 18, React Router 6, CSS3
- **Backend:** Node.js, Express.js, SQLite3
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## 📝 Notes

- Database is SQLite (file-based, no separate server needed)
- All data persists in `backend/data.sqlite`
- Admin access is controlled by `is_admin` flag in users table
- Public trips are accessible via `/public/:id` without authentication

## 🚀 Production Deployment

For production:
1. Set `JWT_SECRET` environment variable
2. Use PostgreSQL/MySQL instead of SQLite
3. Configure CORS for your domain
4. Set up HTTPS
5. Use environment variables for API URLs
6. Build frontend: `cd frontend && npm run build`
7. Serve static files from Express or use a CDN

---

**Happy Travel Planning! 🌍✈️**

