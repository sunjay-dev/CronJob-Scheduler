import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "../../src/utils/jwt.utils.js";

vi.mock("jsonwebtoken");

describe("JWT Utilities", () => {
  const payload = { userId: "123" };
  const expiresIn = "1h";

  describe("signToken", () => {
    it("should sign a token without expiration", () => {
      const mockedToken = "mocked.jwt.token";

      vi.mocked(jwt.sign).mockReturnValue(mockedToken as any);

      const token = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET);
      expect(token).toBe(mockedToken);
    });

    it("should sign a token with expiration", () => {
      const mockedToken = "mocked.jwt.token.expires";

      vi.mocked(jwt.sign).mockReturnValue(mockedToken as any);

      const token = signToken(payload, expiresIn);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, {
        expiresIn,
      });
      expect(token).toBe(mockedToken);
    });
  });

  describe("verifyToken", () => {
    it("should verify a token and return the payload", () => {
      const token = "mocked.jwt.token";
      const decodedPayload = { userId: "123", iat: 12345 };

      vi.mocked(jwt.verify).mockReturnValue(decodedPayload as any);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(decodedPayload);
    });

    it("should throw an error if jwt.verify fails", () => {
      const token = "invalid.token";
      const error = new Error("Invalid token");

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow("Invalid token");
    });
  });
});
