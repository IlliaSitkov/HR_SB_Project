import Joi from 'joi';
import {intId} from './idSchema';
import {Role, Status} from '@prisma/client';

const statusField = () => Joi.string()
    .valid(Status.NEWCOMER, Status.MALIUK, Status.BRATCHYK, Status.POSHANOVANYI, Status.EX_BRATCHYK).required();

export const statusSchema = Joi.object({
    status: statusField()
});

export const oldStatusSchema = Joi.object({
    oldStatus: statusField()
});

const statusSchemaTwoFields = {
    oldStatus: statusField(),

    newStatus: statusField()
};

export const statusUpdateSchema = Joi.object({
    ...statusSchemaTwoFields,

    date: Joi.date().required()
});

export const statusUpdateSchemaToMaliuk = Joi.object({
    ...statusSchemaTwoFields
});

//---------------------------
//name, parental?, surname, date_birth, avatar?
//faculty, specialty, year_enter
//email, telephone, telegram, facebook?
//status, role, parent_id, generation?, about
//date_fill_form, date_vysviata, date_poshanuvannia, date_exclusion

const commonFieldsCreate = {
    status: statusField(),

    name: Joi.string()
        .trim()
        .required(),

    parental: Joi.string()
        .trim(),

    surname: Joi.string()
        .trim()
        .required()
};
const commonFieldsUpdate = {
    status: statusField(),

    name: Joi.string()
        .trim(),

    parental: Joi.alternatives([Joi.string().trim(), '']),

    surname: Joi.string()
        .trim(),

    telephone: Joi.alternatives([Joi.string().trim(), '']),

    facebook: Joi.alternatives([Joi.string().trim(), '']),

    //Should not be added on front
    id: Joi.allow()
};

const commonFieldsOfNewcomerAndMaliukCreate = {
    date_fill_form: Joi.date()
        .required(),

    about: Joi.string()
        .trim()
        .required()
};
const commonFieldsOfNewcomerAndMaliukUpdate = {
    date_fill_form: Joi.alternatives([Joi.date(), null]),

    about: Joi.string()
        .trim()
};

const commonFieldsOfNewcomerAndMaliukAndBratchykCreate = {

    email: Joi.string()
        .trim()
        .email()
        .required(),

    telegram: Joi.string()
        .trim()
        .required(),

    faculty_id: intId()
        .required(),

    specialty_id: intId()
        .required(),

    year_enter: Joi.number()
        .integer()
        .min(1990)
        .required()
};
const commonFieldsOfNewcomerAndMaliukAndBratchykUpdate = {

    email: Joi.alternatives([Joi.string().trim().email(), '']),

    telegram: Joi.alternatives([Joi.string().trim(), '']),

    faculty_id: Joi.alternatives([intId(), null]),

    specialty_id: Joi.alternatives([intId(), null]),

    year_enter: Joi.alternatives([Joi.number().integer().min(1990), null]),
};

const commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk = {
    telephone: Joi.alternatives([Joi.string().trim(), '']),

    facebook: Joi.alternatives([Joi.string().trim(), '']),

    date_birth: Joi.alternatives([Joi.date(), null]),
};

const commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk = {
    parent_id: Joi.alternatives([intId(), null])
};

const commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk = {
    avatar: Joi.any() // ?????
};

const commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk = {
    about: Joi.alternatives([Joi.string().trim(), '']),

    //Should not be included on front !!!
    date_fill_form: Joi.date().allow(),
};

const commonFieldsOfPoshanovanyiAndExBratchyk = {

    email: Joi.alternatives([Joi.string().trim().email(), '']),

    telegram: Joi.alternatives([Joi.string().trim(), '']),

    faculty_id: Joi.alternatives([intId(), null]),

    specialty_id: Joi.alternatives([intId(), null]),

    generation_id: Joi.alternatives([intId(), null]),

    //Should not be included on front !!!
    year_enter: Joi.number()
        .integer()
        .min(1990).allow(),

    date_vysviata: Joi.date()
        .allow()
};

export const newcomerCreateSchema = Joi.object({
    ...commonFieldsCreate,

    ...commonFieldsOfNewcomerAndMaliukCreate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykCreate,

    //they should not be in a form that newcomers fill by themselves !!! Only for create by HR
    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk

});
export const newcomerUpdateSchema = Joi.object({
    ...commonFieldsUpdate,

    ...commonFieldsOfNewcomerAndMaliukUpdate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykUpdate,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk

});

export const maliukCreateSchema = Joi.object({
    ...commonFieldsCreate,

    ...commonFieldsOfNewcomerAndMaliukCreate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykCreate,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

});
export const maliukUpdateSchema = Joi.object({
    ...commonFieldsUpdate,

    ...commonFieldsOfNewcomerAndMaliukUpdate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykUpdate,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

});

export const bratchykCreateSchema = Joi.object({
    ...commonFieldsCreate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykCreate,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    telephone: Joi.string()
        .trim()
        .required(),

    facebook: Joi.alternatives([Joi.string().trim(), '']),

    date_birth: Joi.date()
        .required(),

    parent_id: intId()
        .required(),

    role: Joi.string()
        .valid(/*Role.BRATCHYK,*/ Role.HOLOVA, Role.HR_HEAD, Role.PYSAR, Role.KOMIRNYK, Role.RAK_MEMBER, Role.RECHNYK, Role.SKARBNYK),

    date_vysviata: Joi.date()
        .required()
});
export const bratchykUpdateSchema = Joi.object({
    ...commonFieldsUpdate,

    ...commonFieldsOfNewcomerAndMaliukAndBratchykUpdate,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    role: Joi.alternatives([Joi.string()
        .valid(/*Role.BRATCHYK,*/ Role.HOLOVA, Role.HR_HEAD, Role.PYSAR, Role.KOMIRNYK, Role.RAK_MEMBER, Role.RECHNYK, Role.SKARBNYK), '']),

    date_vysviata: Joi.alternatives([Joi.date(), null])
});

export const poshanovanyiCreateSchema = Joi.object({
    ...commonFieldsCreate,

    ...commonFieldsOfPoshanovanyiAndExBratchyk,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    date_poshanuvannia: Joi.alternatives([Joi.date(), null])

});
export const poshanovanyiUpdateSchema = Joi.object({
    ...commonFieldsUpdate,

    ...commonFieldsOfPoshanovanyiAndExBratchyk,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    date_poshanuvannia: Joi.alternatives([Joi.date(), null])
});

export const exBratchykCreateSchema = Joi.object({
    ...commonFieldsCreate,

    ...commonFieldsOfPoshanovanyiAndExBratchyk,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    parent_id: intId()
        .required(),

    date_exclusion: Joi.date()
        .required()
});
export const exBratchykUpdateSchema = Joi.object({
    ...commonFieldsUpdate,

    ...commonFieldsOfPoshanovanyiAndExBratchyk,

    ...commonFieldsOfBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndBratchykAndPoshanovanyiAndExBratchyk,

    ...commonFieldsOfMaliukAndUpdateBratchykAndPoshanovanyiAndUpdateExBratchyk,

    ...commonFieldsOfNewcomerAndMaliukAndUpdateBratchykAndPoshanovanyiAndExBratchyk,

    date_exclusion: Joi.alternatives([Joi.date(), null])
});
