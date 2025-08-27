import { z } from "zod";
import validator from "validator"

export const loginSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
    name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address")
});

export const verifyUserSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

export const verifyUserIdSchema = z.object({
  userId: z.string().refine(
    (val) => validator.isMongoId(val),
    { message: "Invalid userId" }
  ),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine(data => data.password === data.confirm, {
  message: "Passwords do not match"
});

export const tokenSchema = z.object({
  token:  z.string({ message: "Please also provide reset token" })
    .min(64, { message: "The Reset token you provided is incorrect." })
    .max(64, { message: "The Reset token you provided is incorrect." }),
})