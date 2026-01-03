const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
      [name || null, email, hash],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
          }
          return res.status(400).json({ error: err.message });
        }
        const user = { id: this.lastID, name: name || email, email, is_admin: 0 };
        const token = jwt.sign(user, JWT_SECRET);
        res.json({ user, token });
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Find user
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ error: 'Server error during login' });
    }
    
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Compare password
    try {
      const match = await bcrypt.compare(password, row.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Generate token
      const user = { 
        id: row.id, 
        name: row.name || row.email, 
        email: row.email, 
        is_admin: row.is_admin || 0 
      };
      const token = jwt.sign(user, JWT_SECRET);
      
      res.json({ user, token });
    } catch (compareErr) {
      console.error('Password compare error:', compareErr);
      return res.status(500).json({ error: 'Server error during login' });
    }
  });
});

module.exports = router;
