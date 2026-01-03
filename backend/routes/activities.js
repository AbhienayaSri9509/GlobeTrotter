const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// public list of activities (no auth required)
router.get('/', (req, res) => {
  db.all(`SELECT * FROM activities ORDER BY city, name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// create activity (admin/dev)
router.post('/', authenticate, (req, res) => {
  const { name, description, city, category, cost, duration_minutes } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.run(
    `INSERT INTO activities (name, description, city, category, cost, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, city, category, cost || 0, duration_minutes || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM activities WHERE id = ?`, [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

module.exports = router;
