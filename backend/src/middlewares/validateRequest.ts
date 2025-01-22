import { Response, Request, NextFunction } from 'express';
// export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
import { RequestValidationError } from '../errors/request-validation-error'; 
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request,res: Response,next: NextFunction) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    throw new RequestValidationError(errors.array());
   }
   next();
};