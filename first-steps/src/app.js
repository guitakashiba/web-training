const express = require('express');
const cors = require('cors');
const heroRoutes = require('./routes/heroRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');

const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json());

// Public auth endpoints
app.use('/auth', authRoutes);

// Protected hero endpoints
app.use('/heroes', auth, heroRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
    console.log(`API listening on https://localhost:${PORT}`)
);