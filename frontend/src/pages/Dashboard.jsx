import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
    
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tripsData, citiesData] = await Promise.all([
        api.getTrips().catch(() => []),
        api.getCities().catch(() => [])
      ]);
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const recentTrips = trips.slice(0, 6);
  const recommendedCities = cities.slice(0, 6);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}! 👋</h1>
        <p>Plan your next adventure with GlobeTrotter</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-value">{trips.length}</p>
          <p className="stat-label">Total Trips</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{trips.filter(t => new Date(t.end_date) >= new Date()).length}</p>
          <p className="stat-label">Upcoming Trips</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{trips.filter(t => t.is_public).length}</p>
          <p className="stat-label">Shared Trips</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Recent Trips</h2>
        <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
          + Plan New Trip
        </Link>
      </div>

      {recentTrips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <h3 className="empty-state-title">No trips yet</h3>
          <p className="empty-state-text">Start planning your first adventure!</p>
          <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block' }}>
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trip-grid">
          {recentTrips.map(trip => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card">
              <div className="trip-card-header">
                <h3 className="trip-card-title">{trip.name}</h3>
                {trip.is_public && <span className="badge badge-primary">Shared</span>}
              </div>
              <div className="trip-card-date">
                {trip.start_date && trip.end_date ? (
                  `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                ) : (
                  'Dates TBD'
                )}
              </div>
              {trip.description && (
                <p className="trip-card-description">{trip.description}</p>
              )}
              <div className="trip-card-footer">
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: '48px' }}>
        <h2>Recommended Destinations</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Popular cities to explore</p>
        {recommendedCities.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No cities available</p>
        ) : (
          <div className="trip-grid">
            {recommendedCities.map(city => (
              <div key={city.id} className="trip-card" style={{ cursor: 'default' }}>
                <div className="trip-card-header">
                  <h3 className="trip-card-title">{city.name}</h3>
                  <span className="badge badge-success">{city.country}</span>
                </div>
                {city.description && (
                  <p className="trip-card-description">{city.description}</p>
                )}
                <div style={{ marginTop: '12px', fontSize: '0.875rem', color: '#6b7280' }}>
                  Cost Index: {city.cost_index}/100 • Popularity: {city.popularity}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '48px', background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
          <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
            Create New Trip
          </Link>
          <Link to="/trips" className="btn-secondary" style={{ textDecoration: 'none' }}>
            View All Trips
          </Link>
          <Link to="/search" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Search Cities
          </Link>
          <Link to="/activity-search" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Browse Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
