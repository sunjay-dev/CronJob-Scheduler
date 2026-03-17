import { describe, it, expect, beforeEach } from "vitest";
import { createValidater } from "../../src/middlewares/validate.middlewares.js";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { createMockReq, createMockRes, createNext } from "../__helpers__/expressMocks.js";

describe("Validate Middlewares", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = createMockReq();
    mockRes = createMockRes();
    nextFunction = createNext();
  });

  describe("validate body", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().optional(),
    });

    const middleware = createValidater("body", schema);

    it("should call next if validation passes", () => {
      mockReq.body = { name: "John Doe", age: 30 };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 400 if validation fails", () => {
      mockReq.body = { age: "30" };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("validate params", () => {
    const schema = z.object({
      id: z.uuid(),
    });

    const middleware = createValidater("params", schema);

    it("should call next if params validation passes", () => {
      mockReq.params = { id: "123e4567-e89b-12d3-a456-426614174000" };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 400 if params validation fails", () => {
      mockReq.params = { id: "invalid-uuid" };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("validate query", () => {
    const schema = z.object({
      page: z.string().regex(/^\d+$/),
      limit: z.string().regex(/^\d+$/),
    });

    const middleware = createValidater("query", schema);

    it("should call next if query validation passes", () => {
      mockReq.query = { page: "1", limit: "10" };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 400 if query validation fails", () => {
      mockReq.query = { page: "one", limit: "ten" };

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
