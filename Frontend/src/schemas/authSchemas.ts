import { z } from "zod";

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
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine(data => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export const tokenSchema = z.string().refine((token) => {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const decoded = JSON.parse(atob(parts[1]));
    return typeof decoded === "object" && decoded !== null;
  } catch {
    return false;
  }
}, {
  message: "Invalid or tampered token",
});