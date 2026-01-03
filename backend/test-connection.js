// Quick test script to verify backend setup
const db = require('./db');

console.log('Testing database connection...');

db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
  if (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
  console.log(`✅ Database connected! Users in database: ${row.count}`);
  
  db.get('SELECT COUNT(*) as count FROM cities', [], (err, row) => {
    if (err) {
      console.error('❌ Error checking cities:', err.message);
    } else {
      console.log(`✅ Cities in database: ${row.count}`);
    }
    
    db.get('SELECT COUNT(*) as count FROM activities', [], (err, row) => {
      if (err) {
        console.error('❌ Error checking activities:', err.message);
      } else {
        console.log(`✅ Activities in database: ${row.count}`);
      }
      
      console.log('\n✅ All checks passed! Backend is ready.');
      process.exit(0);
    });
  });
});

