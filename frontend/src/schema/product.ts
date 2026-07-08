import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(255),
    slug: z.string().min(1, 'Slug is required').max(255),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().max(500).optional(),
    category: z.string().min(1, 'Category is required'),
    price: z.number().positive('Price must be greater than 0'),
    salePrice: z.number().positive('Sale price must be greater than 0').optional(),
    costPrice: z.number().positive('Cost price must be greater than 0').optional(),
    sku: z.string().min(1, 'SKU is required').max(100),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK']),
    images: z.array(z.instanceof(File)).min(1),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
});

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const updateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(150, "Name must be at most 150 characters")
            .optional(),

        description: z
            .string()
            .trim()
            .max(5000, "Description must be at most 5000 characters")
            .optional(),

        shortDescription: z
            .string()
            .trim()
            .max(30, "Short description must be at most 30 characters")
            .optional(),

        category: objectId.optional(),

        price: z
            .number()
            .positive("Price must be positive")
            .optional(),

        salePrice: z
            .number()
            .positive("Sale price must be positive")
            .optional(),

        stock: z
            .number()
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative")
            .optional(),
    })
    .refine(
        (data) =>
            data.salePrice === undefined ||
            data.price === undefined ||
            data.salePrice < data.price,
        {
            message: "Sale price must be less than price",
            path: ["salePrice"],
        }
    )
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be updated",
    });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;