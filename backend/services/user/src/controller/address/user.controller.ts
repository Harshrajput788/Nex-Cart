import type { Request, Response } from "express";
import AddressModel from "../../model/address.js";
import redis from "../../util/redis.js";
import mongoose from "mongoose";

export const createAddress = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const data = req.body;

  if (data.isDefault) {
    await AddressModel.updateMany(
      { userId, isDeleted: false },
      { $set: { isDefault: false } }
    );
  }

  const existingAddress = await AddressModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false
  }).lean();

  if (existingAddress) {
    return res.status(400).json({
      success: false,
      message: "Address already exists for this user"
    });
  }

  const newAddress = new AddressModel({ ...data, userId });
  await newAddress.save();

  await redis.del(`user:address:${userId}`);

  return res.status(201).json({
    success: true,
    message: "Address created successfully",
    data: newAddress
  });
};

export const getAddress = async (req: Request, res: Response) => {
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID"
    });
  }

  const cacheKey = `user:address:${userId}`;

  const cachedAddress = await redis.get(cacheKey);
  if (cachedAddress) {
    return res.status(200).json({
      success: true,
      data: JSON.parse(cachedAddress),
      source: "cache"
    });
  }

  const address = await AddressModel.findOne({
    userId,
    isDeleted: false
  }).lean();

  if (!address) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  await redis.set(
    cacheKey,
    JSON.stringify(address),
    "EX",
    5 * 60
  );

  return res.status(200).json({
    success: true,
    data: address,
    source: "db"
  });
};

export const updateAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid address ID"
    });
  }

  if (updateData.isDefault) {
    await AddressModel.updateMany(
      { userId, isDeleted: false },
      { $set: { isDefault: false } }
    );
  }

  const updatedAddress = await AddressModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id as string), userId, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedAddress) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  await redis.del(`user:address:${userId}`);

  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: updatedAddress
  });
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid address ID"
    });
  }

  const deletedAddress = await AddressModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id as string), userId, isDeleted: false },
    { isDeleted: true, isDefault: false },
    { new: true }
  );

  if (!deletedAddress) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  await redis.del(`user:address:${userId}`);

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully"
  });
};