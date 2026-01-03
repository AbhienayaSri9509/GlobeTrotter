const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const password = await bcrypt.hash('password', 10);
  db.serialize(() => {
    db.run(`INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES (1, 'Demo User', 'demo@local', ?);`, [password]);
    const activities = [
      ['Eiffel Tower Visit', 'Visit the iconic tower with skip-the-line option', 'Paris', 'sightseeing', 25.0, 90],
      ['Louvre Museum', 'Explore the Louvre highlights', 'Paris', 'museum', 17.0, 120],
      ['Food Tour', 'Local gastronomy walking tour', 'Rome', 'food', 45.0, 180],
      ['Great Wall Hike', 'Day trip to the Great Wall', 'Beijing', 'adventure', 60.0, 360]
    ];
    const stmt = db.prepare(`INSERT OR IGNORE INTO activities (name, description, city, category, cost, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)`);
    activities.forEach(a => stmt.run(a));
    stmt.finalize(() => {
      console.log('seeded demo user id=1 (password: password) and sample activities');
      process.exit(0);
    });
  });
}

seed();
