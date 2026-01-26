import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  base: "./",
  root: "src/renderer",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, "./src/renderer/lib"),
      $components: resolve(__dirname, "./src/renderer/components"),
      $views: resolve(__dirname, "./src/renderer/views"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
