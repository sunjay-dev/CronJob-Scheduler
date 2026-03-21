import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import userModel from "@/models/user.models.js";
import redis from "@/config/redis.config.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mockingoose from "mockingoose";

vi.mock("@/config/redis.config.js");
vi.mock("@/utils/jwt.utils.js");

describe("POST /api/v1/user/auth/verify-email", () => {
  const validUserId = "507f1f77bcf86cd799439011";

  it("should return 400 for missing otp", async () => {
    const response = await request(app).post("/api/v1/user/auth/verify-email").send({ userId: validUserId });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/expected string, received undefined/i);
  });

  it("should return 400 if otp is expired or invalid", async () => {
    vi.mocked(redis.mget).mockResolvedValue([null, null]);
    mockingoose(userModel).toReturn({ _id: validUserId }, "findOne");

    const response = await request(app).post("/api/v1/user/auth/verify-email").send({
      userId: validUserId,
      otp: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/expired/i);
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(redis.mget).mockResolvedValue(["123456", "0"]);
    mockingoose(userModel).toReturn(null, "findOne");

    const response = await request(app).post("/api/v1/user/auth/verify-email").send({
      userId: validUserId,
      otp: "123456",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it("should verify successfully and return cookie", async () => {
    const mockUser = {
      _id: validUserId,
      id: validUserId,
      email: "test@test.com",
      verified: false,
      save: vi.fn().mockResolvedValue(true),
    };
    vi.mocked(redis.mget).mockResolvedValue(["123456", "0"]);
    vi.spyOn(userModel, "findOne").mockResolvedValue(mockUser as any);
    vi.mocked(jwtUtils.signToken).mockReturnValue("fake-token");

    const response = await request(app).post("/api/v1/user/auth/verify-email").send({
      userId: validUserId,
      otp: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/verified/i);
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
