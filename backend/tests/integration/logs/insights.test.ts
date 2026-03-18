import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app.js";
import logsModels from "@/models/logs.models.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import redis from "@/config/redis.config.js";
import mockingoose from "mockingoose";

vi.mock("@/utils/jwt.utils.js");
vi.mock("@/config/redis.config.js");

describe("GET /api/logs/insights", () => {
  const validUserId = "507f1f77bcf86cd799439011";

  beforeEach(() => {
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: validUserId } as any);
  });

  it("should return cached insights if available", async () => {
    const mockInsights = { totalExecutions: 10, successRate: 100 };
    vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockInsights));

    const response = await request(app).get("/api/logs/insights").set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockInsights);
  });

  it("should calculate insights if not cached", async () => {
    vi.mocked(redis.get).mockResolvedValue(null);
    const mockInsights = [
      {
        _id: "2023-01-01T00:00:00.000Z",
        counts: [
          { status: "success", count: 2 },
          { status: "failed", count: 1 },
        ],
      },
    ];
    mockingoose(logsModels).toReturn(mockInsights, "aggregate");

    const response = await request(app).get("/api/logs/insights").set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockInsights);
    expect(redis.set).toHaveBeenCalled();
  });
});
