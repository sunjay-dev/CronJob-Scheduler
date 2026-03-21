import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import userModel from "@/models/user.models.js";
import redis from "@/config/redis.config.js";
import { queueEmail } from "@/utils/qstashEmail.utils.js";
import mockingoose from "mockingoose";

vi.mock("@/config/redis.config.js");
vi.mock("@/utils/qstashEmail.utils.js");

describe("POST /api/v1/user/auth/register", () => {
  const validUserId = "507f1f77bcf86cd799439011";

  it("should return 400 for invalid request body", async () => {
    const response = await request(app).post("/api/v1/user/auth/register").send({
      name: "valid name",
      email: "not-an-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Invalid email/i);
  });

  it("should return 400 if user with email already exists (local provider)", async () => {
    const mockUser = {
      _id: validUserId,
      email: "test@example.com",
      authProvider: "local",
    };

    mockingoose(userModel).toReturn(mockUser, "findOne");

    const response = await request(app).post("/api/v1/user/auth/register").send({
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/exists/i);
  });

  it("should create user and return 200 with success message", async () => {
    mockingoose(userModel).toReturn(null, "findOne");

    const newUser = { _id: validUserId, email: "test@example.com", name: "John Doe" };
    vi.spyOn(userModel, "create").mockResolvedValue(newUser as unknown as never);

    const response = await request(app).post("/api/v1/user/auth/register").send({
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/verify/i);
    expect(response.body.id).toBe(validUserId);

    expect(queueEmail).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalled();
  });
});
