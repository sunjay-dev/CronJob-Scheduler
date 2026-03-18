import { describe, it, expect, vi } from "vitest";
import * as userService from "@/services/user.service.js";
import userModel from "@/models/user.models.js";
import { signToken } from "@/utils/jwt.utils.js";
import { comparePasswords, hashPassword } from "@/utils/hash.utils.js";
import { queueEmail } from "@/utils/qstashEmail.utils.js";
import redis from "@/config/redis.config.js";
import { UnauthorizedError, BadRequestError } from "@/utils/appError.utils.js";
import mockingoose from "mockingoose";
import { generateRandomToken } from "@/utils/crypto.utils.js";

vi.mock("@/utils/qstashEmail.utils.js");
vi.mock("@/utils/jwt.utils.js");
vi.mock("@/utils/hash.utils.js");
vi.mock("@/config/redis.config.js");
vi.mock("@/utils/crypto.utils.js");

describe("User Service", () => {
  const validUserId = "507f1f77bcf86cd799439011";
  const validUserCreds = { email: "t@t.com", password: "p1" };
  const mockUser = {
    _id: validUserId,
    id: validUserId,
    ...validUserCreds,
    verified: true,
    authProvider: "local",
    timezone: "UTC",
  };

  describe("loginUser", () => {
    it("should throw UnauthorizedError if user not found", async () => {
      mockingoose(userModel).toReturn(null, "findOne");
      await expect(userService.loginUser(validUserCreds)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw BadRequestError if user is Google provider", async () => {
      mockingoose(userModel).toReturn({ authProvider: "google" }, "findOne");
      await expect(userService.loginUser(validUserCreds)).rejects.toThrow(BadRequestError);
    });

    it("should login successfully with valid credentials", async () => {
      mockingoose(userModel).toReturn(mockUser, "findOne");
      vi.mocked(comparePasswords).mockResolvedValue(true);
      vi.mocked(signToken).mockReturnValue("fake-token");

      const result = await userService.loginUser(validUserCreds);

      expect(result.token).toBe("fake-token");
      expect(result.user.email).toBe("t@t.com");
    });
  });

  describe("registerUser", () => {
    it("should create user and send verification email", async () => {
      mockingoose(userModel).toReturn(null, "findOne");
      vi.spyOn(userModel, "create").mockResolvedValue(mockUser as any);

      const result = await userService.registerUser({
        name: "John",
        ...validUserCreds,
        timezone: "UTC",
      });

      expect(queueEmail).toHaveBeenCalledWith(expect.objectContaining({ template: "EMAIL_VERIFY" }));
      expect(redis.set).toHaveBeenCalled();
      expect(result.id.toString()).toBe(validUserId);
    });
  });

  describe("verifyUser", () => {
    it("should verify successfully and return token", async () => {
      vi.mocked(redis.ttl).mockResolvedValue(0);
      vi.mocked(redis.mget).mockResolvedValue(["123456", "0"]);
      const mockUser = {
        id: validUserId,
        verified: false,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(userModel, "findById").mockResolvedValue(mockUser as any);
      vi.mocked(signToken).mockReturnValue("fake-token");

      const result = await userService.verifyUser({ userId: validUserId, otp: "123456" });

      expect(result.token).toBe("fake-token");
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe("handleForgotPasswordAction", () => {
    it("should send forgot password email", async () => {
      vi.mocked(redis.get).mockResolvedValue(null);
      mockingoose(userModel).toReturn(mockUser, "findOne");

      const mockToken = "predictable-reset-token";
      vi.mocked(generateRandomToken).mockReturnValue(mockToken);

      await userService.handleForgotPasswordAction("t@t.com");

      expect(queueEmail).toHaveBeenCalledWith(expect.objectContaining({ template: "FORGOT_PASSWORD" }));
      expect(redis.multi).toHaveBeenCalled();
    });
  });

  describe("resetUserPassword", () => {
    it("should update password and return token", async () => {
      vi.mocked(redis.get).mockResolvedValue("t@t.com");
      vi.mocked(hashPassword).mockResolvedValue("new-hp" as never);
      mockingoose(userModel).toReturn({ _id: validUserId }, "findOneAndUpdate");
      vi.mocked(signToken).mockReturnValue("fake-token");

      const result = await userService.resetUserPassword("token123", "p123");

      expect(result.cookieToken).toBe("fake-token");
    });
  });
});
