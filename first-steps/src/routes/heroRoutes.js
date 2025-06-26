const express = require('express');
const router = express.Router();
const {
    getAllHeroes,
    getHeroById,
    createHero,
    updateHero,
    deleteHero
} = require('../controllers/heroController');

router.get('/', getAllHeroes);
router.get('/:id', getHeroById);
router.post('/', createHero);
router.put('/:id', updateHero);
router.delete('/:id', deleteHero);

module.exports = router;