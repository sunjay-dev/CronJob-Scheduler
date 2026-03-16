import { vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

export function createMockReq(overrides?: Partial<Request>): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    cookies: {},
    headers: {},
    method: "GET",
    originalUrl: "/test-url",
    ...overrides,
  };
}

export function createMockRes(): Partial<Response> {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  res.send = vi.fn().mockReturnThis();
  return res;
}

export function createNext(): NextFunction {
  return vi.fn();
}
