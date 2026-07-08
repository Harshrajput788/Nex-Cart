import Joi from "joi";

const THUMBNAIL_TYPES = [
    "PRODUCT",
    "CATEGORY",
    "BANNER",
    "COLLECTION",
] as const;

export const createThumbnailSchema = Joi.object({
    heading: Joi.string().max(40).optional(),
    paragraph: Joi.string().max(200).optional(),
    type: Joi.string()
        .valid(...THUMBNAIL_TYPES)
        .required()
        .messages({
            "any.only": "Invalid thumbnail type",
            "any.required": "Thumbnail type is required",
        }),
    color:Joi.string().required(),
    categoryId:Joi.string().required(),
}).options({ abortEarly: false });

export const updateThumbnailSchema = Joi.object({
    heading: Joi.string().max(40).optional(),
    paragraph: Joi.string().max(200).optional(),
    type: Joi.string()
        .valid(...THUMBNAIL_TYPES)
        .optional()
        .messages({
            "any.only": "Invalid thumbnail type",
        }),

    isActive: Joi.boolean()
        .optional()
        .messages({
            "boolean.base": "isActive must be true or false",
        }),
})
    .min(1)
    .options({ abortEarly: false });