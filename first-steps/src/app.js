const express = require('express');
const cors = require('cors');
const session = require('express-session');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true  // IMPORTANT for sessions!
}));
app.use(express.json());
app.use(express.static('public'));

// Session middleware - SUPER SIMPLE!
app.use(session({
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true
    }
}));

// Public auth endpoints
app.use('/auth', authRoutes);

// Protected hero endpoints
app.use('/heroes', auth, heroRoutes);

// Health check
app.get('/', (_req, res) => {
    res.redirect('/login.html');
});

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res
        .status(err.status || 500)
        .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;