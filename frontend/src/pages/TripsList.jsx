import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function TripsList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const res = await api.getTrips();
      setTrips(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tripId, tripName) {
    if (!window.confirm(`Are you sure you want to delete "${tripName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteTrip(tripId);
      loadTrips();
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip');
    }
  }

  if (loading) {
    return <div className="loading">Loading trips...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>My Trips</h1>
          <p style={{ color: '#6b7280' }}>Manage and organize all your travel plans</p>
        </div>
        <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', width: 'auto' }}>
          + Create New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <h3 className="empty-state-title">No trips yet</h3>
          <p className="empty-state-text">Start planning your next adventure!</p>
          <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block', marginTop: '16px' }}>
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map(trip => (
            <div key={trip.id} className="trip-card" style={{ position: 'relative' }}>
              <div className="trip-card-header">
                <Link 
                  to={`/trips/${trip.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
                >
                  <h3 className="trip-card-title">{trip.name}</h3>
                </Link>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {trip.is_public && (
                    <span className="badge badge-primary">Shared</span>
                  )}
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDelete(trip.id, trip.name)}
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    ×
                  </button>
                </div>
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
                <Link 
                  to={`/trips/${trip.id}`}
                  style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500 }}
                >
                  View Details →
                </Link>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link 
                    to={`/trips/${trip.id}/view`}
                    className="btn-secondary btn-small"
                    style={{ textDecoration: 'none' }}
                  >
                    View
                  </Link>
                  <Link 
                    to={`/trips/${trip.id}/budget`}
                    className="btn-secondary btn-small"
                    style={{ textDecoration: 'none' }}
                  >
                    Budget
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
