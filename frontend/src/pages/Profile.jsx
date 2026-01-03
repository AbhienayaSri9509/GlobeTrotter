import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setName(data.name || '');
      setEmail(data.email || '');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const updates = { name, email };
      if (password) {
        updates.password = password;
      }
      await api.updateProfile(updates);
      setSuccess('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      setEditing(false);
      await loadProfile();
      
      // Update localStorage user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = name;
        user.email = email;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      setError(err.error || 'Failed to update profile');
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your trips and data. Are you absolutely sure?')) {
      return;
    }

    try {
      await api.deleteAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError(err.error || 'Failed to delete account');
    }
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error-message">Profile not found</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Profile Settings</h1>
          <button
            className={editing ? 'btn-secondary' : 'btn-primary'}
            onClick={() => {
              setEditing(!editing);
              setError(null);
              setSuccess(null);
              setPassword('');
              setConfirmPassword('');
            }}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {success && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          {success}
        </div>}

        {error && <div className="error-message">{error}</div>}

        {!editing ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name</label>
              <p style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', margin: 0 }}>
                {profile.name || 'Not set'}
              </p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
              <p style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', margin: 0 }}>
                {profile.email}
              </p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Member Since</label>
              <p style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', margin: 0 }}>
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
            {password && (
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            )}
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px', border: '2px solid #fee2e2', background: '#fef2f2' }}>
        <h2 style={{ color: '#991b1b', marginTop: 0 }}>Danger Zone</h2>
        <p style={{ color: '#991b1b', marginBottom: '16px' }}>
          Deleting your account will permanently remove all your trips and data. This action cannot be undone.
        </p>
        <button
          className="btn-danger"
          onClick={handleDeleteAccount}
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
