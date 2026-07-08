import type { Request, Response, NextFunction } from "express";
import JWT from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
    role: "ADMIN" | "SELLER" | "USER";
    isVerified:boolean;
}

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            message: "authorized",
            success: false
        })
    }
    

    const decode = JWT.verify(token, process.env.ACCESSTOKENSERCRET as string) as JwtPayload;

    req.user = decode;

    next();
}