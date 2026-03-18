import { vi } from "vitest";

const redis = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  on: vi.fn(),
  exists: vi.fn(),
  ttl: vi.fn(),
  mget: vi.fn(),
  multi: vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    del: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(true),
  })),
};

export default redis;
