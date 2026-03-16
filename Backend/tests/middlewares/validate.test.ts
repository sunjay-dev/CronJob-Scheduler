import { describe, it, expect, beforeEach } from "vitest";
import { validate, validateParams } from "../../src/middlewares/validate.middlewares.js";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";
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

    const middleware = validate(schema);

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

  describe("validate Params", () => {
    const schema = z.object({
      id: z.uuid(),
    });

    const middleware = validateParams(schema);

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
});
