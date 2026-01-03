const express = require('express');
const db = require('../db');
const router = express.Router();

// Search cities (public endpoint)
router.get('/search', (req, res) => {
  const { q, country } = req.query;
  let sql = `SELECT * FROM cities WHERE 1=1`;
  const params = [];
  
  if (q) {
    sql += ` AND (name LIKE ? OR country LIKE ?)`;
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm);
  }
  
  if (country) {
    sql += ` AND country = ?`;
    params.push(country);
  }
  
  sql += ` ORDER BY popularity DESC, name ASC`;
  
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Get all cities (public)
router.get('/', (req, res) => {
  db.all(`SELECT * FROM cities ORDER BY popularity DESC, name ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// Get unique countries (for filters)
router.get('/countries', (req, res) => {
  db.all(`SELECT DISTINCT country FROM cities ORDER BY country ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.country));
  });
});

module.exports = router;

