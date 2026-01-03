import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Itinerary() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  useEffect(() => {
    fetchTrip();
    loadActivities();
    loadCities();
  }, [id]);

  async function fetchTrip() {
    setLoading(true);
    try {
      const tripData = await api.getTrip(id);
      const stops = tripData.stops || [];
      
      // Fetch activities for each stop
      const stopsWithActivities = await Promise.all(
        stops.map(async (stop) => {
          try {
            const activities = await api.getActivitiesByStop(stop.id);
            return { ...stop, activities: activities || [] };
          } catch (err) {
            return { ...stop, activities: [] };
          }
        })
      );
      
      setTrip({ ...tripData, stops: stopsWithActivities });
    } catch (err) {
      console.error('Error loading trip:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadActivities() {
    try {
      const data = await api.getActivities();
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  }

  async function loadCities() {
    try {
      const data = await api.getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }

  async function handleAddStop(e) {
    e.preventDefault();
    try {
      const position = (trip?.stops?.length || 0);
      await api.createStop({ 
        trip_id: Number(id), 
        city, 
        country: country || null,
        start_date: startDate || null, 
        end_date: endDate || null,
        position
      });
      setCity('');
      setCountry('');
      setStartDate('');
      setEndDate('');
      fetchTrip();
    } catch (err) {
      console.error('Error adding stop:', err);
      alert('Failed to add stop: ' + (err.error || err.message));
    }
  }

  async function handleDeleteStop(stopId) {
    if (!window.confirm('Are you sure you want to delete this stop?')) return;
    try {
      await api.deleteStop(stopId);
      fetchTrip();
    } catch (err) {
      console.error('Error deleting stop:', err);
      alert('Failed to delete stop');
    }
  }

  async function handleAddActivityToStop(stopId, activityId) {
    try {
      await api.addActivityToStop({ stop_id: stopId, activity_id: activityId });
      fetchTrip();
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('Failed to add activity');
    }
  }

  async function handleDeleteActivity(tripActivityId) {
    if (!window.confirm('Remove this activity from the trip?')) return;
    try {
      await api.deleteTripActivity(tripActivityId);
      fetchTrip();
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to remove activity');
    }
  }

  async function toggleShare() {
    try {
      const newVal = trip.is_public ? 0 : 1;
      const res = await api.setTripPublic(id, newVal);
      setTrip(res);
    } catch (err) {
      console.error('Error toggling share:', err);
      alert('Failed to update sharing settings');
    }
  }

  function selectCityFromSearch(cityData) {
    setCity(cityData.name);
    setCountry(cityData.country);
    setShowCitySearch(false);
    setCitySearchQuery('');
  }

  const filteredCities = cities.filter(c => 
    !citySearchQuery || 
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading itinerary...</div>;
  }

  if (!trip) {
    return <div className="error-message">Trip not found.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{trip.name}</h1>
          <p style={{ color: '#6b7280' }}>
            {trip.description || 'Build your itinerary by adding cities and activities'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/trips/${id}/view`} className="btn-secondary">View Itinerary</Link>
          <Link to={`/trips/${id}/calendar`} className="btn-secondary">Calendar</Link>
          <Link to={`/trips/${id}/budget`} className="btn-secondary">Budget</Link>
          <button onClick={toggleShare} className={trip.is_public ? 'btn-primary' : 'btn-secondary'}>
            {trip.is_public ? '✓ Shared' : 'Share Trip'}
          </button>
          {trip.is_public && (
            <a 
              href={`/public/${trip.id}`} 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              View Public
            </a>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">Add a Stop (City)</h2>
        <form onSubmit={handleAddStop}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <div style={{ position: 'relative' }}>
                <input 
                  value={city} 
                  onChange={e => {
                    setCity(e.target.value);
                    setShowCitySearch(true);
                    setCitySearchQuery(e.target.value);
                  }}
                  onFocus={() => setShowCitySearch(true)}
                  placeholder="Type to search cities..."
                  required 
                />
                {showCitySearch && citySearchQuery && filteredCities.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    marginTop: '4px'
                  }}>
                    {filteredCities.slice(0, 5).map(c => (
                      <div
                        key={c.id}
                        onClick={() => selectCityFromSearch(c)}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #e5e7eb'
                        }}
                        onMouseEnter={e => e.target.style.background = '#f9fafb'}
                        onMouseLeave={e => e.target.style.background = 'white'}
                      >
                        <strong>{c.name}</strong>, {c.country}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Country (optional)</label>
              <input 
                value={country} 
                onChange={e => setCountry(e.target.value)}
                placeholder="Auto-filled if city selected"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '16px', width: 'auto' }}>
            Add Stop
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '24px' }}>Stops ({trip.stops?.length || 0})</h2>
        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="empty-state">
            <div className="empty-state-icon">📍</div>
            <h3 className="empty-state-title">No stops yet</h3>
            <p className="empty-state-text">Add cities above to start building your itinerary</p>
          </div>
        ) : (
          trip.stops.map((stop, index) => (
            <div key={stop.id} className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        {stop.city}{stop.country ? `, ${stop.country}` : ''}
                      </h3>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                        {stop.start_date && stop.end_date ? (
                          `${new Date(stop.start_date).toLocaleDateString()} - ${new Date(stop.end_date).toLocaleDateString()}`
                        ) : (
                          'Dates TBD'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={selectedStopId === stop.id ? 'btn-primary btn-small' : 'btn-secondary btn-small'}
                    onClick={() => setSelectedStopId(selectedStopId === stop.id ? null : stop.id)}
                  >
                    {selectedStopId === stop.id ? '✓ Selected' : 'Select'}
                  </button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDeleteStop(stop.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {stop.activities && stop.activities.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <h4 style={{ marginBottom: '12px' }}>Activities ({stop.activities.length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stop.activities.map((act, actIndex) => (
                      <div key={actIndex} style={{ 
                        padding: '12px', 
                        background: '#f9fafb', 
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{act.activity_name}</strong>
                          {act.activity_category && (
                            <span className="badge badge-primary" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>
                              {act.activity_category}
                            </span>
                          )}
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                            ${(act.cost || act.activity_cost || 0).toFixed(2)}
                          </div>
                        </div>
                        <button
                          className="btn-danger btn-small"
                          onClick={() => handleDeleteActivity(act.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedStopId && (
        <div className="card" style={{ marginTop: '24px' }}>
          <h2 className="card-title">Add Activities to Selected Stop</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Select activities to add to: {trip.stops?.find(s => s.id === selectedStopId)?.city}
          </p>
          <Link to="/activity-search" className="btn-secondary" style={{ textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
            Search More Activities
          </Link>
          {activities.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No activities available. Check back later or add custom activities.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {activities.slice(0, 20).map(a => (
                <div key={a.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <strong>{a.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                    {a.city} • ${a.cost || 0}
                    {a.category && <span className="badge badge-primary" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>{a.category}</span>}
                  </div>
                  <button
                    className="btn-primary btn-small"
                    onClick={() => handleAddActivityToStop(selectedStopId, a.id)}
                    style={{ marginTop: '8px', width: '100%' }}
                  >
                    Add to Stop
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
