import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import userModel from "@/models/user.models.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mockingoose from "mockingoose";

vi.mock("@/utils/jwt.utils.js");

describe("GET /api/v1/user/me", () => {
  it("should return user details for authenticated user", async () => {
    const mockUser = { _id: "u1", email: "test@test.com", name: "John" };
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: "u1" } as any);
    mockingoose(userModel).toReturn(mockUser, "findOne");

    const response = await request(app).get("/api/v1/user/me").set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@test.com");
  });
});
