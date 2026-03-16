import { vi, beforeEach } from "vitest";

vi.mock("../../src/utils/logger.utils.js", () => ({
    default: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

beforeEach(() => {
    vi.clearAllMocks();
});