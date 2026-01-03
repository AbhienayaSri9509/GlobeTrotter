const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.use(authenticate);

router.post('/', (req, res) => {
  const userId = req.userId;
  const { name, start_date, end_date, description, cover_photo } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  db.run(
    `INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, name, start_date, end_date, description, cover_photo],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM trips WHERE id = ?`, [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

router.get('/', (req, res) => {
  const userId = req.userId;
  db.all(`SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM trips WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'trip not found' });
    // include stops for itinerary
    db.all(`SELECT * FROM stops WHERE trip_id = ? ORDER BY position`, [id], (se, stops) => {
      if (se) return res.status(500).json({ error: se.message });
      row.stops = stops || [];
      res.json(row);
    });
  });
});

// update trip (partial) - allow toggling is_public and basic fields
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  db.get(`SELECT * FROM trips WHERE id = ?`, [id], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'trip not found' });
    if (trip.user_id !== userId) return res.status(403).json({ error: 'forbidden' });
    const fields = [];
    const values = [];
    if (typeof req.body.is_public !== 'undefined') { fields.push('is_public = ?'); values.push(req.body.is_public ? 1 : 0); }
    if (typeof req.body.name !== 'undefined') { fields.push('name = ?'); values.push(req.body.name); }
    if (typeof req.body.start_date !== 'undefined') { fields.push('start_date = ?'); values.push(req.body.start_date); }
    if (typeof req.body.end_date !== 'undefined') { fields.push('end_date = ?'); values.push(req.body.end_date); }
    if (typeof req.body.description !== 'undefined') { fields.push('description = ?'); values.push(req.body.description); }
    if (fields.length === 0) return res.status(400).json({ error: 'no updatable fields provided' });
    values.push(id);
    const sql = `UPDATE trips SET ${fields.join(', ')} WHERE id = ?`;
    db.run(sql, values, function(updateErr){
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      db.get(`SELECT * FROM trips WHERE id = ?`, [id], (e, updated) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(updated);
      });
    });
  });
});

module.exports = router;
