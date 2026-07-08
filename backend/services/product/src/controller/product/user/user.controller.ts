import type { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel from "../../../model/product.js";
import redis from "../../../config/redis.js";
import { PRODUCT_CACHE_KEYS } from "../../../util/redis.key.js";

export const getProducts = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter: any = {
    isDeleted: false,
    isActive: true,
    isPublished:true
  };

  const search = req.query.search
    ? String(req.query.search).trim()
    : null;

  if (search) {
    filter.$text = { $search: search };
  }

  if (
    req.query.category &&
    mongoose.Types.ObjectId.isValid(String(req.query.category))
  ) {
    filter.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  let sort: any = { createdAt: -1 };

  const sortOrder = req.query.sortOrder === "asc" ? 1 : req.query.sortOrder === "dec" ? -1 : null;

  if (search) {
    sort = { score: { $meta: "textScore" } };
  } else if (sortOrder) {
    sort = {
      [String(req.query.sortBy)]: sortOrder
    };
  }

  const cacheKey = PRODUCT_CACHE_KEYS.LIST(
    JSON.stringify({
      page,
      limit,
      search,
      category: req.query.category || null,
      minPrice: req.query.minPrice || null,
      maxPrice: req.query.maxPrice || null,
      sort
    })
  );

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      ...JSON.parse(cached),
      source: "cache"
    });
  }

  const products = await ProductModel.find(filter, search ? { score: { $meta: "textScore" } } : {})
    .select("-costPrice")
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await ProductModel.countDocuments(filter)


  const response = {
    success: true,
    message: "Products fetched successfully",
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: products
  };

  await redis.setex(cacheKey, 120, JSON.stringify(response));

  return res.status(200).json({
    ...response,
    source: "db"
  });
};

export const getProductbyId = async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({
      message: "Invalid product Id",
      success: false
    });
  }

  const cacheKey = PRODUCT_CACHE_KEYS.BY_ID(productId as string);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Product data fetched successfully",
      data: JSON.parse(cached),
      source: "cache"
    });
  }

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(productId as string),
    isActive: true,
    isDeleted: false,
    isPublished:true
  }).lean();

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false
    });
  }

  await redis.setex(cacheKey, 300, JSON.stringify(product));

  return res.status(200).json({
    message: "Product data fetched successfully",
    success: true,
    data: product,
    source: "db"
  });
};

