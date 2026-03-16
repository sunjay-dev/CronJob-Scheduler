import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { jobIdSchema, jobStatusSchema, jobSchema } from "../../src/schemas/job.schema.js";

describe("Job Schemas", () => {
  const validId = new mongoose.Types.ObjectId().toString();

  describe("jobIdSchema", () => {
    it("should validate a valid MongoDB ObjectId", () => {
      const result = jobIdSchema.safeParse({ jobId: validId });
      expect(result.success).toBe(true);
    });

    it("should reject an invalid ObjectId", () => {
      const result = jobIdSchema.safeParse({ jobId: "invalid-id" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("jobStatusSchema", () => {
    it("should validate with valid jobId and status", () => {
      const result = jobStatusSchema.safeParse({ jobId: validId, status: true });
      expect(result.success).toBe(true);
    });

    it("should reject missing status", () => {
      const result = jobStatusSchema.safeParse({ jobId: validId });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("jobSchema", () => {
    const validJob = {
      name: "Test Job",
      url: "https://example.com/api",
      timezone: "UTC",
      enabled: true,
      method: "POST",
      email: false,
      cron: "*/5 * * * * *",
      body: '{"key":"value"}',
      timeout: 10,
      headers: [{ key: "Authorization", value: "Bearer token" }],
    };

    it("should validate a fully correct job payload", () => {
      const result = jobSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    it("should reject invalid URL", () => {
      const result = jobSchema.safeParse({ ...validJob, url: "not-a-url" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("should reject invalid HTTP method", () => {
      const result = jobSchema.safeParse({ ...validJob, method: "INVALID" });
      expect(result.success).toBe(false);
    });

    it("should reject invalid cron expression", () => {
      const result = jobSchema.safeParse({ ...validJob, cron: "invalid cron" });
      expect(result.success).toBe(false);
    });

    it("should automatically uppercase the method", () => {
      const result = jobSchema.safeParse({ ...validJob, method: "post" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.method).toBe("POST");
      }
    });
  });
});
