const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)
module.exports.legendSchema = Joi.object({
    name:Joi.string().required().min(4).max(30).escapeHTML(),
    DOB: Joi.date().required(),
    POB:Joi.string().required().escapeHTML(),
    about:Joi.string().required(),
    deleteImages:Joi.array(),
});

