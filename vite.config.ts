/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@type": fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: "./src/ViewerPlugin.ts",
      name: "CruciblePlugin",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
  },
});
