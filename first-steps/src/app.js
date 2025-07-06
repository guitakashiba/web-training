const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');

const app = express();

// Middleware
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON bodies

// Public auth endpoints
app.use('/auth', authRoutes);

// Protected hero endpoints
app.use('/heroes', auth, heroRoutes);

// Optional health check
app.get('/', (_req, res) => {
    res.send('🚀 Hero API is running');
});

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res
        .status(err.status || 500)
        .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
