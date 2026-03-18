import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app.js";
import logsModels from "@/models/logs.models.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mongoose from "mongoose";
import mockingoose from "mockingoose";

vi.mock("@/utils/jwt.utils.js");

describe("Log Fetching APIs", () => {
  const validUserId = "user-abc-123";

  beforeEach(() => {
    mockingoose.resetAll();
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: validUserId } as any);
  });

  describe("GET /api/logs", () => {
    it("should fetch all user logs with pagination", async () => {
      const mockLogs = [{ message: "Log 1" }, { message: "Log 2" }];
      mockingoose(logsModels).toReturn(mockLogs, "find");
      mockingoose(logsModels).toReturn(15, "countDocuments");

      const response = await request(app).get("/api/logs?page=1&limit=10").set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body.logs).toHaveLength(2);
      expect(response.body.total).toBe(15);
    });
  });

  describe("GET /api/logs/:jobId", () => {
    const validJobId = new mongoose.Types.ObjectId().toString();

    it("should fetch logs for a specific job", async () => {
      const mockLogs = [{ message: "Job Log 1" }];
      mockingoose(logsModels).toReturn(mockLogs, "find");
      mockingoose(logsModels).toReturn(1, "countDocuments");

      const response = await request(app).get(`/api/logs/${validJobId}`).set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body.logs).toHaveLength(1);
    });
  });

  describe("GET /api/logs/id/:logId", () => {
    const validLogId = new mongoose.Types.ObjectId().toString();

    it("should return 404 if log not found", async () => {
      mockingoose(logsModels).toReturn(null, "findOne");

      const response = await request(app).get(`/api/logs/id/${validLogId}`).set("Authorization", "Bearer token");

      expect(response.status).toBe(404);
    });

    it("should return log details if found", async () => {
      const mockLog = { message: "Single Log", _id: validLogId };
      mockingoose(logsModels).toReturn(mockLog, "findOne");

      const response = await request(app).get(`/api/logs/id/${validLogId}`).set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(validLogId);
    });
  });
});
