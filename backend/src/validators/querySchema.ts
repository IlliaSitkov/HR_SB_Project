import Joi from 'joi';
import {intId} from './idSchema';


export const personIdSchema = Joi.object({
    personId: intId().required()
});


