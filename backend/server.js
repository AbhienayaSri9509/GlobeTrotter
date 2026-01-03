const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/stops', require('./routes/stops'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/trip-activities', require('./routes/trip_activities'));
app.use('/api/public', require('./routes/public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`GlobeTrotter backend listening on http://localhost:${PORT}`);
});

module.exports = app;