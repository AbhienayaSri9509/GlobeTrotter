const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.use(authenticate);

router.post('/', (req, res) => {
  const { trip_id, city, country, start_date, end_date, position } = req.body;
  if (!trip_id || !city) return res.status(400).json({ error: 'trip_id and city required' });
  db.run(
    `INSERT INTO stops (trip_id, city, country, start_date, end_date, position) VALUES (?, ?, ?, ?, ?, ?)`,
    [trip_id, city, country, start_date, end_date, position || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM stops WHERE id = ?`, [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

router.get('/by-trip/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  db.all(`SELECT * FROM stops WHERE trip_id = ? ORDER BY position`, [tripId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.patch('/:id', (req, res) => {
  const stopId = req.params.id;
  const { city, country, start_date, end_date, position } = req.body;
  
  // Verify stop belongs to user's trip
  db.get(`SELECT t.user_id FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?`, [stopId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || row.user_id !== req.userId) return res.status(403).json({ error: 'forbidden' });
    
    const fields = [];
    const values = [];
    if (typeof city !== 'undefined') { fields.push('city = ?'); values.push(city); }
    if (typeof country !== 'undefined') { fields.push('country = ?'); values.push(country); }
    if (typeof start_date !== 'undefined') { fields.push('start_date = ?'); values.push(start_date); }
    if (typeof end_date !== 'undefined') { fields.push('end_date = ?'); values.push(end_date); }
    if (typeof position !== 'undefined') { fields.push('position = ?'); values.push(position); }
    if (fields.length === 0) return res.status(400).json({ error: 'no updatable fields' });
    values.push(stopId);
    
    db.run(`UPDATE stops SET ${fields.join(', ')} WHERE id = ?`, values, function(updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      db.get(`SELECT * FROM stops WHERE id = ?`, [stopId], (e, updated) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(updated);
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  const stopId = req.params.id;
  
  // Verify stop belongs to user's trip
  db.get(`SELECT t.user_id FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?`, [stopId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || row.user_id !== req.userId) return res.status(403).json({ error: 'forbidden' });
    
    db.run(`DELETE FROM stops WHERE id = ?`, [stopId], function(deleteErr) {
      if (deleteErr) return res.status(500).json({ error: deleteErr.message });
      res.json({ success: true });
    });
  });
});

module.exports = router;
