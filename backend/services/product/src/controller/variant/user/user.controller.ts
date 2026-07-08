import type { Request, Response } from "express";
import mongoose from "mongoose";
import ProductVariantModel from "../../../model/variant.js";
import redis from "../../../config/redis.js";
import { VARIANT_CACHE_KEYS } from "../../../util/redis.key.js";

export const getVariantsByProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Number(limit), 100);
  const skip = (pageNumber - 1) * pageSize;

  const cacheKey = VARIANT_CACHE_KEYS.BY_PRODUCT(
    productId as string,
    `p=${pageNumber}&l=${pageSize}`
  );

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const filter = {
    productId: new mongoose.Types.ObjectId(productId as string),
    isDeleted: false,
    isActive: true,
  };

  const [variants, total] = await Promise.all([
    ProductVariantModel.find(filter)
      .sort({ price: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    ProductVariantModel.countDocuments(filter),
  ]);

  const response = {
    success: true,
    data: variants,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };

  await redis.setex(cacheKey, 300, JSON.stringify(response));

  res.status(200).json(response);
};

export const getVariantById = async (req: Request, res: Response) => {
  const { variantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(variantId as string)) {
    return res.status(400).json({ success: false, message: "Invalid variant ID" });
  }

  const cacheKey = VARIANT_CACHE_KEYS.BY_ID(variantId as string);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const variant = await ProductVariantModel.findOne({
    _id: new mongoose.Types.ObjectId(variantId as string),
    isDeleted: false,
  }).lean();

  if (!variant) {
    return res.status(404).json({ success: false, message: "Variant not found" });
  }

  const response = { success: true, data: variant };

  await redis.setex(cacheKey, 600, JSON.stringify(response))

  res.status(200).json(response);
};