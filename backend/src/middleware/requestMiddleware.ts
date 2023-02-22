import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const requestValidator = (schema: any, property: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        req[property as keyof Request] = Joi.attempt(req[property as keyof Request], schema);
        next();
    };
};
