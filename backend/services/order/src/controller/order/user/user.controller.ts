import type { Request, Response } from "express";
import OrderModel from "../../../model/order.js";
import { ORDER_CACHE_KEYS } from "../../../util/rediskey.js";
import { OrderStatus } from "../../../model/order.js";
import { getCache,setCache,deleteCache } from "../../../service/redis.service.js";
import mongoose from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const payload = req.body;

  const order = await OrderModel.create({
    ...payload,
    userId,
  });

  await deleteCache(`orders:user:${userId}:*`);

  res.status(201).json({
    success: true,
    data: order,
  });
};


export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const cacheKey = ORDER_CACHE_KEYS.USER_ORDERS(userId, page, limit);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      cached: true,
      ...cached,
    });
  }

  const [orders, total] = await Promise.all([
    OrderModel.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    OrderModel.countDocuments({ userId, isDeleted: false }),
  ]);

  const response = {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, response, 300);

  res.json({
    success: true,
    cached: false,
    ...response,
  });
};


export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(orderId as string)){
    return res.status(400).json({
      success: false,
      message: "Invaild mongoose Id",
    });
  }

  const cacheKey = ORDER_CACHE_KEYS.ORDER_DETAIL(orderId as string, userId);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      cached: true,
      data: cached,
    });
  }

  const order = await OrderModel.findOne({
    _id: orderId,
    userId,
    isDeleted: false,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  await setCache(cacheKey, order, 300);

  res.json({
    success: true,
    cached: false,
    data: order,
  });
};


export const cancelOrder = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await OrderModel.findOne({
    _id: orderId,
    userId,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
    return res.status(400).json({
      message: "Order cannot be cancelled",
    });
  }

  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelledBy = "USER";

  if(reason) {
    order.cancelledReason = reason;
  }

  await order.save();

  await deleteCache(`orders:user:${userId}:*`);
  await deleteCache(`order:${orderId}:*`);

  res.json({
    success: true,
    message: "Order cancelled successfully",
  });
};


export const trackOrder = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  const order = await OrderModel.findOne(
    { _id: orderId, userId },
    { orderStatus: 1, items: 1, updatedAt: 1 }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    success: true,
    data: {
      orderStatus: order.orderStatus,
      items: order.items.map(i => ({
        productId: i.productId,
        status: i.status,
      })),
      lastUpdated: order.updatedAt,
    },
  });
};
