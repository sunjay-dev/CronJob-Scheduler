import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address")
})

export const resetPasswordSchema = z.object({
  token: z.string({ message: "Reset token is required" })
    .refine((val) => val.split(".").length === 3, {
      message: "Invalid reset token format",
    }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const verifyUserSchema = z.object({
  token: z.string({ message: "Verification token is required" })
    .min(64, { message: "Invalid verification token" })
    .max(64, { message: "Invalid verification token" }),
});

export const changeUserDetailsSchema = z.object({
  name: z.string().trim().min(1, "Invalid name").optional(),
  timezone: z.string().trim().min(1, "Invalid timezone").optional(),
  mode: z.enum(["day", "dark"], { message: "Invalid mode (must be 'day' or 'dark')" }).optional(),
  timeFormat24: z.boolean({ message: "Invalid timeFormat24 (must be boolean)" }).optional(),
  emailNotifications: z.boolean({ message: "Invalid emailNotifications (must be boolean)" }).optional(),
  pushAlerts: z.boolean({ message: "Invalid pushAlerts (must be boolean)" }).optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });