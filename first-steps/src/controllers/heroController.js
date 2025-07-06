const path = require('path');
const PrismaHeroRepository = require('../repositories/prismaHeroRepository');
const { error } = require('console');

// Instantiate repository (point to your JSON file)
const repo = new PrismaHeroRepository();

// GET /heroes
exports.getAllHeroes = async (req, res, next) => {
    try {
        const heroes = await repo.findAllByUser(req.userId);
        res.json(heroes);
    } catch (err) {
        next(err);
    }
};

// GET /heroes/:id
exports.getHeroById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const hero = await repo.findOne(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        if (hero.userId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to view this hero' });
        }
        res.json(hero);
    } catch (err) {
        next(err);
    }
};

// POST /heroes
exports.createHero = async (req, res, next) => {
    try {
        const { name, age, power } = req.body;
        const newHero = await repo.create({
            name,
            age,
            power,
            userId: req.userId     // stamp owner here
        });
        res.status(201).json(newHero);
    } catch (err) {
        next(err);
    }
};

// PUT /heroes/:id
exports.updateHero = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const existing = await repo.findOne(id);
        if (!existing) {
            return res.status(404).json({ error: 'Hero not found' });
        }
        if (existing.userId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to modify this hero' });
        }
        const updated = await repo.update(id, req.body);
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE /heroes/:id
exports.deleteHero = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        const existing = await repo.findOne(id);
        if (!existing) {
            return res.status(404).json({ error: 'Hero not found' });
        }
        if (existing.userId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this hero' });
        }

        await repo.delete(id);
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};