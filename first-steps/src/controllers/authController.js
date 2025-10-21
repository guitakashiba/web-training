const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hash }
        });
        
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Store user in session - SUPER SIMPLE!
        req.session.userId = user.id;
        req.session.email = user.email;
        
        res.json({ success: true, email: user.email });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true });
    });
};

exports.checkAuth = async (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, email: req.session.email });
    } else {
        res.json({ authenticated: false });
    }
};