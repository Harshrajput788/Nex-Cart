import mongoose from "mongoose";
import type { Request,Response } from "express";
import Thumbnail from "../../../model/thumbnail.js";

export const getThumbnails = async (req: Request, res: Response) => {
    const thumbnails = await Thumbnail.find().lean();
    res.status(200).json({
        success:true,
        message:"Thumbnails fetched successfully",
        data:thumbnails
    });   
}

export const getThumbnailById = async (req: Request, res: Response) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id as string)){
        return res.status(400).json({
            success:false,
            message:"Invalid thumbnail ID"
        });
    }

    const thumbnail = await Thumbnail.findById(id).lean();
    if(!thumbnail){
        return res.status(404).json({
            success:false,
            message:"Thumbnail not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"Thumbnail fetched successfully",
        data:thumbnail
    });
}