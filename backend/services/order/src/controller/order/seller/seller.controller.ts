import type { Request, Response } from "express";
import OrderModel from "../../../model/order.js";
import { OrderStatus } from "../../../model/order.js";
import { SELLER_ORDER_CACHE_KEYS, SELLER_ANALYTICS_CACHE_KEYS } from "../../../util/rediskey.js";
import { getCache, setCache, deleteCache } from "../../../service/redis.service.js";
import mongoose from "mongoose";

export const getSellerOrders = async (req: Request, res: Response) => {
  const sellerId = req.user.userId as string;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({
      message: "Invaild Seller Id",
      success: false
    })
  }

  const cacheKey = SELLER_ORDER_CACHE_KEYS.SELLER_ORDERS(
    sellerId,
    page,
    limit
  );



  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, ...cached });
  }

  const matchStage = {
    "items.sellerId": sellerId,
    isDeleted: false,
  };

  const orders = await OrderModel.aggregate([
    { $match: matchStage },
    {
      $project: {
        orderNumber: 1,
        orderStatus: 1,
        createdAt: 1,
        items: {
          $filter: {
            input: "$items",
            as: "item",
            cond: { $eq: ["$$item.sellerId", sellerId] },
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await OrderModel.countDocuments(matchStage);

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

  res.json({ success: true, cached: false, ...response });
};

export const getSellerMonthlyAnalytics = async (req: Request, res: Response) => {
  const sellerId = req.user.userId;
  const year = Number(req.query.year) || new Date().getFullYear();

  const cacheKey =
    SELLER_ANALYTICS_CACHE_KEYS.MONTHLY_ANALYTICS(sellerId, year);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cached,
    });
  }

  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const sales = await OrderModel.aggregate([
    {
      $match: {
        isDeleted: false,
        orderStatus: "DELIVERED",
        "payment.status": "PAID",
        "items.sellerId":sellerId,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        totalRevenue: {
          $sum: "$totalAmount",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((month, index) => {
    const found = sales.find(
      (item) => item._id.month === index + 1
    );

    return {
      month,
      revenue: found?.totalRevenue ?? 0,
      orders: found?.totalOrders ?? 0,
    };
  });

  const totalRevenue = monthlyData.reduce(
    (sum, month) => sum + month.revenue,
    0
  );

  const totalOrders = monthlyData.reduce(
    (sum, month) => sum + month.orders,
    0
  );

  const analytics = {
    year,
    totalRevenue,
    totalOrders,
    monthlyData,
  };

  await setCache(cacheKey, analytics, 600);

  return res.status(200).json({
    success: true,
    cached: false,
    data: analytics,
  });
};

export const getSellerOrderById = async (req: Request, res: Response) => {
  const sellerId = req.user.userId;
  const { orderId } = req.params;

  const cacheKey =
    SELLER_ORDER_CACHE_KEYS.SELLER_ORDER_DETAIL(orderId as string, sellerId);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  const order = await OrderModel.findOne(
    {
      _id: orderId,
      "items.sellerId": sellerId,
    },
    {
      orderNumber: 1,
      orderStatus: 1,
      createdAt: 1,
      items: 1,
      shippingAddress: 1,
    }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const sellerItems = order.items.filter(
    (item) => item.sellerId.toString() === sellerId
  );

  const response = {
    orderId: order._id,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    shippingAddress: order.shippingAddress,
    items: sellerItems,
    createdAt: order.createdAt,
  };

  await setCache(cacheKey, response, 300);

  res.json({ success: true, cached: false, data: response });
};

export const updateSellerItemStatus = async (req: Request, res: Response) => {
  const sellerId = req.user.userId;
  const { orderId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId as string)) {
    return res.status(400).json({
      message: "Invaild Order Id",
      success: false
    })
  }

  const order = await OrderModel.findOne({
    _id: orderId,
    "items.sellerId": sellerId,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.items.forEach((item) => {
    if (item.sellerId.toString() === sellerId) {
      item.status = status;
    }
  });
  order.orderStatus = status;

  await order.save();

  await deleteCache(`orders:seller:${sellerId}:*`);
  await deleteCache(`order:${orderId}:seller:${sellerId}`);
  await deleteCache(`order:${orderId}:user:*`);

  res.json({
    success: true,
    message: "Item status updated successfully",
  });
};

export const cancelSellerItem = async (req: Request, res: Response) => {
  const sellerId = req.user.userId;
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await OrderModel.findOne({
    _id: orderId,
    "items.sellerId": sellerId,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.items.forEach((item) => {
    if (item.sellerId.toString() === sellerId) {
      if (
        ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(item.status)
      ) {
        throw new Error("Item cannot be cancelled");
      }
      item.status = OrderStatus.CANCELLED;
    }
  });

  order.cancelledBy = "SELLER";
  order.cancelledReason = reason;

  await order.save();

  await deleteCache(`orders:seller:${sellerId}:*`);
  await deleteCache(`order:${orderId}:seller:${sellerId}`);
  await deleteCache(`order:${orderId}:user:*`);

  res.json({
    success: true,
    message: "Seller item cancelled successfully",
  });
};