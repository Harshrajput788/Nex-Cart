import type { Request, Response } from "express";
import mongoose from "mongoose";
import { generateSlug } from "../../../util/generateSlug.js";
import ProductModel, { type IProduct } from "../../../model/product.js";
import CategoryModel from "../../../model/category.js";
import { uploadSingleBuffer, deleteFromCloudinary } from "../../../helper/cloudinaryUpload.js";
import { PRODUCT_CACHE_KEYS } from "../../../util/redis.key.js";
import redis from "../../../config/redis.js";
import { invalidateProductCache } from "../../../helper/invalidateProductCache.js";

export const getProductsbySeller = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;
  const { userId } = req.user;

  const filter: any = {
    isActive:true,
    isDeleted: false,
    sellerId: userId
  };

  if (req.query.search) {
    filter.$text = { $search: String(req.query.search) };
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

  const sortBy = String(req.query.sortBy || "createdAt");
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const cacheKey = PRODUCT_CACHE_KEYS.LIST(
    JSON.stringify({
      sellerId: userId,
      page,
      limit,
      search: req.query.search || null,
      category: req.query.category || null,
      minPrice: req.query.minPrice || null,
      maxPrice: req.query.maxPrice || null,
      sortBy,
      sortOrder
    })
  );

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      ...JSON.parse(cached),
      source: "cache"
    });
  }

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .select("-costPrice -__v")
      .populate("category", "name slug")
      .populate("brand", "name slug")
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

  return res.status(200).json({
    ...response,
    source: "db"
  });
};

export const createProduct = async (req: Request, res: Response) => {

  const { name, description, shortDescription, costPrice, category, price, salePrice, stock, sku, isActive = true, isPublished = false } = req.body as IProduct;

  const { userId } = req.user;

  const files = req.files as Express.Multer.File[];

  if (!name || !category || !price || !stock || !sku) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing"
    });
  }


  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  if (salePrice && salePrice >= price) {
    return res.status(400).json({
      success: false,
      message: "Sale price must be less than price"
    });
  }

  const categoryExists = await CategoryModel.findOne({
    _id: new mongoose.Types.ObjectId(category),
    isDeleted: false,
    isActive: true
  });

  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }

  const skuExists = await ProductModel.findOne({
    sku,
    isDeleted: false
  });

  if (skuExists) {
    return res.status(409).json({
      success: false,
      message: "SKU already exists"
    });
  }

  const uploadPromises = files.map((file, index) =>
    uploadSingleBuffer(file.buffer));

  const uploadedImages = await Promise.all(uploadPromises);

  let slug = generateSlug(name);

  const slugExists = await ProductModel.findOne({ slug });
  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  const productPayload: any = {
    name,
    slug,
    description,
    category,
    price: Number(price),
    shortDescription,
    salePrice: Number(salePrice),
    stock: Number(stock),
    costPrice: Number(costPrice),
    sku,
    images: uploadedImages,
    isActive,
    isPublished,
    sellerId: userId,
  };

  const product = await ProductModel.create(productPayload);

  await invalidateProductCache();

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
};

export const updateProduct = async (req: Request, res: Response) => {

  const { productId } = req.params;
  const { userId } = req.user;

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
      sellerId: userId,
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

};

export const updateProductStatus = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { userId } = req.user;
  const {active} = req.body;

  console.log(active);

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await ProductModel.findOne(
    {
      _id: new mongoose.Types.ObjectId(productId as string),
      sellerId: userId,
      isDeleted: false,
    });

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  product.isActive = active
  await product.save();

  await invalidateProductCache(productId as string);

  res.status(200).json({
    success: true,
    message: "Product status updated successfully",
    data: {
      id: product._id,
      isActive: product.isActive,
    },
  });
};

export const updateProductStock = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { stock, operation = "set" } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      success: false,
      message: "Stock must be a non-negative number",
    });
  }

  let updateQuery: any = {};

  if (operation === "increment") {
    updateQuery = { $inc: { stock:1 } };
  } else if (operation === "decrement") {
    updateQuery = { $inc: { stock: -1 } };
  } else {
    updateQuery = { $set: { stock } };
  }

  const product = await ProductModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(productId as string),
      ...(operation === "decrement" && { stock: { $gte: stock } }),
    },
    updateQuery,
    { new: true }
  );

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product not found or insufficient stock",
    });
  }

  await invalidateProductCache(productId as string);

  res.status(200).json({
    success: true,
    message: "Product stock updated successfully",
    data:product
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(productId as string),
    sellerId: userId,
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
  });
};

export const uploadProductImagesById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { userId } = req.user;
  const { replaceAll = false } = req.body;
  const files = req.files as Express.Multer.File[];

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No images provided",
    });
  }

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(productId as string),
    sellerId: userId,
    isActive: true,
    isDeleted: false,
  });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (replaceAll && product.images.length > 0) {
    await deleteFromCloudinary(
      product.images.map(img => img.publicId)
    );
    product.images = [];
  }

  const uploadPromises = files.map((file, index) =>
    uploadSingleBuffer(file.buffer));

  const uploadedImages = await Promise.all(uploadPromises);
  product.images.push(...uploadedImages);

  await product.save();
  await invalidateProductCache(productId as string);

  res.status(200).json({
    success: true,
    message: "Product images uploaded successfully",
    data: product.images,
  });
};
