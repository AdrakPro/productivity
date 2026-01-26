import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte()],
  base: "./",
  root: "src/renderer",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      $lib: resolve("./src/renderer/lib"),
      $components: resolve("./src/renderer/components"),
      $views: resolve("./src/renderer/views"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
