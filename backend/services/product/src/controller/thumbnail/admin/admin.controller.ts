import type { Request, Response } from "express";
import { uploadToCloudinary } from "../../../helper/cloudinaryUpload.js";
import cloudinary from "../../../config/cloudinary.js";
import Thumbnail from "../../../model/thumbnail.js";
 import type { IThumbnail } from "../../../model/thumbnail.js";
import CategoryModel from "../../../model/category.js";
import mongoose from "mongoose";

export const createThumbnail = async (req: Request,res: Response) => {
    const {userId} = req.user
  const { type,heading,paragraph,categoryId,color } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Thumbnail image is required",
    });
  }

  if(!mongoose.Types.ObjectId.isValid(categoryId)){
    return res.status(400).json({
      message:"Invaild category ID",
      success:false
    })
  }

  const category = await CategoryModel.findOne({
    _id:new mongoose.Types.ObjectId(categoryId),
    isActive:true,
    isDeleted:false,
  })

  if(!category){
    return res.status(404).json({
      message:"no Category found on this category id",
      success:false
    })
  }

  const result = await uploadToCloudinary(req.file.path);

  const thumbnail = await Thumbnail.create({
    url: result.secure_url,
    publicId: result.public_id,
    type,
    createdBy: userId,
    categoryId,
    color,
    heading:heading as string,
    paragraph:paragraph as string,
  });

  return res.status(201).json({
    success: true,
    message: "Thumbnail created successfully",
    data: thumbnail,
  });
};

export const updateThumbnail = async (req: Request,res: Response) => {
  const { thumbnailId } = req.params;
  const { type,heading,paragraph,color } = req.body as IThumbnail;

  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) {
    return res.status(404).json({
      success: false,
      message: "Thumbnail not found",
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(thumbnail.publicId);

    const result = await uploadToCloudinary(req.file.path);
    thumbnail.url = result.secure_url;
    thumbnail.publicId = result.public_id;
  }

  if (type) thumbnail.type = type;
  if (heading) thumbnail.heading = heading;
  if (paragraph) thumbnail.paragraph = paragraph;
  if(color) thumbnail.color = color;

  await thumbnail.save();
  
  return res.status(200).json({
    success: true,
    message: "Thumbnail updated successfully",
    data: thumbnail,
  });
};

export const deleteThumbnail = async (req: Request,res: Response) => {
  const { thumbnailId } = req.params;

  const thumbnail = await Thumbnail.findById(thumbnailId);
  if (!thumbnail) {
    return res.status(404).json({
      success: false,
      message: "Thumbnail not found",
    });
  }

  await cloudinary.uploader.destroy(thumbnail.publicId);

  await thumbnail.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Thumbnail deleted successfully",
    data:{
      thumbnailId
    }
  });
};