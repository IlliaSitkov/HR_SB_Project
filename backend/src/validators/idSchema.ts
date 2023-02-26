import Joi from 'joi';

export const intId = () => Joi.number().integer().min(0)

export const idSchema = Joi.object({
    id: intId().required()
});
