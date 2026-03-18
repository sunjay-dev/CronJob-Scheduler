import { describe, it, expect, beforeEach } from "vitest";
import errorHandler from "@/middlewares/errorHandler.middlewares.js";
import { AppError } from "@/utils/appError.utils.js";
import { Request, Response, NextFunction } from "express";
import { createMockReq, createMockRes, createNext } from "../../__helpers__/expressMocks.js";

describe("errorHandler Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = createMockReq();
    mockRes = createMockRes();
    nextFunction = createNext();
  });

  it("should handle an AppError correctly", () => {
    const error = new AppError("A custom application error", 400, {
      field: "test",
    });

    errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "A custom application error",
      field: "test",
    });
  });

  it("should handle a generic Error correctly", () => {
    const error = new Error("Generic unhandled error");

    errorHandler(error, mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Something went wrong, Please try again later.",
    });
  });
});
