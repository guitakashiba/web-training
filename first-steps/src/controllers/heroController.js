const path = require('path');
const PrismaHeroRepository = require('../repositories/prismaHeroRepository');
const { error } = require('console');

// Instantiate repository (point to your JSON file)
const repo = new PrismaHeroRepository();

// GET /heroes
exports.getAllHeroes = async (req, res, next) => {
    try {
        const heroes = await repo.find();
        res.json(heroes);
    } catch (err) {
        next(err);
    }
};

// GET /heroes/:id
exports.getHeroById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const hero = await repo.find(id);
        if (!hero) return res.status(404).json({ error: 'Hero not found' });
        res.json(hero);
    } catch (err) {
        next(err);
    }
};

// POST /heroes
exports.createHero = async (req, res, next) => {
    try {
        const { name, age, power } = req.body;

        if (!name || age == null || !power) {
            return res
                .status(400)
                .json({ error: 'name, age and power are all required' });
        }

        const newHero = await repo.create({ name, age, power });

        res.status(201).json(newHero);
    } catch (err) {
        next(err);
    }
};

// PUT /heroes/:id
exports.updateHero = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = await repo.update(id, req.body);
        if (!updated) return res.status(404).json({ error: 'Hero not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE /heroes/:id
exports.deleteHero = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = await repo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Hero not found' });
        res.json({ message: 'Hero deleted', hero: deleted });
    } catch (err) {
        next(err);
    }
};