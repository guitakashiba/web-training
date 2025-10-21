const PrismaHeroRepository = require('../repositories/prismaHeroRepository');

const repo = new PrismaHeroRepository();

// GET /heroes - Retorna TODOS os heróis
exports.getAllHeroes = async (req, res, next) => {
    try {
        const heroes = await repo.findAll();
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
        
        if (!hero) {
            return res.status(404).json({ error: 'Hero not found' });
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
        const existing = await repo.findOne(id);
        
        if (!existing) {
            return res.status(404).json({ error: 'Hero not found' });
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

        await repo.delete(id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};