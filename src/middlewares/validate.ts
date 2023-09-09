import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils';

const validate_input = (Schema: Joi.ObjectSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const method: string = req.method;
        if(method === 'GET'){
            req.query = await Schema.validateAsync(req.query);
            console.log(req.query);
        }
        else{
            req.body = await Schema.validateAsync(req.body);
            console.log(req.body);
        }
        next()
    } catch (error) {
        if (error instanceof Error) {
          next(AppError.BadRequest(res, error.message));
        }
        else {
            console.log(error);
        }
    }
}

export default validate_input;