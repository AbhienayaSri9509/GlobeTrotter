import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripsList from './pages/TripsList';
import Itinerary from './pages/Itinerary';
import ItineraryView from './pages/ItineraryView';
import Budget from './pages/Budget';
import Calendar from './pages/Calendar';
import Search from './pages/Search';
import ActivitySearch from './pages/ActivitySearch';
import Profile from './pages/Profile';
import PublicTrip from './pages/PublicTrip';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <nav>
        <Link to="/" className="nav-brand">🌍 GlobeTrotter</Link>
        {user ? (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link to="/create">Create Trip</Link>
            <Link to="/search">Search Cities</Link>
            <Link to="/activity-search">Search Activities</Link>
            <Link to="/profile">Profile</Link>
            {user.is_admin && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="btn-secondary btn-small">Logout</button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Login</Link>
          </div>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsList /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
          <Route path="/trips/:id/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
          <Route path="/trips/:id/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/trips/:id/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/public/:id" element={<PublicTrip />} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/activity-search" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
