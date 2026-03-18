import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { jobLogsParamsSchema, LogIdSchema } from "@/schemas/log.schema.js";

describe("Log Schemas", () => {
  const validId = new mongoose.Types.ObjectId().toString();

  describe("jobLogsParamsSchema", () => {
    it("should validate a valid jobId", () => {
      const result = jobLogsParamsSchema.safeParse({ jobId: validId });
      expect(result.success).toBe(true);
    });

    it("should reject an invalid jobId", () => {
      const result = jobLogsParamsSchema.safeParse({ jobId: "invalid-id" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("LogIdSchema", () => {
    it("should validate a valid logId", () => {
      const result = LogIdSchema.safeParse({ logId: validId });
      expect(result.success).toBe(true);
    });

    it("should reject an invalid logId", () => {
      const result = LogIdSchema.safeParse({ logId: "invalid-id" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
