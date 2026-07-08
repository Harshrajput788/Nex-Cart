import type { Request, Response } from "express";
import mongoose from "mongoose";
import { CART_KEY } from "../../../util/redis.key.js";
import CartModel from "../../../model/cart.js";
import redis from "../../../config/redis.js";

export const getMyCart = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const cacheKey = CART_KEY(userId);

  const cachedCart = await redis.get(cacheKey);
  if (cachedCart) {
    try {
      return res.json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedCart),
      });
    } catch {
      await redis.del(cacheKey);
    }
  }

  let cart = await CartModel.findOne({
    userId,
    isDeleted: false,
    isActive: true,
  }).lean();

  if (!cart) {
    const newCart = await CartModel.create({
      userId,
      items: [],
      isActive: true,
      isDeleted: false,
    });

    cart = newCart.toObject();
  }

  await redis.setex(cacheKey, 300, JSON.stringify(cart));

  res.json({
    success: true,
    source: "db",
    data: cart,
  });
};

export const addItemToCart = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { productId, variantId, quantity = 1, priceSnapshot, sellerId ,name,sku,totalPrice} = req.body;


  if (!variantId) {
    return res.status(400).json({
      message: "variantId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(sellerId) ||
    !mongoose.Types.ObjectId.isValid(variantId)) {
    return res.status(400).json({ message: "Invalid MongoDB ID" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const itemFilter: any = {
    userId,
    "items.productId": new mongoose.Types.ObjectId(productId as string),
    "items.variantId": new mongoose.Types.ObjectId(variantId as string),
  };

  const updated = await CartModel.findOneAndUpdate(
    itemFilter,
    {
      $inc: { "items.$.quantity": quantity },
    },
    { new: true }
  );

  if (!updated) {
    await CartModel.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            productId: new mongoose.Types.ObjectId(productId as string),
            variantId: new mongoose.Types.ObjectId(variantId as string),
            sellerId,
            quantity,
            priceSnapshot,
            name,
            sku,
            totalPrice
          },
        },
      },
      { upsert: true, new: true }
    );
  }

  const cart = await CartModel.findOne({ userId });
  cart?.recalculate();
  await cart?.save();

  await redis.del(CART_KEY(userId));

  res.status(201).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { itemId } = req.params;
  const { action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
    return res.status(400).json({ message: "Invalid cart item id" });
  }

  if (!["inc", "dec"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const step = action === "inc" ? 1 : -1;

  let cart = await CartModel.findOneAndUpdate(
    {
      userId,
      "items._id": new mongoose.Types.ObjectId(itemId as string),
    },
    {
      $inc: { "items.$.quantity": step },
    },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cart.items = cart.items.filter(item => item.quantity > 0);

  cart.recalculate();
  await cart.save();

  await redis.del(CART_KEY(userId));

  res.json({
    success: true,
    message: `Item ${action === "inc" ? "increased" : "decreased"} successfully`,
    data: cart,
  });
};


export const removeCartItem = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
    return res.status(400).json({ message: "Invalid cart item id" });
  }

  const cartExists = await CartModel.findOne({
    userId,
    "items._id": new mongoose.Types.ObjectId(itemId as string),
  });

  if (!cartExists) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  const cart = await CartModel.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: { _id: new mongoose.Types.ObjectId(itemId as string) },
      },
    },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.recalculate();
  await cart.save();

  await redis.del(CART_KEY(userId));

  res.json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.user;

  const cart = await CartModel.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.recalculate();
  await cart.save();

  await redis.del(CART_KEY(userId));

  res.json({
    success: true,
    message: "Cart cleared",
    data: cart,
  });
};