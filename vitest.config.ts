import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** 순수 모듈(src/lib)의 단위 테스트. 화면은 브라우저에서 직접 본다. */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
