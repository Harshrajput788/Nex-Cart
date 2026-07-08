import fs from "fs-extra";
import type { Express } from "express";
import cloudinary from "../config/cloudinary.js";

interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadProductImages = async (
  files: Express.Multer.File[],
  productId: string
): Promise<UploadedImage[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedImages: UploadedImage[] = [];

  try {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
        public_id: `${productId}/${file.filename}`,
        resource_type: "image",
        overwrite: true
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id
      });

      await fs.remove(file.path);
    }

    return uploadedImages;
  } catch (error) {
    for (const file of files) {
      await fs.remove(file.path).catch(() => {});
    }

    throw error;
  }
};