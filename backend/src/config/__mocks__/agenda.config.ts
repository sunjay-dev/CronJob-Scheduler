import { vi } from "vitest";

const agenda = {
  create: vi.fn(),
  jobs: vi.fn(),
  cancel: vi.fn(),
  now: vi.fn(),
  on: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

export default agenda;
