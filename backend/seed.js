const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const password = await bcrypt.hash('password', 10);
  const adminPassword = await bcrypt.hash('admin', 10);
  db.serialize(() => {
    // Demo user and admin user
    db.run(`INSERT OR IGNORE INTO users (id, name, email, password_hash, is_admin) VALUES (1, 'Demo User', 'demo@local', ?, 0);`, [password]);
    db.run(`INSERT OR IGNORE INTO users (id, name, email, password_hash, is_admin) VALUES (2, 'Admin User', 'admin@local', ?, 1);`, [adminPassword]);
    
    // Cities data
    const cities = [
      ['Paris', 'France', 75, 100, 'The City of Light, known for art, fashion, and culture'],
      ['Rome', 'Italy', 65, 95, 'Eternal city with ancient history and incredible cuisine'],
      ['Tokyo', 'Japan', 85, 90, 'Modern metropolis blending tradition with innovation'],
      ['New York', 'USA', 80, 100, 'The city that never sleeps'],
      ['London', 'UK', 70, 95, 'Historic capital with royal heritage'],
      ['Barcelona', 'Spain', 60, 85, 'Vibrant city with unique architecture'],
      ['Bali', 'Indonesia', 45, 88, 'Tropical paradise with beautiful beaches'],
      ['Sydney', 'Australia', 70, 82, 'Harbor city with stunning Opera House'],
      ['Dubai', 'UAE', 75, 78, 'Luxury destination in the desert'],
      ['Amsterdam', 'Netherlands', 68, 80, 'Canal city with rich history'],
      ['Bangkok', 'Thailand', 40, 85, 'Bustling city with amazing street food'],
      ['Berlin', 'Germany', 65, 75, 'Cultural hub with vibrant nightlife'],
      ['Beijing', 'China', 55, 80, 'Ancient capital with modern skyline'],
      ['Mumbai', 'India', 35, 83, 'Bollywood capital and financial center'],
      ['Cairo', 'Egypt', 40, 75, 'Gateway to ancient pyramids']
    ];
    const cityStmt = db.prepare(`INSERT OR IGNORE INTO cities (name, country, cost_index, popularity, description) VALUES (?, ?, ?, ?, ?)`);
    cities.forEach(c => cityStmt.run(c));
    cityStmt.finalize();

    // Activities data
    const activities = [
      ['Eiffel Tower Visit', 'Visit the iconic tower with skip-the-line option', 'Paris', 'sightseeing', 25.0, 90],
      ['Louvre Museum', 'Explore the Louvre highlights', 'Paris', 'museum', 17.0, 120],
      ['Seine River Cruise', 'Scenic boat tour along the Seine', 'Paris', 'sightseeing', 15.0, 60],
      ['Notre-Dame Cathedral', 'Historic Gothic cathedral', 'Paris', 'sightseeing', 0, 60],
      ['French Cooking Class', 'Learn to cook classic French dishes', 'Paris', 'food', 85.0, 180],
      
      ['Colosseum Tour', 'Ancient Roman amphitheater', 'Rome', 'sightseeing', 18.0, 90],
      ['Vatican Museums', 'Art and history in the Vatican', 'Rome', 'museum', 20.0, 180],
      ['Food Tour', 'Local gastronomy walking tour', 'Rome', 'food', 45.0, 180],
      ['Trevi Fountain', 'Baroque masterpiece', 'Rome', 'sightseeing', 0, 30],
      ['Roman Forum', 'Ancient ruins and history', 'Rome', 'sightseeing', 12.0, 120],
      
      ['Senso-ji Temple', 'Tokyo\'s oldest temple', 'Tokyo', 'sightseeing', 0, 60],
      ['Shibuya Crossing', 'World\'s busiest intersection', 'Tokyo', 'sightseeing', 0, 30],
      ['Tsukiji Fish Market', 'Fresh seafood and sushi', 'Tokyo', 'food', 50.0, 120],
      ['Robot Restaurant Show', 'Unique entertainment experience', 'Tokyo', 'entertainment', 60.0, 90],
      ['Mt. Fuji Day Trip', 'Visit Japan\'s iconic mountain', 'Tokyo', 'adventure', 120.0, 480],
      
      ['Statue of Liberty', 'Iconic symbol of freedom', 'New York', 'sightseeing', 24.0, 180],
      ['Central Park', 'Famous urban park', 'New York', 'sightseeing', 0, 120],
      ['Broadway Show', 'World-class theater', 'New York', 'entertainment', 100.0, 180],
      ['Brooklyn Bridge Walk', 'Historic bridge crossing', 'New York', 'sightseeing', 0, 60],
      ['Museum of Modern Art', 'Art collection', 'New York', 'museum', 25.0, 180],
      
      ['Tower Bridge', 'Iconic London bridge', 'London', 'sightseeing', 12.0, 60],
      ['British Museum', 'World history collection', 'London', 'museum', 0, 180],
      ['Westminster Abbey', 'Historic royal church', 'London', 'sightseeing', 24.0, 90],
      ['Afternoon Tea', 'Traditional British experience', 'London', 'food', 45.0, 90],
      
      ['Sagrada Familia', 'Gaudi\'s masterpiece', 'Barcelona', 'sightseeing', 26.0, 120],
      ['Park Güell', 'Colorful park with Gaudi designs', 'Barcelona', 'sightseeing', 10.0, 120],
      ['Beach Day', 'Relax on Barceloneta Beach', 'Barcelona', 'leisure', 0, 240],
      ['Tapas Tour', 'Sample Spanish tapas', 'Barcelona', 'food', 55.0, 180],
      
      ['Great Wall Hike', 'Day trip to the Great Wall', 'Beijing', 'adventure', 60.0, 360],
      ['Forbidden City', 'Imperial palace complex', 'Beijing', 'sightseeing', 10.0, 180],
      ['Temple of Heaven', 'Ancient temple complex', 'Beijing', 'sightseeing', 6.0, 90],
      ['Peking Duck Dinner', 'Traditional Beijing cuisine', 'Beijing', 'food', 40.0, 90]
    ];
    const stmt = db.prepare(`INSERT OR IGNORE INTO activities (name, description, city, category, cost, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)`);
    activities.forEach(a => stmt.run(a));
    stmt.finalize(() => {
      console.log('Seeded demo user (demo@local / password), admin user (admin@local / admin), cities, and activities');
      process.exit(0);
    });
  });
}

seed();
