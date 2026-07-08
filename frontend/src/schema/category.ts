import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name is too long"),

  description: z
    .string()
    .max(500, "Description is too long")
    .optional(),

  parent: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .nullable()
      .optional()
  ),

  sortOrder: z.string(),

  metaTitle: z
    .string()
    .max(100, "Meta title is too long")
    .optional(),

  metaDescription: z
    .string()
    .max(255, "Meta description is too long")
    .optional(),

});

export type CategoryFormData = z.infer<typeof categorySchema>;