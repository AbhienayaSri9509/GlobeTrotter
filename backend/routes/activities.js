const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// public list of activities (no auth required)
router.get('/', (req, res) => {
  const { q, city, category, max_cost } = req.query;
  let sql = `SELECT * FROM activities WHERE 1=1`;
  const params = [];
  
  if (q) {
    sql += ` AND (name LIKE ? OR description LIKE ?)`;
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm);
  }
  
  if (city) {
    sql += ` AND city = ?`;
    params.push(city);
  }
  
  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }
  
  if (max_cost) {
    sql += ` AND cost <= ?`;
    params.push(parseFloat(max_cost));
  }
  
  sql += ` ORDER BY city, name`;
  
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Search endpoint (alias for GET / with query params)
router.get('/search', (req, res) => {
  // Redirect to main GET endpoint
  req.url = '/?' + new URLSearchParams(req.query).toString();
  router.handle(req, res);
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
