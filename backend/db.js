const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(DB_PATH);

// Initialize relational schema
db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON;`);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      description TEXT,
      cover_photo TEXT,
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      city TEXT NOT NULL,
      country TEXT,
      start_date TEXT,
      end_date TEXT,
      position INTEGER,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      city TEXT,
      category TEXT,
      cost REAL DEFAULT 0,
      duration_minutes INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trip_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stop_id INTEGER NOT NULL,
      activity_id INTEGER NOT NULL,
      scheduled_at TEXT,
      cost REAL DEFAULT 0,
      FOREIGN KEY(stop_id) REFERENCES stops(id) ON DELETE CASCADE,
      FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE
    )
  `);

  // Cities table for search functionality with cost indices and popularity
  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      cost_index REAL DEFAULT 50,
      popularity INTEGER DEFAULT 0,
      description TEXT
    )
  `);

  // Add transport, accommodation, and meal cost estimates per stop
  db.run(`
    CREATE TABLE IF NOT EXISTS stop_costs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stop_id INTEGER NOT NULL,
      transport_cost REAL DEFAULT 0,
      accommodation_cost_per_night REAL DEFAULT 0,
      meal_cost_per_day REAL DEFAULT 0,
      FOREIGN KEY(stop_id) REFERENCES stops(id) ON DELETE CASCADE
    )
  `);

  // Add admin flag to users table (migration-safe - ignore error if column exists)
  db.run(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding is_admin column:', err.message);
    }
  });
});

module.exports = db;

module.exports = db;
