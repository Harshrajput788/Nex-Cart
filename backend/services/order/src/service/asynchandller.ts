import type { Request, Response, NextFunction } from "express";


export const asyncHandlerFunction = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await fn(req, res, next);
            return result;  
        } catch (error) {
            console.log("Async Handler Error:", error);
            return res.status(500).json({ message: "Internal Server Error", success: false });
        }
    }
}