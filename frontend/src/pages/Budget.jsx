import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Budget() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [budgetData, tripData] = await Promise.all([
        api.getBudget(id),
        api.getTrip(id)
      ]);
      setBudget(budgetData);
      setTrip(tripData);
    } catch (err) {
      console.error('Error loading budget:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading budget...</div>;
  }

  if (!budget || !trip) {
    return <div className="error-message">Budget data not found</div>;
  }

  const categories = [
    { name: 'Transport', value: budget.transport, color: '#3b82f6' },
    { name: 'Accommodation', value: budget.accommodation, color: '#10b981' },
    { name: 'Activities', value: budget.activities, color: '#f59e0b' },
    { name: 'Meals', value: budget.meals, color: '#ef4444' }
  ];

  const total = budget.total || 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{trip.name} - Budget Breakdown</h1>
          <p style={{ color: '#6b7280' }}>Financial overview of your trip</p>
        </div>
        <Link to={`/trips/${id}`} className="btn-secondary">Back to Itinerary</Link>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '24px' }}>Total Budget</h2>
        <div style={{ textAlign: 'center', padding: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>
            ${total.toFixed(2)}
          </div>
          <div style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            Average per day: ${(budget.average_per_day || 0).toFixed(2)} ({budget.total_days || 1} days)
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Cost Breakdown by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
          {categories.map(cat => {
            const percentage = total > 0 ? (cat.value / total * 100).toFixed(1) : 0;
            return (
              <div key={cat.name} style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', background: cat.color, borderRadius: '4px', marginRight: '12px' }}></div>
                  <strong>{cat.name}</strong>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: cat.color, marginBottom: '4px' }}>
                  ${cat.value.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {percentage}% of total
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple bar chart representation */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Visual Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(cat => {
              const percentage = total > 0 ? (cat.value / total * 100) : 0;
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{cat.name}</span>
                    <span><strong>${cat.value.toFixed(2)}</strong></span>
                  </div>
                  <div style={{ width: '100%', height: '24px', background: '#e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: cat.color,
                        transition: 'width 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '8px',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {budget.by_stop && budget.by_stop.length > 0 && (
        <div className="card">
          <h2 className="card-title">Breakdown by Stop</h2>
          <div style={{ marginTop: '24px' }}>
            {budget.by_stop.map((stop, index) => (
              <div key={index} style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>{stop.city}{stop.country ? `, ${stop.country}` : ''}</h3>
                  <strong style={{ fontSize: '1.25rem', color: '#2563eb' }}>${stop.total.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '0.875rem' }}>
                  <div>Transport: <strong>${stop.transport.toFixed(2)}</strong></div>
                  <div>Accommodation: <strong>${stop.accommodation.toFixed(2)}</strong> ({stop.nights} nights)</div>
                  <div>Activities: <strong>${stop.activities.toFixed(2)}</strong></div>
                  <div>Meals: <strong>${stop.meals.toFixed(2)}</strong> ({stop.days} days)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ background: '#eff6ff', border: '2px solid #3b82f6' }}>
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>💡 Budget Tips</h3>
        <ul style={{ color: '#1e40af', margin: '16px 0', paddingLeft: '20px' }}>
          <li>Consider booking accommodations in advance for better rates</li>
          <li>Look for free activities and attractions in each city</li>
          <li>Budget extra for unexpected expenses (10-15% buffer)</li>
          <li>Compare transportation options (flights vs. trains vs. buses)</li>
        </ul>
      </div>
    </div>
  );
}

