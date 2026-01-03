const express = require('express');
const db = require('../db');
const router = express.Router();

// public trip view: only returns if trip.is_public = 1
router.get('/trips/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM trips WHERE id = ? AND is_public = 1`, [id], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'public trip not found' });
    db.all(`SELECT * FROM stops WHERE trip_id = ? ORDER BY position`, [id], (se, stops) => {
      if (se) return res.status(500).json({ error: se.message });
      // for each stop, fetch activities
      const fetchActivitiesForStop = (stop) => new Promise((resolve, reject) => {
        db.all(`SELECT ta.*, a.name as activity_name, a.description as activity_description FROM trip_activities ta JOIN activities a ON ta.activity_id = a.id WHERE ta.stop_id = ?`, [stop.id], (err2, rows) => {
          if (err2) return reject(err2);
          stop.activities = rows || [];
          resolve();
        });
      });
      Promise.all((stops || []).map(s => fetchActivitiesForStop(s))).then(() => {
        trip.stops = stops;
        res.json(trip);
      }).catch(e => res.status(500).json({ error: e.message }));
    });
  });
});

module.exports = router;
