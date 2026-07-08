import cloudinary from "../config/cloudinary.js";
import type { UploadApiOptions } from "cloudinary";

type UploadedImage = {
  url: string;
  publicId: string;
};

export const uploadSingleBuffer = (buffer: Buffer, publicId?: string): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};


export const deleteFromCloudinary = async (publicIds: string[] | string): Promise<void> => {
  if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) {
    return;
  }

  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

  try {
    const result = await cloudinary.api.delete_resources(ids, {
      resource_type: "image",
      invalidate: true,
    });

    const failed = Object.entries(result.deleted)
      .filter(([, status]) => status !== "deleted")
      .map(([id]) => id);

    if (failed.length > 0) {
      console.warn("Cloudinary deletion failed for:", failed);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete images from Cloudinary");
  }
};

export const uploadToCloudinary = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "ecommerce/thumbnails",
    resource_type: "image",
    overwrite: true
  });
};