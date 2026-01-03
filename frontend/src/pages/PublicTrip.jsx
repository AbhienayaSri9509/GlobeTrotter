import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function PublicTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function loadTrip() {
    try {
      const data = await api.getPublicTrip(id);
      setTrip(data);
    } catch (err) {
      console.error('Error loading public trip:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleSocialShare(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this trip: ${trip?.name || ''}`);
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }

  if (loading) {
    return <div className="loading">Loading public trip...</div>;
  }

  if (!trip) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Trip Not Found</h3>
        <p className="empty-state-text">This trip is not public or does not exist.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block', marginTop: '16px' }}>
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 style={{ margin: 0, color: 'white' }}>{trip.name}</h1>
            {trip.description && (
              <p style={{ margin: '16px 0 0 0', opacity: 0.9 }}>{trip.description}</p>
            )}
            {trip.start_date && trip.end_date && (
              <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">Share This Trip</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <button onClick={handleShare} className="btn-primary">
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
          <button onClick={() => handleSocialShare('twitter')} className="btn-secondary">
            🐦 Twitter
          </button>
          <button onClick={() => handleSocialShare('facebook')} className="btn-secondary">
            📘 Facebook
          </button>
          <button onClick={() => handleSocialShare('linkedin')} className="btn-secondary">
            💼 LinkedIn
          </button>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>Share URL:</strong> {window.location.href}
          </p>
        </div>
      </div>

      <div>
        {(!trip.stops || trip.stops.length === 0) ? (
          <div className="empty-state">
            <div className="empty-state-icon">📍</div>
            <h3 className="empty-state-title">No stops yet</h3>
            <p className="empty-state-text">This trip doesn't have any stops configured yet.</p>
          </div>
        ) : (
          trip.stops.map((stop, index) => (
            <div key={stop.id} className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
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
                  <h2 style={{ margin: 0 }}>
                    {stop.city}{stop.country ? `, ${stop.country}` : ''}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
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
                              <strong style={{ fontSize: '1.125rem' }}>{act.activity_name}</strong>
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

      <div className="card" style={{ marginTop: '32px', textAlign: 'center', background: '#eff6ff' }}>
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>Inspired by this trip?</h3>
        <p style={{ color: '#1e40af', marginBottom: '16px' }}>
          Sign up for GlobeTrotter to create your own personalized travel plans!
        </p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', width: 'auto', display: 'inline-block' }}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
