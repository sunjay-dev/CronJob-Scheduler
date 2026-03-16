import { vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

export const createMockReq = (overrides?: Partial<Request>): Partial<Request> => ({
    body: {},
    params: {},
    query: {},
    cookies: {},
    headers: {},
    method: "GET",
    originalUrl: "/test-url",
    ...overrides,
});

export const createMockRes = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    res.send = vi.fn().mockReturnThis();
    return res;
};

export const createNext = (): NextFunction => vi.fn();