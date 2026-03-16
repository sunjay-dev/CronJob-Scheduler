import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/__setup__/env.setup.ts", "./tests/__setup__/logger.setup.ts"],
    include: ["./tests/**/*.test.ts"],
    isolate: false,
    testTimeout: 10_000,
  },
});
