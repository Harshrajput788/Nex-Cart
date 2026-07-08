import {z} from "zod"


export const addressSchema = z.object({
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    landmark: z.string().optional(),
});

export const addressUpdateSchema = addressSchema.partial();

export type AddressFormData = z.infer<typeof addressSchema>;