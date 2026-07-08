import type { Request, Response } from "express"
import OrderModel, { PaymentStatus, OrderStatus } from "../../../model/order.js";
import { ADMIN_ORDER_CACHE_KEYS } from "../../../util/rediskey.js";
import { getCache, setCache, deleteCache } from "../../../service/redis.service.js";

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const status = req.query.status as string | undefined;
  const skip = (page - 1) * limit;

  const cacheKey = ADMIN_ORDER_CACHE_KEYS.ALL_ORDERS(page, limit, status);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, ...cached });
  }

  const filter: any = { isDeleted: false };
  if (status) filter.orderStatus = status;

  const [orders, total] = await Promise.all([OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit), OrderModel.countDocuments(filter),]);


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

export const getOrderByIdAdmin = async (req: Request, res: Response) => {
  const { orderNumber } = req.params;

  const cacheKey = ADMIN_ORDER_CACHE_KEYS.ORDER_DETAIL(orderNumber as string);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  const order = await OrderModel.findOne({
    orderNumber: orderNumber as string,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  await setCache(cacheKey, order, 300);

  res.json({ success: true, cached: false, data: order });
};


export const updateOrderStatusAdmin = async (
  req: Request,
  res: Response
) => {
  const orderNumber = req.params.orderNumber as string;
  const { status } = req.body;

  if (!Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }
  const order = await OrderModel.findOneAndUpdate(
    { orderNumber },
    { $set: { orderStatus: status } }
  );
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.items.forEach((item) => {
      item.status = status;
    });
  order.orderStatus = status;
  await order.save();

  await deleteCache("orders:*");
  await deleteCache(`order:${orderNumber}:*`);

  res.json({
    success: true,
    message: "Order status updated by admin",
  });
};


export const cancelOrderAdmin = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelledBy = "ADMIN";
  order.cancelledReason = reason;

  await order.save();

  await deleteCache("orders:*");
  await deleteCache(`order:${orderId}:*`);

  res.json({
    success: true,
    message: "Order cancelled by admin",
  });
};


export const refundOrderAdmin = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { refundAmount, reason } = req.body;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!order.payment || order.payment.status !== PaymentStatus.PAID) {
    return res
      .status(400)
      .json({ message: "Order not eligible for refund" });
  }

  order.payment.status = PaymentStatus.REFUNDED;
  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelledBy = "ADMIN";
  order.cancelledReason = reason;

  await order.save();

  await deleteCache("orders:*");
  await deleteCache(`order:${orderId}:*`);

  res.json({
    success: true,
    message: "Order refunded successfully",
    refundAmount,
  });
};


export const getOrderAnalyticsAdmin = async (req: Request, res: Response) => {
  const cacheKey = "orders:admin:analytics";

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  const stats = await OrderModel.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  await setCache(cacheKey, stats, 600);

  res.json({
    success: true,
    cached: false,
    data: stats,
  });
};

export const getMonthlySalesAnalytics = async (req: Request,res: Response) => {
  const year =
    Number(req.query.year) || new Date().getFullYear();

  const cacheKey = `orders:monthly-sales:${year}`;

  const cached = await getCache(cacheKey);

  if (cached) {
    return res.status(200).json({
      success: true,
      cached: true,
      data: cached,
    });
  }

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const sales = await OrderModel.aggregate([
    {
      $match: {
        isDeleted: false,
        orderStatus: "DELIVERED",
        "payment.status": "PAID",
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
}