import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Search() {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCountries();
    loadCities();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery || selectedCountry) {
        performSearch();
      } else {
        loadCities();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCountry]);

  async function loadCities() {
    setLoading(true);
    try {
      const data = await api.getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading cities:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCountries() {
    try {
      const data = await api.getCountries();
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  }

  async function performSearch() {
    setLoading(true);
    try {
      const data = await api.searchCities(searchQuery, selectedCountry);
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error searching cities:', err);
    } finally {
      setLoading(false);
    }
  }

  function getCostLevel(costIndex) {
    if (costIndex < 40) return { label: 'Budget', color: 'badge-success' };
    if (costIndex < 70) return { label: 'Moderate', color: 'badge-warning' };
    return { label: 'Expensive', color: 'badge badge-primary' };
  }

  return (
    <div>
      <div className="card">
        <h1 className="card-title">City Search</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Discover cities around the world and add them to your trips
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Search by city name or country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Searching cities...</div>
      ) : cities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌍</div>
          <h3 className="empty-state-title">No cities found</h3>
          <p className="empty-state-text">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="trip-grid">
          {cities.map(city => {
            const costLevel = getCostLevel(city.cost_index);
            return (
              <div key={city.id} className="trip-card">
                <div className="trip-card-header">
                  <h3 className="trip-card-title">{city.name}</h3>
                  <span className={`badge ${costLevel.color}`}>{costLevel.label}</span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {city.country}
                  </span>
                </div>
                {city.description && (
                  <p className="trip-card-description">{city.description}</p>
                )}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>Cost Index: {city.cost_index}/100</span>
                    <span>Popularity: {city.popularity}%</span>
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      // Navigate to create trip with city pre-filled, or show modal to select trip
                      const tripId = prompt('Enter Trip ID to add this city to (or create a new trip first):');
                      if (tripId) {
                        navigate(`/trips/${tripId}`);
                      } else {
                        navigate('/create');
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
