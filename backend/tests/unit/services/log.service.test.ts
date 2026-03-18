import { describe, it, expect, vi } from "vitest";
import * as logService from "@/services/log.service.js";
import logsModels from "@/models/logs.models.js";
import redis from "@/config/redis.config.js";
import { NotFoundError } from "@/utils/appError.utils.js";
import mockingoose from "mockingoose";

vi.mock("@/config/redis.config.js");

describe("Log Service", () => {
  const validUserId = "507f1f77bcf86cd799439011";
  const validLogId = "507f191e810c19729de860ea";
  const validJobId = "507f1f77bcf86cd799439012";

  describe("fetchLogs", () => {
    it("should fetch logs with pagination", async () => {
      const mockLogs = [{ message: "Log 1" }, { message: "Log 2" }];
      mockingoose(logsModels).toReturn(mockLogs, "find");
      mockingoose(logsModels).toReturn(5, "countDocuments");

      const result = await logService.fetchLogs({ userId: validUserId, page: 1, limit: 10, jobId: validJobId });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(5);
    });
  });

  describe("fetchLogById", () => {
    it("should throw NotFoundError if log not found", async () => {
      mockingoose(logsModels).toReturn(null, "findOne");

      await expect(logService.fetchLogById(validLogId, validUserId)).rejects.toThrow(NotFoundError);
    });

    it("should return log by id", async () => {
      const mockLog = { _id: validLogId, message: "test" };
      mockingoose(logsModels).toReturn(mockLog, "findOne");

      const result = await logService.fetchLogById(validLogId, validUserId);

      expect(result._id.toString()).toBe(validLogId);
    });
  });

  describe("fetchLogInsights", () => {
    it("should return cached insights if available", async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify({ some: "data" }));

      const result = await logService.fetchLogInsights(validUserId);

      expect(result).toEqual({ some: "data" });
    });

    it("should calculate and cache insights if not cached", async () => {
      vi.mocked(redis.get).mockResolvedValue(null);
      const mockInsights = [{ _id: "2023-01-01T00:00:00.000Z", counts: [{ status: 200, count: 5 }] }];
      mockingoose(logsModels).toReturn(mockInsights, "aggregate");

      const result = await logService.fetchLogInsights(validUserId);

      expect(result).toEqual(mockInsights);
      expect(redis.set).toHaveBeenCalled();
    });
  });
});
