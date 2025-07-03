const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

module.exports = (req, res, next) => {
    const header = req.header('Authorization') || '';
    const token = header.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};