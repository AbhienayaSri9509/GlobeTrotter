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

module.exports = router;
