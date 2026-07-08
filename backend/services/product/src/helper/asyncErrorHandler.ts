import type { Request,Response,NextFunction } from "express";

export const asyncHandlerFunction = (Fn:Function) =>{
    return async (req:Request,res:Response,next:NextFunction) =>{
        try {
            const result = await Fn(req,res,next);
            return result;
        } catch (error) {
            console.log("Server error "+error);
            return res.status(500).json({error:"Server error "+error,success:false})
        }
    }
}