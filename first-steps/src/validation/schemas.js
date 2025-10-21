const Joi = require('joi');

// Removido: registerSchema e loginSchema

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