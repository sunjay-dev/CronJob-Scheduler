import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      "./tests/__setup__/env.setup.ts",
      "./tests/__setup__/logger.setup.ts",
      "./tests/__setup__/mocks.setup.ts",
    ],
    include: ["./tests/**/*.test.ts"],
    isolate: true,
    testTimeout: 10_000,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
