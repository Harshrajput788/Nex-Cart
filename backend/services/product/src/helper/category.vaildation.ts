import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  parent: Joi.string()
    .hex()
    .length(24)
    .allow(null)
    .optional(),

  isActive: Joi.boolean()
    .optional(),

  sortOrder: Joi.string()
    .optional(),

  metaTitle: Joi.string()
    .trim()
    .max(70)
    .optional(),

  metaDescription: Joi.string()
    .trim()
    .max(160)
    .optional()
});


export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  isActive: Joi.boolean()
    .optional(),

  sortOrder: Joi.number()
    .integer()
    .min(0)
    .optional(),

  metaTitle: Joi.string()
    .trim()
    .max(70)
    .optional(),

  metaDescription: Joi.string()
    .trim()
    .max(160)
    .optional()
})
  .min(1);