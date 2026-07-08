import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must include one uppercase letter")
    .regex(/[0-9]/, "Must include one number"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
})

export const signinSchema = z.object({
  email: z.string().min(2, "Name is to short"),
  password: z.string(),
})

export const sendForgetEmail = z.object({
  email: z.string().min(2, "Name is to short"),
})

export const verifictionCode = z.object({
  code:
    z.string().length(6, "Verification code must be exactly 6 digits").regex(/^\d{6}$/, "Code must contain only numbers")
})

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address"),

    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d+$/, "Verification code must contain only numbers"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must not exceed 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const upadteProfileSchema = z.object({
  fullName: z.string().min(2, "Name is too short").optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional(),
}).refine((data) => data.fullName || data.phone, {
  message: "At least one field (fullName or phone) is required",
})

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>
export type VerifictionCodeFormData = z.infer<typeof verifictionCode>;
export type SendForgetFormData = z.infer<typeof sendForgetEmail>;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type updateProfileInput = z.infer<typeof upadteProfileSchema>;