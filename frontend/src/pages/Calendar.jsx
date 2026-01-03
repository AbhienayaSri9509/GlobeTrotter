import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Calendar() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'
  const [expandedDays, setExpandedDays] = useState(new Set());

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

  function toggleDay(dayKey) {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayKey)) {
      newExpanded.delete(dayKey);
    } else {
      newExpanded.add(dayKey);
    }
    setExpandedDays(newExpanded);
  }

  function getDaysBetween(startDate, endDate) {
    const days = [];
    if (!startDate || !endDate) return days;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);
    
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }

  function getActivitiesForDate(date, stops) {
    const dateStr = date.toISOString().split('T')[0];
    const activities = [];
    
    stops.forEach(stop => {
      const stopStart = stop.start_date ? new Date(stop.start_date).toISOString().split('T')[0] : null;
      const stopEnd = stop.end_date ? new Date(stop.end_date).toISOString().split('T')[0] : null;
      
      if (stopStart && stopEnd && dateStr >= stopStart && dateStr <= stopEnd) {
        (stop.activities || []).forEach(act => {
          activities.push({
            ...act,
            city: stop.city,
            country: stop.country,
            stop: stop
          });
        });
      }
    });
    
    return activities;
  }

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (!trip) {
    return <div className="error-message">Trip not found</div>;
  }

  const days = getDaysBetween(trip.start_date, trip.end_date);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{trip.name} - Calendar View</h1>
          <p style={{ color: '#6b7280' }}>Day-by-day timeline of your trip</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button
            className={viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </button>
          <Link to={`/trips/${id}`} className="btn-secondary">Back to Itinerary</Link>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div>
          {days.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3 className="empty-state-title">No dates set</h3>
              <p className="empty-state-text">Add start and end dates to your trip to see the timeline</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {days.map((day, index) => {
                const dayKey = day.toISOString().split('T')[0];
                const isExpanded = expandedDays.has(dayKey);
                const activities = getActivitiesForDate(day, trip.stops || []);
                const currentStop = (trip.stops || []).find(s => {
                  const start = s.start_date ? new Date(s.start_date).toISOString().split('T')[0] : null;
                  const end = s.end_date ? new Date(s.end_date).toISOString().split('T')[0] : null;
                  return start && end && dayKey >= start && dayKey <= end;
                });

                return (
                  <div key={dayKey} style={{ marginBottom: '16px' }}>
                    <div
                      className="card"
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => toggleDay(dayKey)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: '#2563eb',
                              color: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}>
                              {index + 1}
                            </div>
                            <div>
                              <h3 style={{ margin: 0 }}>
                                Day {index + 1} - {day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                              </h3>
                              {currentStop && (
                                <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                                  📍 {currentStop.city}{currentStop.country ? `, ${currentStop.country}` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280', marginRight: '12px' }}>
                            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                          </span>
                          <span style={{ fontSize: '1.5rem' }}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                          {activities.length === 0 ? (
                            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No activities scheduled for this day</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {activities.map((act, actIndex) => (
                                <div key={actIndex} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                      <strong>{act.activity_name || act.name}</strong>
                                      {act.activity_description && (
                                        <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                          {act.activity_description}
                                        </p>
                                      )}
                                      {act.activity_category && (
                                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                                          {act.activity_category}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#6b7280' }}>
                                      {act.activity_duration && (
                                        <div>⏱ {Math.floor(act.activity_duration / 60)}h {act.activity_duration % 60}m</div>
                                      )}
                                      <div style={{ fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>
                                        ${(act.cost || act.activity_cost || 0).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <p style={{ color: '#6b7280' }}>Calendar grid view coming soon. Use timeline view for now.</p>
        </div>
      )}
    </div>
  );
}

