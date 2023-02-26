import {NextFunction, Request, Response} from "express";
import Joi from "joi";

export const personValidator = (schemas: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { status } = req.body;
        req.body = Joi.attempt(req.body, schemas[status], { abortEarly: false });
        next();
    };
};
