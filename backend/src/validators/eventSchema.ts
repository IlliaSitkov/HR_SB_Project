import Joi from 'joi';
import {intId} from './idSchema';

const fieldsEventCreate = {
    name: Joi.string().trim().required(),

    date_start: Joi.date().required(),

    date_end: Joi.date().required(),

    description: Joi.string().trim().min(0),

    category_id: intId().required(),

    photo: Joi.string().min(0)
};

const fieldsEventUpdate = {
    name: Joi.string().trim(),

    date_start: Joi.date(),

    date_end: Joi.date(),

    description: Joi.alternatives([Joi.string().trim(), '']),

    category_id: intId(),

    photo: Joi.alternatives([Joi.string().trim(), ''])

};

export const eventCreateSchema = Joi.object({
    ...fieldsEventCreate
});

export const eventUpdateSchema = Joi.object({
    ...fieldsEventUpdate
});