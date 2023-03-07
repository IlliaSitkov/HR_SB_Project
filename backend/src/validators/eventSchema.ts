import Joi from 'joi';

export const eventSchema = Joi.object({
    name: Joi.string().required()
});