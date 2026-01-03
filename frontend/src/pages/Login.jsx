import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../styles.css';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignup) {
      if (!name || !email || !password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      try {
        const res = await api.signup(name, email, password);
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          navigate('/');
        } else {
          setError(res.error || 'Signup failed');
        }
      } catch (err) {
        setError(err.message || 'Signup failed');
      }
    } else {
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
      try {
        const res = await api.login(email, password);
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          navigate('/');
        } else {
          setError(res.error || 'Login failed');
        }
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">🌍 GlobeTrotter</h1>
        <h2 className="auth-subtitle">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder={isSignup ? "At least 6 characters" : "Your password"}
              required
            />
          </div>
          
          {isSignup && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
        
        <div className="auth-footer">
          <button 
            type="button"
            className="link-button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setPassword('');
              setConfirmPassword('');
            }}
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
          {!isSignup && (
            <Link to="#" className="link-button" style={{marginTop: '8px'}}>
              Forgot Password?
            </Link>
          )}
        </div>
        
        {!isSignup && (
          <div className="demo-info">
            <p><strong>Demo Account:</strong></p>
            <p>Email: demo@local | Password: password</p>
          </div>
        )}
      </div>
    </div>
  );
}
