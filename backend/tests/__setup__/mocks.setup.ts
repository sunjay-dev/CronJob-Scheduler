import { beforeEach, vi } from "vitest";
import mockingoose from "mockingoose";

beforeEach(() => {
  vi.clearAllMocks();
  mockingoose.resetAll();
});
