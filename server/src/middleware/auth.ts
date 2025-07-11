import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface DecodedToken {
    id: string;
}
//Authentication Middleware 
export const authMiddleware = (req: Request & { user?: DecodedToken }, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send('No token');
        return
    }
    //Basically just checks that you have a token, and that the token decodes with the JWT_SECRET from .env file
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded;
        next();
    } catch {
        res.status(401).send('Invalid token');
    }
};