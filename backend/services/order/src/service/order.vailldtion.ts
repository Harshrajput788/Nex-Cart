import Joi from "joi";
import mongoose from "mongoose";
import { OrderStatus,PaymentMethod } from "../model/order.js";


const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

const orderItemSchema = Joi.object({
  productId: objectId.required(),
  variantId: objectId.required(),
  sellerId: objectId.required(),

  name: Joi.string().min(2).max(200).required(),
  sku: Joi.string().min(3).max(50).required(),

  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  totalPrice: Joi.number().positive().required(),

}).required();


const shippingAddressSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),

  addressLine1: Joi.string().min(5).max(200).required(),
  addressLine2: Joi.string().allow("", null),

  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
}).required();


export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),

  totalAmount: Joi.number().positive().required(),

  payment: Joi.object({
    method: Joi.string()
      .valid(...Object.values(PaymentMethod))
      .required(),
  }).required(),

  shippingAddress: shippingAddressSchema,
});

export const cancelOrderSchema = Joi.object({
  reason: Joi.string().min(5).max(300).required(),
});


export const updateSellerItemStatusSchema = Joi.object({
  status: Joi.string()
    .valid("CONFIRMED", "SHIPPED", "DELIVERED")
    .required(),
});



export const updateOrderStatusAdminSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});



export const refundOrderSchema = Joi.object({
  refundAmount: Joi.number().positive().required(),
  reason: Joi.string().min(5).max(300).required(),
});


export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});