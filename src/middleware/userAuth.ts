import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const secreat = process.env.JWT_SECRET || "jsonwebToken";

        if(!token) {
            res.status(401).json({ message: 'Not authorized, no token' });
            return;
        }

        const decoded = jwt.verify(token, secreat) as JwtPayload;
        (req as any).user = decoded;
        next();
    }catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
        return;
    }
}