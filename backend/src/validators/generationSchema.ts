import Joi from "joi";

export const generationSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),
});
