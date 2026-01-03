const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.use(authenticate);

// Get current user's profile
router.get('/me', (req, res) => {
  const userId = req.userId;
  db.get(`SELECT id, name, email, created_at FROM users WHERE id = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'user not found' });
    res.json(row);
  });
});

// Update profile (name, email, password)
router.patch('/me', async (req, res) => {
  const userId = req.userId;
  const { name, email, password } = req.body;
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'user not found' });
    const fields = [];
    const values = [];
    if (typeof name !== 'undefined') { fields.push('name = ?'); values.push(name); }
    if (typeof email !== 'undefined') { fields.push('email = ?'); values.push(email); }
    if (typeof password !== 'undefined') { const hash = await bcrypt.hash(password, 10); fields.push('password_hash = ?'); values.push(hash); }
    if (fields.length === 0) return res.status(400).json({ error: 'no updatable fields' });
    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    db.run(sql, values, function(updateErr){
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      db.get(`SELECT id, name, email, created_at FROM users WHERE id = ?`, [userId], (e, updated) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(updated);
      });
    });
  });
});

// Delete account
router.delete('/me', (req, res) => {
  const userId = req.userId;
  db.run(`DELETE FROM users WHERE id = ?`, [userId], function(deleteErr) {
    if (deleteErr) return res.status(500).json({ error: deleteErr.message });
    res.json({ success: true });
  });
});

module.exports = router;
