import UserModel from "../../../model/user.js";
import type { Request,Response } from "express";
import mongoose from "mongoose";
import redis from "../../../util/redis.js";

export const getAdminDashboard = async (req: Request,res: Response) => {
  const cacheKey = "admin:dashboard";

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      data: JSON.parse(cached),
      source: "cache"
    });
  }

  const [totalUsers, totalSellers] = await Promise.all([
    UserModel.countDocuments({ role: "user", isDeleted: false }),
    UserModel.countDocuments({ role: "seller", isDeleted: false })
  ]);

  const data = { totalUsers, totalSellers };

  await redis.set(cacheKey, JSON.stringify(data), "EX", 60);

  return res.status(200).json({
    success: true,
    data,
    source: "db"
  });
};

export const getAllSellers = async (req: Request,res: Response) => {
  const cacheKey = "admin:sellers";

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json({
      success: true,
      count: JSON.parse(cached).length,
      data: JSON.parse(cached),
      source: "cache"
    });
  }

  const sellers = await UserModel.find({
    role: "seller",
  })
    .select("-password")
    .lean();

  await redis.set(
    cacheKey,
    JSON.stringify(sellers),
    "EX",
    5 * 60
  );

  return res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers,
    source: "db"
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `admin:users:list:page:${page}:limit:${limit}`;

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      ...JSON.parse(cachedData),
      source: "cache"
    });
  }

  const [users, total] = await Promise.all([
    UserModel.find({ role: "USER" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments({ role: "USER" })
  ]);

  const responseData = {
    page,
    total,
    users
  };

  await redis.set(
    cacheKey,
    JSON.stringify(responseData),
    "EX",
    2 * 60
  );

  return res.status(200).json({
    success: true,
    ...responseData,
    source: "db"
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const cacheKey = `admin:user:${userId}`;

  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    return res.status(200).json({
      success: true,
      data: JSON.parse(cachedUser),
      source: "cache"
    });
  }

  const user = await UserModel.findOne({
    _id: new mongoose.Types.ObjectId(userId as string),
  })
    .select("-password")
    .lean();

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await redis.set(cacheKey, JSON.stringify(user), "EX", 3 * 60);

  return res.status(200).json({
    success: true,
    data: user,
    source: "db"
  });
};

export const updateUserByAdmin = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await UserModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(userId as string) },
    updateData,
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await redis.del(`admin:user:${userId}`);

  const listKeys = await redis.keys("admin:users:list:*");
  if (listKeys.length) await redis.del(listKeys);

  await redis.del("admin:dashboard");
  await redis.del("admin:sellers");

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
};

export const deleteUserByAdmin = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await redis.del(`admin:user:${userId}`);

  const listKeys = await redis.keys("admin:users:list:*");
  if (listKeys.length) await redis.del(listKeys);

  await redis.del("admin:dashboard");
  await redis.del("admin:sellers");

  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
};



