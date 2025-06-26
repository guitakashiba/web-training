const express = require('express');
const heroRoutes = require('./routes/heroRoutes');
const app = express();

app.use(express.json());

// Mount the heroes routes
app.use('/heroes', heroRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on https://localhost:${PORT}`));