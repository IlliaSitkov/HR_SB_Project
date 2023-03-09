import Joi from 'joi';
import {RoleEnum} from '../utils/enum/Role.enum';

export const addUserSchema = Joi.object({
    personId: Joi.number().integer().min(0).required(),
    role: Joi.string().required().valid(...Object.values(RoleEnum))
});

export const updateUserSchema = Joi.object({
    role: Joi.string().valid(...Object.values(RoleEnum))
});
