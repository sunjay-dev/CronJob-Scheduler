import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
  verifyUserIdSchema,
  changeUserDetailsSchema,
} from "@/schemas/user.schema.js";

describe("User Schemas", () => {
  const validId = new mongoose.Types.ObjectId().toString();

  describe("loginSchema", () => {
    it("should validate correct login details", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("registerSchema", () => {
    it("should validate correct registration details", () => {
      const result = registerSchema.safeParse({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject name that is too short", () => {
      const result = registerSchema.safeParse({
        name: "A",
        email: "test@example.com",
        password: "password",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate correct email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("resetPasswordSchema", () => {
    it("should validate correct token and password", () => {
      const token = "a".repeat(64);
      const result = resetPasswordSchema.safeParse({
        token,
        password: "newpassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject token not equal to 64 chars", () => {
      const result = resetPasswordSchema.safeParse({
        token: "short-token",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("verifyUserSchema", () => {
    it("should validate correct OTP and userId", () => {
      const result = verifyUserSchema.safeParse({
        otp: "123456",
        userId: validId,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid OTP", () => {
      const result = verifyUserSchema.safeParse({
        otp: "12345",
        userId: validId,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("verifyUserIdSchema", () => {
    it("should validate valid userId", () => {
      const result = verifyUserIdSchema.safeParse({ userId: validId });
      expect(result.success).toBe(true);
    });
  });

  describe("changeUserDetailsSchema", () => {
    it("should validate if at least one field is provided", () => {
      const result = changeUserDetailsSchema.safeParse({ mode: "dark" });
      expect(result.success).toBe(true);
    });

    it("should reject if no fields are provided (empty object)", () => {
      const result = changeUserDetailsSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject invalid mode", () => {
      const result = changeUserDetailsSchema.safeParse({
        mode: "invalid-mode",
      });
      expect(result.success).toBe(false);
    });
  });
});
