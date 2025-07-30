import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

export const validateRequest = (zodSchema: ZodObject<ZodRawShape>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await zodSchema.parseAsync(req.body);
            next();
        } catch (error) {
            // Optionally you can send a response with validation error details
            // res.status(400).json({ error: error.errors });
            next(error);
        }
    };
};

export default validateRequest;
