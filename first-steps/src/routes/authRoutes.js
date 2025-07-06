const express = require('express');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/schemas');
const router = express.Router();

router.post('/register', register);
router.post('/register', validate(registerSchema), register);
router.post('/login', login);
router.post('/login', validate(loginSchema), login);

module.exports = router;