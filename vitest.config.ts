import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    alias: {
      "@": "/src",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
