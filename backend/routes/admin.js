const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Check if user is admin
function requireAdmin(req, res, next) {
  const userId = req.userId;
  db.get(`SELECT is_admin FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !user.is_admin) return res.status(403).json({ error: 'admin access required' });
    next();
  });
}

router.use(authenticate);
router.use(requireAdmin);

// Get analytics overview
router.get('/analytics', (req, res) => {
  const analytics = {};

  // Total users
  db.get(`SELECT COUNT(*) as count FROM users`, [], (err, userCount) => {
    if (err) return res.status(500).json({ error: err.message });
    analytics.total_users = userCount.count;

    // Total trips
    db.get(`SELECT COUNT(*) as count FROM trips`, [], (err2, tripCount) => {
      if (err2) return res.status(500).json({ error: err2.message });
      analytics.total_trips = tripCount.count;

      // Total public trips
      db.get(`SELECT COUNT(*) as count FROM trips WHERE is_public = 1`, [], (err3, publicCount) => {
        if (err3) return res.status(500).json({ error: err3.message });
        analytics.public_trips = publicCount.count;

        // Top cities (most popular in stops)
        db.all(
          `SELECT city, country, COUNT(*) as usage_count 
           FROM stops 
           GROUP BY city, country 
           ORDER BY usage_count DESC 
           LIMIT 10`,
          [],
          (err4, topCities) => {
            if (err4) return res.status(500).json({ error: err4.message });
            analytics.top_cities = topCities;

            // Top activities
            db.all(
              `SELECT a.name, a.city, COUNT(*) as usage_count 
               FROM trip_activities ta 
               JOIN activities a ON ta.activity_id = a.id 
               GROUP BY ta.activity_id 
               ORDER BY usage_count DESC 
               LIMIT 10`,
              [],
              (err5, topActivities) => {
                if (err5) return res.status(500).json({ error: err5.message });
                analytics.top_activities = topActivities;

                // User engagement (trips per user)
                db.all(
                  `SELECT u.id, u.name, u.email, COUNT(t.id) as trip_count 
                   FROM users u 
                   LEFT JOIN trips t ON u.id = t.user_id 
                   GROUP BY u.id 
                   ORDER BY trip_count DESC 
                   LIMIT 10`,
                  [],
                  (err6, userEngagement) => {
                    if (err6) return res.status(500).json({ error: err6.message });
                    analytics.user_engagement = userEngagement;

                    // Recent trips (last 10)
                    db.all(
                      `SELECT t.*, u.name as user_name, u.email as user_email 
                       FROM trips t 
                       JOIN users u ON t.user_id = u.id 
                       ORDER BY t.created_at DESC 
                       LIMIT 10`,
                      [],
                      (err7, recentTrips) => {
                        if (err7) return res.status(500).json({ error: err7.message });
                        analytics.recent_trips = recentTrips;

                        res.json(analytics);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});

// Get all users (for management)
router.get('/users', (req, res) => {
  db.all(`SELECT id, name, email, created_at, is_admin FROM users ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

