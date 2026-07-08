import mongoose from "mongoose";
import ProductModel from "../../../model/product.js";
import type { Request, Response } from "express";
import redis from "../../../config/redis.js";
import CategoryModel from "../../../model/category.js";
import { PRODUCT_CACHE_KEYS } from "../../../util/redis.key.js";
import { invalidateProductCache } from "../../../helper/invalidateProductCache.js";
import { deleteFromCloudinary } from "../../../helper/cloudinaryUpload.js";


export const approveProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { isPublished } = req.body;


  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({
      error: "Invalid product Id",
      success: false
    });
  }

  const product = await ProductModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(productId as string),
      isDeleted: false
    },
    {
      $set: {
        isActive: true,
        isPublished
      }
    },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
      success: false
    });
  }

  await invalidateProductCache(productId as string);

  return res.status(200).json({
    data: product,
    success: true,
  });
};

export const getAllProduct = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const filter: any = {
    isDeleted: false,
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
}

export const deleteProductByAdmin = async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(productId as string),
    isActive: true,
    isDeleted: false,
  });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const publicIds = product.images.map(img => img.publicId);
  if (publicIds.length) {
    await deleteFromCloudinary(publicIds);
  }

  product.isActive = false
  product.isPublished = false;
  product.isDeleted = true;

  await product.save();
  await invalidateProductCache(productId as string);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data:product
  });
}

export const updateProductByAdmin = async (req:Request,res:Response) =>{
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  if (req.body.salePrice && Number(req.body.salePrice) >= Number(req.body.price)) {
    return res.status(400).json({
      success: false,
      message: "Sale price must be less than price"
    });
  }

  if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  const categoryExists = await CategoryModel.findOne({
    _id: new mongoose.Types.ObjectId(req.body.category),
    isDeleted: false,
    isActive: true
  });

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }


  const updatedProduct = await ProductModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(productId as string),
      isActive: true,
      isDeleted: false,
    },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        category: req.body.category,
        price: Number(req.body.price),
        salePrice: Number(req.body.salePrice),
        stock: Number(req.body.stock),
      }
    },
    { runValidators: true, returnDocument: "after" }
  );

  if (!updatedProduct) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  await invalidateProductCache(productId as string);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });

}

export const updateProductStatusbyAdmin = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const {isActive} = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  const product = await ProductModel.findOneAndUpdate({
    _id: new mongoose.Types.ObjectId(productId as string),
    isDeleted: false,
  },
  {
    $set:{
      isActive,
    },
  },{
    runValidators:true,returnDocument:"after"
  },
);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  await invalidateProductCache(productId as string);

  return res.status(200).json({
    success: true,
    message: "Product status updated successfully",
    data: {
      id: product._id,
      isActive: product.isActive
    }
  });
};