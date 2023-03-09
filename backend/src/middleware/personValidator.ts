import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';

export const statusValidator = (schemas: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { status } = req.body;
        req.body = Joi.attempt(req.body, schemas[status], { abortEarly: false });
        next();
    };
};

export const oldStatusValidator = (schemas: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { oldStatus } = req.body;
        req.body = Joi.attempt(req.body, schemas[oldStatus], { abortEarly: false });
        next();
    };
};
