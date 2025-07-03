const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

exports.register = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }
        
        // Check for existing user
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Hash and create
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {email, password: hash}
        });
        res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Lookup user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.satus(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
};