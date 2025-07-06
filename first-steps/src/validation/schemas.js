const Joi = require('joi');

exports.registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required
});

exports.loginSchema = exports.registerSchema;

exports.heroCreateSchema = Joi.object({
    name: Joi.string().min(2).required(),
    age: Joi.number().integer().min(0).required(),
    power: Joi.string().min(2).required()
});

exports.heroUpdateSchema = Joi.object({
    name: Joi.string().min(2),
    age: Joi.number().integer().min(0),
    power: Joi.string().min(2)
}).min(1);