const express = require('express');
const router = express.Router();
const {
    getAllHeroes,
    getHeroById,
    createHero,
    updateHero,
    deleteHero
} = require('../controllers/heroController');
const validate = require('../middleware/validate');
const { heroCreateSchema, heroUpdateSchema } = require('../validation/schemas');

router.get('/', getAllHeroes);
router.get('/:id', getHeroById);
router.post('/', validate(heroCreateSchema), createHero);
router.put('/:id', validate(heroUpdateSchema), updateHero);
router.delete('/:id', deleteHero);

module.exports = router;