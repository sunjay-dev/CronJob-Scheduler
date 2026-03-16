import { describe, it, expect, vi, beforeEach } from "vitest";
import { restrictUserLogin, softRestrictUserLogin, prometheusAuth } from "../../src/middlewares/auth.middlewares.js";
import * as jwtUtils from "../../src/utils/jwt.utils.js";
import { Request, Response, NextFunction } from "express";
import { createNext, createMockReq, createMockRes } from "../__helpers__/expressMocks.js";

vi.mock("../../src/utils/jwt.utils.js");
describe("Auth Middlewares", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = createMockReq();
    mockRes = createMockRes();
    nextFunction = createNext();
  });

  describe("restrictUserLogin", () => {
    it("should return 401 if no token is provided", () => {
      restrictUserLogin(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: expect.any(String) });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should extract token from Authorization header and call next if valid", () => {
      mockReq.headers = { authorization: "Bearer valid-token" };
      const decodedUser = { userId: "123" };
      vi.mocked(jwtUtils.verifyToken).mockReturnValue(decodedUser as any);

      restrictUserLogin(mockReq as Request, mockRes as Response, nextFunction);

      expect(jwtUtils.verifyToken).toHaveBeenCalledWith("valid-token");
      expect((mockReq as Request).jwtUser).toEqual(decodedUser);
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", () => {
      mockReq.cookies = { token: "invalid-token" };
      vi.mocked(jwtUtils.verifyToken).mockImplementation(() => {
        throw new Error();
      });

      restrictUserLogin(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: expect.any(String) });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("softRestrictUserLogin", () => {
    it("should return 200 with authorized: false if no token is provided", () => {
      softRestrictUserLogin(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        authorized: false,
        message: expect.any(String),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next if valid token is provided", () => {
      mockReq.cookies = { token: "valid-token" };
      const decodedUser = { userId: "123" };
      vi.mocked(jwtUtils.verifyToken).mockReturnValue(decodedUser as any);

      softRestrictUserLogin(mockReq as Request, mockRes as Response, nextFunction);

      expect(jwtUtils.verifyToken).toHaveBeenCalledWith("valid-token");
      expect((mockReq as Request).jwtUser).toEqual(decodedUser);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe("prometheusAuth", () => {
    it("should return 401 if Authorization header is missing", () => {
      prometheusAuth(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: expect.any(String) });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 403 if token does not match PROMETHEUS_SECRET", () => {
      mockReq.headers = { authorization: "Bearer wrong-secret" };

      prometheusAuth(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: expect.any(String) });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next if token matches PROMETHEUS_SECRET", () => {
      mockReq.headers = { authorization: `Bearer ${process.env.PROMETHEUS_SECRET}` };

      prometheusAuth(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
