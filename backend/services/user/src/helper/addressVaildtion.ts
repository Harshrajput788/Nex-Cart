import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const addressBaseSchema = {


  addressLine1: Joi.string().max(255).trim(),

  addressLine2: Joi.string().max(255).trim().allow("", null),

  landmark: Joi.string().max(150).trim().allow("", null),

  city: Joi.string().trim(),

  state: Joi.string().trim(),

  postalCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .message("Invalid postal code"),

  country: Joi.string().trim(),

  isDefault: Joi.boolean()
};

export const createAddressSchema = Joi.object({
  addressLine1: addressBaseSchema.addressLine1.required(),
  addressLine2: addressBaseSchema.addressLine2,
  landmark: addressBaseSchema.landmark,
  city: addressBaseSchema.city.required(),
  state: addressBaseSchema.state.required(),
  postalCode: addressBaseSchema.postalCode.required(),
  country: addressBaseSchema.country.default("India"),
  isDefault: addressBaseSchema.isDefault.default(false)
});

export const updateAddressSchema = Joi.object({
  addressLine1: addressBaseSchema.addressLine1,
  addressLine2: addressBaseSchema.addressLine2,
  landmark: addressBaseSchema.landmark,
  city: addressBaseSchema.city,
  state: addressBaseSchema.state,
  postalCode: addressBaseSchema.postalCode,
  country: addressBaseSchema.country,
  isDefault: addressBaseSchema.isDefault
}).min(1);