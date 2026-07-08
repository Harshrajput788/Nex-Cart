import mongoose from "mongoose";
import UserModel from "../../../model/user.js";
import redis from "../../../util/redis.js";
import type { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "User Id is invalid"
    });
  }

  const cacheKey = `user_profile:${userId}`;

  const cachedUser = await redis.get(cacheKey);

  if (cachedUser) {
    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: JSON.parse(cachedUser),
      source: "cache"
    });
  }

  const user = await UserModel.findById(userId).lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  await redis.set(
    cacheKey,
    JSON.stringify(user),
    "EX",
    5 * 60
  );

  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user,
    source: "db"
  });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "User Id is invalid"
    });
  }

  const allowFields = ["fullName", "phone"];
  const updateFields: Record<string, string> = {};

  for (const field of allowFields) {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update"
    });
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  await redis.del(`user_profile:${userId}`);

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "User Id is invalid"
    });
  }

  await UserModel.findByIdAndDelete(userId);

  await redis.del(`user_profile:${userId}`);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
};