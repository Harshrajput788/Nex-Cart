import type { Request, Response, NextFunction } from "express";
import Joi, { type ObjectSchema } from "joi";

export const validateRequest =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,       
      stripUnknown: true     
    });

    if (error) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message
        }))
      });
    }

    req.body = value;
    next();
  };