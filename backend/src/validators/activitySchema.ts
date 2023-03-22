import Joi from 'joi';
import {intId} from './idSchema';

const fieldsActivityCreate = {
    person_id: intId().required(),

    event_id: intId().required(),

    hours: Joi.number().required(),

    position: Joi.string().trim(),

    contribution: Joi.string().trim().required()
};

const fieldsActivityUpdate = {
    hours: Joi.number(),

    position: Joi.string().trim(),

    contribution: Joi.string().trim()
};

export const activityCreateSchema = Joi.object({
    ...fieldsActivityCreate
});

export const activityUpdateSchema = Joi.object({
    ...fieldsActivityUpdate
});