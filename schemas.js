const Joi = require('joi');

module.exports.legendSchema = Joi.object({
    name:Joi.string().required().min(4).max(30),
    DOB: Joi.date().required(),
    POB:Joi.string().required(),
    about:Joi.string().required(),
    deleteImages:Joi.array(),
});

