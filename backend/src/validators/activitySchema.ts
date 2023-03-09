import Joi from 'joi';
import {intId} from './idSchema';

const fieldsActivityCreate = {
    person_id: intId().required(),

    event_id: intId().required()
};

const fieldsActivityUpdate = {
    ...fieldsActivityCreate,

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

export const activityDeleteSchema = Joi.object({
    ...fieldsActivityCreate
});
