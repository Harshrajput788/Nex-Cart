import Joi from 'joi'

export const paymentValidation = Joi.object({
     amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than 0",
      "any.required": "Amount is required",
    }),

  recipient: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Recipient must be a string",
      "string.empty": "Recipient cannot be empty",
      "any.required": "Recipient is required",
    }),
})

export const validatePaymentSchema = Joi.object({
  razorpay_order_id: Joi.string()
    .pattern(/^order_/)
    .required()
    .messages({
      "string.pattern.base": "Invalid Razorpay order ID",
      "any.required": "razorpay_order_id is required",
    }),

  razorpay_payment_id: Joi.string()
    .pattern(/^pay_/)
    .required()
    .messages({
      "string.pattern.base": "Invalid Razorpay payment ID",
      "any.required": "razorpay_payment_id is required",
    }),

  razorpay_signature: Joi.string()
    .length(64)
    .required()
    .messages({
      "string.length": "Invalid Razorpay signature",
      "any.required": "razorpay_signature is required",
    }),
});