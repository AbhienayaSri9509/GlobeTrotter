const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.use(authenticate);

// Calculate budget breakdown for a trip
router.get('/trip/:tripId', (req, res) => {
  const tripId = req.params.tripId;
  const userId = req.userId;

  // Verify trip belongs to user
  db.get(`SELECT * FROM trips WHERE id = ? AND user_id = ?`, [tripId, userId], (err, trip) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!trip) return res.status(404).json({ error: 'trip not found' });

    // Get all stops for this trip
    db.all(`SELECT * FROM stops WHERE trip_id = ? ORDER BY position`, [tripId], (err2, stops) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const budgetBreakdown = {
        total: 0,
        transport: 0,
        accommodation: 0,
        activities: 0,
        meals: 0,
        by_day: [],
        by_stop: []
      };

      if (!stops || stops.length === 0) {
        return res.json(budgetBreakdown);
      }

      // Process each stop
      let promises = stops.map((stop, index) => {
        return new Promise((resolve, reject) => {
          // Get activities for this stop
          db.all(
            `SELECT ta.cost, COALESCE(ta.cost, a.cost, 0) as activity_cost 
             FROM trip_activities ta 
             JOIN activities a ON ta.activity_id = a.id 
             WHERE ta.stop_id = ?`,
            [stop.id],
            (err3, activities) => {
              if (err3) return reject(err3);

              // Get stop costs (transport, accommodation, meals)
              db.get(`SELECT * FROM stop_costs WHERE stop_id = ?`, [stop.id], (err4, stopCost) => {
                if (err4) return reject(err4);

                const activitiesCost = (activities || []).reduce((sum, a) => sum + (parseFloat(a.activity_cost) || 0), 0);
                const transportCost = parseFloat(stopCost?.transport_cost || 0);
                
                // Calculate days for accommodation and meals
                const startDate = stop.start_date ? new Date(stop.start_date) : null;
                const endDate = stop.end_date ? new Date(stop.end_date) : null;
                let nights = 1;
                if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                  const diffTime = Math.abs(endDate - startDate);
                  nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (nights === 0) nights = 1;
                }
                const days = nights;

                const accommodationCostPerNight = parseFloat(stopCost?.accommodation_cost_per_night || 50); // default $50/night
                const mealCostPerDay = parseFloat(stopCost?.meal_cost_per_day || 40); // default $40/day
                const accommodationTotal = accommodationCostPerNight * nights;
                const mealsTotal = mealCostPerDay * days;

                const stopTotal = transportCost + accommodationTotal + activitiesCost + mealsTotal;

                budgetBreakdown.transport += transportCost;
                budgetBreakdown.accommodation += accommodationTotal;
                budgetBreakdown.activities += activitiesCost;
                budgetBreakdown.meals += mealsTotal;
                budgetBreakdown.total += stopTotal;

                budgetBreakdown.by_stop.push({
                  stop_id: stop.id,
                  city: stop.city,
                  country: stop.country,
                  transport: transportCost,
                  accommodation: accommodationTotal,
                  activities: activitiesCost,
                  meals: mealsTotal,
                  total: stopTotal,
                  nights: nights,
                  days: days
                });

                resolve();
              });
            }
          );
        });
      });

      Promise.all(promises)
        .then(() => {
          // Calculate average cost per day
          const tripStartDate = trip.start_date ? new Date(trip.start_date) : null;
          const tripEndDate = trip.end_date ? new Date(trip.end_date) : null;
          let totalDays = 1;
          if (tripStartDate && tripEndDate && !isNaN(tripStartDate.getTime()) && !isNaN(tripEndDate.getTime())) {
            const diffTime = Math.abs(tripEndDate - tripStartDate);
            totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (totalDays === 0) totalDays = 1;
          }

          budgetBreakdown.average_per_day = budgetBreakdown.total / totalDays;
          budgetBreakdown.total_days = totalDays;

          res.json(budgetBreakdown);
        })
        .catch(e => res.status(500).json({ error: e.message }));
    });
  });
});

// Update stop costs
router.post('/stop/:stopId', (req, res) => {
  const stopId = req.params.stopId;
  const { transport_cost, accommodation_cost_per_night, meal_cost_per_day } = req.body;

  // Verify stop belongs to user's trip
  db.get(`SELECT t.user_id FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?`, [stopId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || row.user_id !== req.userId) return res.status(403).json({ error: 'forbidden' });

    // Check if stop_costs entry exists
    db.get(`SELECT * FROM stop_costs WHERE stop_id = ?`, [stopId], (err2, existing) => {
      if (err2) return res.status(500).json({ error: err2.message });

      if (existing) {
        // Update
        const updates = [];
        const values = [];
        if (typeof transport_cost !== 'undefined') { updates.push('transport_cost = ?'); values.push(transport_cost); }
        if (typeof accommodation_cost_per_night !== 'undefined') { updates.push('accommodation_cost_per_night = ?'); values.push(accommodation_cost_per_night); }
        if (typeof meal_cost_per_day !== 'undefined') { updates.push('meal_cost_per_day = ?'); values.push(meal_cost_per_day); }
        if (updates.length === 0) return res.status(400).json({ error: 'no fields to update' });
        values.push(stopId);
        db.run(`UPDATE stop_costs SET ${updates.join(', ')} WHERE stop_id = ?`, values, function(err3) {
          if (err3) return res.status(500).json({ error: err3.message });
          db.get(`SELECT * FROM stop_costs WHERE stop_id = ?`, [stopId], (e, updated) => {
            if (e) return res.status(500).json({ error: e.message });
            res.json(updated);
          });
        });
      } else {
        // Insert
        db.run(
          `INSERT INTO stop_costs (stop_id, transport_cost, accommodation_cost_per_night, meal_cost_per_day) 
           VALUES (?, ?, ?, ?)`,
          [stopId, transport_cost || 0, accommodation_cost_per_night || 0, meal_cost_per_day || 0],
          function(err3) {
            if (err3) return res.status(500).json({ error: err3.message });
            db.get(`SELECT * FROM stop_costs WHERE stop_id = ?`, [stopId], (e, inserted) => {
              if (e) return res.status(500).json({ error: e.message });
              res.json(inserted);
            });
          }
        );
      }
    });
  });
});

module.exports = router;

