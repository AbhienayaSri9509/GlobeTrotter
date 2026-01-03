const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// More permissive CORS for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GlobeTrotter API is running' });
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/stops', require('./routes/stops'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/trip-activities', require('./routes/trip_activities'));
app.use('/api/public', require('./routes/public'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/budget', require('./routes/budget'));

const PORT = process.env.PORT || 5000;

// Error handling for server startup
const server = app.listen(PORT, () => {
	console.log(`GlobeTrotter backend listening on http://localhost:${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`\n❌ Port ${PORT} is already in use!`);
		console.error(`Please either:`);
		console.error(`1. Stop the process using port ${PORT}`);
		console.error(`2. Use a different port: PORT=5001 npm start\n`);
	} else {
		console.error('Server error:', err);
	}
	process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		console.log('HTTP server closed');
	});
});

module.exports = app;