import { describe, it, expect } from "vitest";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  TooManyRequestsError,
} from "../../src/utils/appError.utils.js";

describe("AppError and Subclasses", () => {
  it("should create an AppError with correctly assigned properties", () => {
    const error = new AppError("Test message", 418, { key: "value" });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Test message");
    expect(error.statusCode).toBe(418);
    expect(error.details).toEqual({ key: "value" });
    expect(error.stack).toBeDefined();
  });

  it("should create a BadRequestError with status 400", () => {
    const error = new BadRequestError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(400);

    const customError = new BadRequestError("Custom Bad Request", {
      field: "email",
    });
    expect(customError.message).toBe("Custom Bad Request");
    expect(customError.details).toEqual({ field: "email" });
  });

  it("should create an UnauthorizedError with status 401", () => {
    const error = new UnauthorizedError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(401);
  });

  it("should create a ForbiddenError with status 403", () => {
    const error = new ForbiddenError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(403);
  });

  it("should create a NotFoundError with status 404", () => {
    const error = new NotFoundError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(404);
  });

  it("should create an InternalServerError with status 500", () => {
    const error = new InternalServerError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(500);
  });

  it("should create a TooManyRequestsError with status 429", () => {
    const error = new TooManyRequestsError();
    expect(error.message).toBeDefined();
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.statusCode).toBe(429);
  });
});
