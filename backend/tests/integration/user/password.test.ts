import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import userModel from "@/models/user.models.js";
import redis from "@/config/redis.config.js";
import mockingoose from "mockingoose";
import { hashPassword } from "@/utils/hash.utils.js";

vi.mock("@/config/redis.config.js");
vi.mock("@/utils/hash.utils.js");

describe("Password Management APIs", () => {
  describe("POST /api/user/forgot-password", () => {
    it("should return 200 and send email if user exists", async () => {
      const mockUser = { _id: "u1", email: "test@test.com", name: "John", authProvider: "local" };
      mockingoose(userModel).toReturn(mockUser, "findOne");
      vi.mocked(redis.get).mockResolvedValue(null);

      const response = await request(app).post("/api/user/forgot-password").send({ email: "test@test.com" });

      expect(response.body.message.length).toBeGreaterThan(0);
      expect(response.body.message).toMatch(/email/i);
    });
  });

  describe("POST /api/user/reset-password", () => {
    it("should return 200 if password reset is successful", async () => {
      vi.mocked(redis.get).mockResolvedValue("test@test.com");
      vi.mocked(hashPassword).mockResolvedValue("new-hash");
      mockingoose(userModel).toReturn({ _id: "u1" }, "findOneAndUpdate");

      const response = await request(app)
        .post("/api/user/reset-password")
        .send({
          token: "a".repeat(64),
          password: "new-password123",
        });

      expect(response.status).toBe(200);
      expect(response.body.message.length).toBeGreaterThan(0);
    });
  });
});
