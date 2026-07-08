// middlewares/validateRequest.ts
import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

interface ValidationSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

export const validateRequest =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validations = [];

    if (schemas.body) {
      validations.push(schemas.body.validateAsync(req.body));
    }

    if (schemas.params) {
      validations.push(schemas.params.validateAsync(req.params));
    }

    if (schemas.query) {
      validations.push(schemas.query.validateAsync(req.query));
    }

    Promise.all(validations)
      .then(() => next())
      .catch((error) =>
        res.status(400).json({
          success: false,
          message: error.details?.[0]?.message || "Invalid request data",
        })
      );
  };