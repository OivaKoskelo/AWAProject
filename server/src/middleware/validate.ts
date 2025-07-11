import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
//Validation Middleware to validate that Email is "legit" 
// and that password is at least somewhat secure
export const registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors = errors.array().map(err => err.msg);
            res.status(400).json({ error: extractedErrors.join(', ') });
        }
        next();
    }
];

export const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const extractedErrors = errors.array().map(err => err.msg);
            res.status(400).json({ error: extractedErrors.join(', ') });
        }
        next();
    }
];