import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import userModel from "@/models/user.models.js";
import mockingoose from "mockingoose";
import { comparePasswords } from "@/utils/hash.utils.js";

vi.mock("@/utils/hash.utils.js");

describe("POST /api/v1/user/auth/login", () => {
  it("should return 400 for invalid request body", async () => {
    const response = await request(app).post("/api/v1/user/auth/login").send({
      email: "not-an-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should return 401 if user does not exist", async () => {
    mockingoose(userModel).toReturn(null, "findOne");

    const response = await request(app).post("/api/v1/user/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/incorrect/i);
  });

  it("should return 401 if passwords do not match", async () => {
    const mockUser = {
      _id: "fake-id",
      email: "test@example.com",
      password: "hashed_password",
      verified: true,
      authProvider: "local",
    };

    mockingoose(userModel).toReturn(mockUser, "findOne");
    vi.mocked(comparePasswords).mockResolvedValue(false);

    const response = await request(app).post("/api/v1/user/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/incorrect/i);
  });

  it("should return 403 if user is not verified", async () => {
    const mockUser = {
      _id: "fake-id",
      email: "test@example.com",
      password: "hashed_password",
      verified: false,
      authProvider: "local",
    };

    mockingoose(userModel).toReturn(mockUser, "findOne");
    vi.mocked(comparePasswords).mockResolvedValue(true);

    const response = await request(app).post("/api/v1/user/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/verify/i);
  });

  it("should login successfully and return 200 with token cookie", async () => {
    const mockUser = {
      _id: "fake-id",
      email: "test@example.com",
      password: "hashed_password",
      verified: true,
      authProvider: "local",
    };

    mockingoose(userModel).toReturn(mockUser, "findOne");
    vi.mocked(comparePasswords).mockResolvedValue(true);

    const response = await request(app).post("/api/v1/user/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/i);

    const setCookie = response.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie[0]).toMatch(/accessToken=([^;]+)/);
    expect(setCookie[1]).toMatch(/refreshToken=([^;]+)/);
  });
});
