import Joi from "joi";

export const idSchema = Joi.object({
    id: Joi.number().integer().min(0).required()
});

export const generationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),
});
