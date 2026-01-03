import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'days'

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function loadTrip() {
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

  if (loading) {
    return <div className="loading">Loading itinerary...</div>;
  }

  if (!trip) {
    return <div className="error-message">Trip not found</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{trip.name}</h1>
          <p style={{ color: '#6b7280' }}>
            {trip.start_date && trip.end_date ? (
              `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
            ) : (
              'Dates TBD'
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={viewMode === 'days' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('days')}
          >
            Day View
          </button>
          <Link to={`/trips/${id}/calendar`} className="btn-secondary">Calendar</Link>
          <Link to={`/trips/${id}/budget`} className="btn-secondary">Budget</Link>
          <Link to={`/trips/${id}`} className="btn-secondary">Edit</Link>
        </div>
      </div>

      {trip.description && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <p style={{ margin: 0, color: '#6b7280' }}>{trip.description}</p>
        </div>
      )}

      {viewMode === 'list' ? (
        <div>
          {(!trip.stops || trip.stops.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">📍</div>
              <h3 className="empty-state-title">No stops yet</h3>
              <p className="empty-state-text">Add cities and activities to build your itinerary</p>
              <Link to={`/trips/${id}`} className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block' }}>
                Build Itinerary
              </Link>
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
                      <h2 style={{ margin: 0 }}>
                        {stop.city}{stop.country ? `, ${stop.country}` : ''}
                      </h2>
                    </div>
                    <p style={{ margin: '8px 0 0 52px', color: '#6b7280' }}>
                      {stop.start_date && stop.end_date ? (
                        `${new Date(stop.start_date).toLocaleDateString()} - ${new Date(stop.end_date).toLocaleDateString()}`
                      ) : (
                        'Dates TBD'
                      )}
                    </p>
                  </div>
                </div>

                {stop.activities && stop.activities.length > 0 ? (
                  <div>
                    <h3 style={{ marginBottom: '12px', fontSize: '1.125rem' }}>Activities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {stop.activities.map((act, actIndex) => (
                        <div key={actIndex} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <strong style={{ fontSize: '1.125rem' }}>{act.activity_name || act.name}</strong>
                                {act.activity_category && (
                                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                                    {act.activity_category}
                                  </span>
                                )}
                              </div>
                              {act.activity_description && (
                                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                  {act.activity_description}
                                </p>
                              )}
                              <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                                {act.activity_duration && (
                                  <span>⏱ {Math.floor(act.activity_duration / 60)}h {act.activity_duration % 60}m</span>
                                )}
                                {act.scheduled_at && (
                                  <span>🕐 {act.scheduled_at}</span>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                                ${(act.cost || act.activity_cost || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                    No activities scheduled for this stop
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card">
          <p>Day view coming soon. Use list view or calendar view for now.</p>
          <Link to={`/trips/${id}/calendar`} className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block', marginTop: '16px' }}>
            View Calendar
          </Link>
        </div>
      )}
    </div>
  );
}

