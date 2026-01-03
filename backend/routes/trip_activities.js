const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// add activity to a stop
router.post('/', authenticate, (req, res) => {
  const { stop_id, activity_id, scheduled_at, cost } = req.body;
  if (!stop_id || !activity_id) return res.status(400).json({ error: 'stop_id and activity_id required' });
  db.run(
    `INSERT INTO trip_activities (stop_id, activity_id, scheduled_at, cost) VALUES (?, ?, ?, ?)`,
    [stop_id, activity_id, scheduled_at || null, cost || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT ta.*, a.name as activity_name, a.city as activity_city, a.category as activity_category FROM trip_activities ta JOIN activities a ON ta.activity_id = a.id WHERE ta.id = ?`, [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

// list activities for a stop
router.get('/by-stop/:stopId', (req, res) => {
  const stopId = req.params.stopId;
  db.all(`SELECT ta.*, a.name as activity_name, a.description as activity_description, a.city as activity_city, a.category as activity_category, a.cost as activity_cost, a.duration_minutes as activity_duration FROM trip_activities ta JOIN activities a ON ta.activity_id = a.id WHERE ta.stop_id = ? ORDER BY ta.id`, [stopId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
