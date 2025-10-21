const express = require('express');
const cors = require('cors');
const heroRoutes = require('./routes/heroRoutes');

const app = express();

// Middleware
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON bodies

// Hero endpoints (sem autenticação)
app.use('/heroes', heroRoutes);

// Health check
app.get('/', (_req, res) => {
    res.send('🚀 Hero API is running (Development Mode - No Auth)');
});

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res
        .status(err.status || 500)
        .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;