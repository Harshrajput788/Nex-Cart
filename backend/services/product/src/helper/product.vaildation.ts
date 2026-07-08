import Joi from "joi";
import type { Request, Response, NextFunction } from "express";


const objectId = Joi.string().hex().length(24);

const imagesSchema = Joi.array().items(
  Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required()
  })
);


export const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  description: Joi.string()
    .trim()
    .max(5000)
    .optional(),

  category: objectId.required(),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional(),

  price: Joi.number()
    .positive()
    .precision(2)
    .required(),

  salePrice: Joi.number()
    .positive()
    .precision(2)
    .less(Joi.ref("price"))
    .optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  sku: Joi.string()
    .trim()
    .max(100)
    .required(),

  images: imagesSchema.optional(),

  isActive: Joi.boolean().optional(),

  isPublished: Joi.boolean().optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .optional(),

  description: Joi.string()
    .trim()
    .max(5000)
    .optional(),

    shortDescription: Joi.string()
    .trim()
    .max(30)
    .optional(),

  category:Joi.string().hex().length(24).optional(),

  price: Joi.number()
    .positive()
    .precision(2)
    .optional(),

  salePrice: Joi.number()
    .positive()
    .precision(2)
    .when("price", {
      is: Joi.exist(),
      then: Joi.number().less(Joi.ref("price")),
      otherwise: Joi.optional()
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional(),

}).min(1);

export const updateProductStockSchema = Joi.object({
  stock: Joi.number().integer().min(0).required(),

  operation: Joi.string()
    .valid("set", "increment", "decrement")
    .default("set"),
});

