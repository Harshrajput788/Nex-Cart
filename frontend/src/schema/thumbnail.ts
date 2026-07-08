import { z } from "zod";

export const createThumbnailSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(2, "Heading must be at least 2 characters")
    .max(100, "Heading cannot exceed 100 characters")
    .optional(),

  paragraph: z
    .string()
    .trim()
    .max(200, "Paragraph cannot exceed 200 characters")
    .optional(),

  type: z.enum([
    "PRODUCT",
    "CATEGORY",
    "BANNER",
    "COLLECTION",
  ]),


  color: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Invalid hex color code"
    ),

  categoryId: z
    .string()
    .min(1, "Category ID is required"),

  thumbnail: z.any().optional(),
});

export type CreateThumbnailInput = z.infer<
  typeof createThumbnailSchema
>;