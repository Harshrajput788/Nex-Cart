import CategoryModel from "../../../model/category.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import redis from "../../../config/redis.js";
import ProductModel from "../../../model/product.js";
import { USER_CATEGORY_CACHE_KEYS } from "../../../util/redis.key.js";

export const getAllCategories = async (req: Request, res: Response) => {
    const { isActive, parent } = req.query;

    const filter: any = { isDeleted: false };

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (parent) filter.parent = parent;

    const cacheKey = USER_CATEGORY_CACHE_KEYS.ALL(
        JSON.stringify({ isActive, parent })
    );

    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            count: JSON.parse(cached).length,
            data: JSON.parse(cached),
            source: "cache"
        });
    }

    const categories = await CategoryModel.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .populate("parent", "name slug")
        .lean();

    await redis.setex(cacheKey, 300, JSON.stringify(categories));

    return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
        source: "db"
    });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  const cacheKey = USER_CATEGORY_CACHE_KEYS.BY_ID(categoryId as string);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      data: JSON.parse(cached),
      source: "cache"
    });
  }

  const category = await CategoryModel.findOne({
    _id: new mongoose.Types.ObjectId(categoryId as string),
    isDeleted: false
  })
    .populate("parent", "name slug")
    .lean();

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }

  await redis.setex(cacheKey, 600, JSON.stringify(category));

  return res.status(200).json({
    success: true,
    data: category,
    source: "db"
  });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const sortBy = String(req.query.sortBy || "createdAt");
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const cacheKey = USER_CATEGORY_CACHE_KEYS.PRODUCTS(
    JSON.stringify({
      categoryId,
      page,
      limit,
      sortBy,
      sortOrder
    })
  );

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      ...JSON.parse(cached),
      source: "cache"
    });
  }

  const filter = {
    category: new mongoose.Types.ObjectId(categoryId as string),
    isDeleted: false,
    isActive: true,
    isPublished: true
  };

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .select("-costPrice")
      .populate("category", "name slug")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    ProductModel.countDocuments(filter)
  ]);

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

  return res.status(200).json(response);
};