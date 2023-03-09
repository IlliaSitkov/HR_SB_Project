import {Request, Response, NextFunction} from 'express';
import {ApiError} from '../models/ApiError';
import Joi from 'joi';
import {ErrorResponse} from '../models/ErrorResponse';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    if (error instanceof ApiError) {
        const {code, message} = error;
        res.status(code);
        res.json(new ErrorResponse(code, message));
        return;
    } else if (Joi.isError(error)) {
        const obj: {field: string|undefined, message: string}[] = [];
        res.status(400).json(
            error.details.reduce((acc, err) => {
                acc.errors.push({
                    field: err.context?.label,
                    message: err.message
                });
                return acc;
            }, {message: 'Неправильний формат даних', errors:obj})
        );
        return;
    }
    res.status(500);
    res.json(new ErrorResponse(500, error.message));
};
