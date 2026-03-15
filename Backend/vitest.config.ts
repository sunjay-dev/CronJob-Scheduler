import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    isolate: false,
    testTimeout: 10_000,
  },
});
