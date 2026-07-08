import Joi from "joi";

export const createVariantSchema = Joi.object({
    sku: Joi.string().trim().uppercase().min(3).max(50).required(),

    attributes: Joi.object()
        .pattern(Joi.string(), Joi.string())
        .min(1)
        .required(),

    price: Joi.number().min(0).required(),

    salePrice: Joi.number().min(0).max(Joi.ref("price")).optional(),

    stock: Joi.number().integer().min(0).default(0),
});


export const updateVariantSchema = Joi.object({
    sku: Joi.string().trim().uppercase().min(3).max(50).optional(),

    attributes: Joi.object()
        .pattern(Joi.string(), Joi.string())
        .optional(),

    price: Joi.number().min(0).optional(),

    salePrice: Joi.number()
        .min(0)
        .max(Joi.ref("price"))
        .optional(),
})
    .or("sku", "attributes", "price", "salePrice")
    .messages({
        "object.missing": "At least one field must be updated",
    });


export const updateVariantStockSchema = Joi.object({
    stock: Joi.number().integer().min(0).required(),

    operation: Joi.string()
        .valid("set", "increment", "decrement")
        .default("set"),
});


export const updateVariantStatusSchema = Joi.object({
    isActive: Joi.boolean().required(),
});