// controllers/cart.admin.controller.ts
import type { Request, Response } from "express";
import CartModel from "../../../model/cart.js";
import redis from "../../../config/redis.js";
import {ADMIN_CART_PAGE ,ADMIN_CART_ALL,ADMIN_CART_BY_ID,ADMIN_CART_BY_USER } from "../../../util/redis.key.js";
import mongoose from "mongoose";


export const getAllCart = async (
  req: Request,
  res: Response
) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const isActive =
    req.query.isActive !== undefined
      ? req.query.isActive === "true"
      : undefined;

  const skip = (page - 1) * limit;
  const cacheKey = ADMIN_CART_PAGE(page, limit, isActive);

  
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      source: "cache",
      ...JSON.parse(cached),
    });
  }

  const filter: Record<string, any> = { isDeleted: false };
  if (isActive !== undefined) filter.isActive = isActive;

  const [carts, total] = await Promise.all([
    CartModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CartModel.countDocuments(filter),
  ]);

  const response = {
    success: true,
    source: "db",
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: carts,
  };

  await redis.setex(cacheKey, 300, JSON.stringify(response));

  res.json(response);
};


export const getCartById = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const cacheKey = ADMIN_CART_BY_ID(cartId as string);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      source: "cache",
      data: JSON.parse(cached),
    });
  }

  const cart = await CartModel.findOne({
    _id: new mongoose.Types.ObjectId(cartId as string),
    isDeleted: false,
  }).lean();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  await redis.setex(cacheKey, 300, JSON.stringify(cart));

  res.json({
    success: true,
    source: "db",
    data: cart,
  });
};

export const getCartByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cacheKey = ADMIN_CART_BY_USER(userId as string);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      source: "cache",
      data: JSON.parse(cached),
    });
  }

  const cart = await CartModel.findOne({
    userId :userId as string,
    isDeleted: false,
  }).lean();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found for user",
    });
  }

  await redis.setex(cacheKey, 300, JSON.stringify(cart));

  res.json({
    success: true,
    source: "db",
    data: cart,
  });
};


export const deactivateCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    { isActive: false },
    { new: true }
  ).lean();

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  await redis.del([
    ADMIN_CART_ALL,
    ADMIN_CART_BY_ID(cartId as string),
    ADMIN_CART_BY_USER(cart.userId.toString()),
  ]);

  res.json({
    success: true,
    message: "Cart deactivated successfully",
    data: cart,
  });
};