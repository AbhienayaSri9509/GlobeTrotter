import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles.css';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.error || 'Failed to load analytics. Admin access required.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!analytics) {
    return <div className="error-message">No analytics data available</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Platform analytics and insights</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p className="stat-value">{analytics.total_users || 0}</p>
          <p className="stat-label">Total Users</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{analytics.total_trips || 0}</p>
          <p className="stat-label">Total Trips</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{analytics.public_trips || 0}</p>
          <p className="stat-label">Public Trips</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {/* Top Cities */}
        <div className="card">
          <h2 className="card-title">Top Cities</h2>
          {analytics.top_cities && analytics.top_cities.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {analytics.top_cities.map((city, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '8px', marginBottom: '8px' }}>
                  <div>
                    <strong>{city.city}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{city.country}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{city.usage_count} trips</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', marginTop: '16px' }}>No city data available</p>
          )}
        </div>

        {/* Top Activities */}
        <div className="card">
          <h2 className="card-title">Top Activities</h2>
          {analytics.top_activities && analytics.top_activities.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {analytics.top_activities.map((activity, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '8px', marginBottom: '8px' }}>
                  <div>
                    <strong>{activity.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{activity.city}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{activity.usage_count} uses</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', marginTop: '16px' }}>No activity data available</p>
          )}
        </div>

        {/* User Engagement */}
        <div className="card">
          <h2 className="card-title">Top Users by Trips</h2>
          {analytics.user_engagement && analytics.user_engagement.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {analytics.user_engagement.map((user, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: index % 2 === 0 ? '#f9fafb' : 'white', borderRadius: '8px', marginBottom: '8px' }}>
                  <div>
                    <strong>{user.name || user.email}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{user.trip_count} trips</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', marginTop: '16px' }}>No user data available</p>
          )}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2 className="card-title">Recent Trips</h2>
        {analytics.recent_trips && analytics.recent_trips.length > 0 ? (
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Trip Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Dates</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent_trips.map((trip, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{trip.name}</td>
                    <td style={{ padding: '12px' }}>{trip.user_name || trip.user_email}</td>
                    <td style={{ padding: '12px' }}>
                      {trip.start_date && trip.end_date ? (
                        `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                      ) : (
                        'TBD'
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.is_public ? (
                        <span className="badge badge-primary">Public</span>
                      ) : (
                        <span className="badge badge-warning">Private</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(trip.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#6b7280', marginTop: '16px' }}>No recent trips</p>
        )}
      </div>
    </div>
  );
}

