import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles.css';

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadActivities();
    loadCities();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCity, selectedCategory, maxCost]);

  async function loadActivities() {
    setLoading(true);
    try {
      const data = await api.getActivities();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCities() {
    try {
      const data = await api.getCities();
      const uniqueCities = [...new Set(data.map(c => c.name))];
      setCities(uniqueCities);
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }

  async function performSearch() {
    setLoading(true);
    try {
      const data = await api.searchActivities(searchQuery, selectedCity, selectedCategory, maxCost);
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error searching activities:', err);
      // Fallback to all activities
      const data = await api.getActivities();
      setActivities(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['sightseeing', 'museum', 'food', 'adventure', 'entertainment', 'leisure'];

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Activity Search</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Discover activities and things to do around the world
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="number"
              placeholder="Max cost ($)"
              value={maxCost}
              onChange={e => setMaxCost(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Searching activities...</div>
      ) : activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3 className="empty-state-title">No activities found</h3>
          <p className="empty-state-text">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="trip-grid">
          {activities.map(activity => (
            <div key={activity.id} className="trip-card">
              <div className="trip-card-header">
                <h3 className="trip-card-title">{activity.name}</h3>
                {activity.category && (
                  <span className="badge badge-primary">{activity.category}</span>
                )}
              </div>
              {activity.city && (
                <div style={{ marginBottom: '8px' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    📍 {activity.city}
                  </span>
                </div>
              )}
              {activity.description && (
                <p className="trip-card-description">{activity.description}</p>
              )}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
                  <span><strong>Cost:</strong> ${activity.cost || 0}</span>
                  {activity.duration_minutes && (
                    <span><strong>Duration:</strong> {Math.floor(activity.duration_minutes / 60)}h {activity.duration_minutes % 60}m</span>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    alert('Select a trip stop to add this activity in the Itinerary Builder');
                  }}
                  style={{ width: '100%' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

