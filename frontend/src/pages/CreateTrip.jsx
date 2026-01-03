import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function CreateTrip() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!name.trim()) {
      setError('Trip name is required');
      setLoading(false);
      return;
    }

    try {
      const payload = { name: name.trim(), start_date: startDate || null, end_date: endDate || null, description: description.trim() || null };
      const res = await api.createTrip(payload);
      if (res && res.id) {
        navigate(`/trips/${res.id}`);
      } else {
        setError(res.error || 'Could not create trip');
      }
    } catch (err) {
      setError(err.error || err.message || 'Could not create trip');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1>Create New Trip</h1>
        <p style={{ color: '#6b7280' }}>Start planning your next adventure</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Trip Name *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g., European Adventure, Japan 2024"
              required 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell us about your trip..."
              rows={4}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Trip'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/trips')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ maxWidth: '600px', marginTop: '24px', background: '#eff6ff' }}>
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>💡 Tips</h3>
        <ul style={{ color: '#1e40af', margin: '16px 0', paddingLeft: '20px' }}>
          <li>You can add dates later if you're still planning</li>
          <li>Add cities and activities after creating the trip</li>
          <li>Share your trip publicly to inspire others</li>
        </ul>
      </div>
    </div>
  );
}
