import Joi from "joi";
import {intId} from "./idSchema";

const fieldsEventCreate = {
    name: Joi.string().trim().required(),

    date_start: Joi.date().required(),

    date_end: Joi.date().required(),

    description: Joi.string().required(),

    category_id: intId().required(),

    photo: Joi.object().required()
}

const fieldsEventUpdate = {
    name: Joi.string().trim(),

    date_start: Joi.date(),

    date_end: Joi.date(),

    description: Joi.string(),

    category_id: intId(),

    photo: Joi.object()
}

export const eventCreateSchema = Joi.object({
    ...fieldsEventCreate
});

export const eventUpdateSchema = Joi.object({
    ...fieldsEventUpdate
});