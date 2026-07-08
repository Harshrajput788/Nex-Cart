import type { Request, Response } from "express";
import mongoose from "mongoose";
import ProductVariantModel from "../../../model/variant.js";
import ProductModel from "../../../model/product.js";
import { invalidateVariantCache } from "../../../helper/invalidateProductCache.js";

export const createVariant = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { sku, attributes, price, salePrice, stock } = req.body;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await ProductModel.findOne({
    _id: new mongoose.Types.ObjectId(productId as string),
    isActive: true,
    isDeleted: false,
    sellerId: userId
  }).lean();

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const existingSku = await ProductVariantModel.findOne({ sku });
  if (existingSku) {
    return res.status(409).json({
      success: false,
      message: "SKU already exists",
    });
  }

  const variant = await ProductVariantModel.create({
    productId: new mongoose.Types.ObjectId(productId as string),
    sku,
    attributes,
    price,
    salePrice,
    stock,
  });

  await invalidateVariantCache(productId as string)

  res.status(201).json({
    success: true,
    message: "Variant created successfully",
    data: variant,
  });

};

export const updateVariant = async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(variantId as string)) {
    return res.status(400).json({ success: false, message: "Invalid variant ID" });
  }

  if (updates.sku) {
    const exists = await ProductVariantModel.findOne({
      sku: updates.sku,
    });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "SKU already in use",
      });
    }
  }

  const variant = await ProductVariantModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(variantId as string), isDeleted: false },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }

  await invalidateVariantCache(
    variant.productId.toString(),
    variant._id.toString()
  );

  res.status(200).json({
    success: true,
    message: "Variant updated successfully",
    data: variant,
  });

};

export const updateVariantStock = async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const { stock, operation = "set" } = req.body;

  if (!mongoose.Types.ObjectId.isValid(variantId as string)) {
    return res.status(400).json({ success: false, message: "Invalid variant ID" });
  }

  let updateQuery: any = {};

  if (operation === "increment") {
    updateQuery = { $inc: { stock } };
  } else if (operation === "decrement") {
    updateQuery = { $inc: { stock: -stock } };
  } else {
    updateQuery = { $set: { stock } };
  }

  const variant = await ProductVariantModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(variantId as string),
      isDeleted: false,
      ...(operation === "decrement" && { stock: { $gte: stock } }),
    },
    updateQuery,
    { new: true }
  );

  if (!variant) {
    return res.status(400).json({
      success: false,
      message: "Insufficient stock or variant not found",
    });
  }

  await invalidateVariantCache(
    variant.productId.toString(),
    variant._id.toString()
  );

  res.status(200).json({
    success: true,
    message: "Variant stock updated",
    data: {
      variantId: variant._id,
      productId:variant.productId,
      stock: variant.stock,
    },
  });
};

export const updateVariantStatus = async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const { isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(variantId as string)) {
    return res.status(400).json({ success: false, message: "Invalid variant ID" });
  }

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isActive must be boolean",
    });
  }

  const variant = await ProductVariantModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(variantId as string), isDeleted: false },
    { $set: { isActive } },
    { new: true }
  );

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }

  await invalidateVariantCache(
    variant.productId.toString(),
    variant._id.toString()
  );

  res.status(200).json({
    success: true,
    message: `Variant ${isActive ? "enabled" : "disabled"} successfully`,
    data: {
      variantId: variant._id,
      productId:variant.productId,
      isActive: variant.isActive,
    },
  });
};

export const deleteVariant = async (req: Request, res: Response) => {
  const { variantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(variantId as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid variant ID",
    });
  }

  const variant = await ProductVariantModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(variantId as string), isDeleted: false },
    {
      $set: {
        isDeleted: true,
        isActive: false,
      },
    },
    { new: true }
  );

  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found or already deleted",
    });
  }

  await invalidateVariantCache(
    variant.productId.toString(),
    variant._id.toString()
  );

  res.status(200).json({
    success: true,
    message: "Variant deleted successfully",
    data: {
      variantId: variant._id,
      productId: variant.productId,
    },
  });
};