import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(8)
    .max(32)
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .required()
});

export const verifyEmailSchema = Joi.object({
  code: Joi.alternatives()
    .try(
      Joi.string().length(6).pattern(/^[0-9]+$/),
      Joi.number().integer().min(100000).max(999999)
    )
    .required()
    .messages({
      "any.required": "Verification code is required",
      "string.length": "Verification code must be 6 digits",
      "string.pattern.base": "Verification code must contain only numbers",
      "number.base": "Verification code must be a number"
    })
}).options({ abortEarly: false });

export const sendResetPasswordCodeSchema = Joi.object({
  email:Joi.string().email().lowercase().required()
})


export const resetPasswordSchema = Joi.object({
  email:Joi.string().email().lowercase().required(),
  code: Joi.alternatives()
    .try(
      Joi.string().length(6).pattern(/^[0-9]+$/),
      Joi.number().integer().min(100000).max(999999)
    )
    .required()
    .messages({
      "any.required": "Verification code is required",
      "string.length": "Verification code must be 6 digits",
      "string.pattern.base": "Verification code must contain only numbers",
      "number.base": "Verification code must be a number"
    }),
  newPassword: Joi.string()
    .min(8)
    .max(32)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 32 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number and special character",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

export const changePasswordSchema = Joi.object({
  password:Joi.string().min(8).max(32).required(),
  newPassword: Joi.string()
    .min(8)
    .max(32)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 32 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number and special character",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
})


export const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .messages({
      "string.base": "Full name must be a string",
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must not exceed 50 characters",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit Indian number",
    }),

})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update profile",
  });




export const updateUserByAdminSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .trim(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .message("Invalid phone number"),

  role: Joi.string()
    .valid("USER", "SELLER", "ADMIN"),


  isVerified: Joi.boolean()
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated"
  });
