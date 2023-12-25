import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ["chrome89", "edge89", "firefox89", "safari15.1"],
    outDir: "../../out",
    rollupOptions: {
      output: {
        entryFileNames: `editors/polars/[name].js`,
        chunkFileNames: `editors/polars/[name].js`,
        assetFileNames: `editors/polars/[name].[ext]`
      },
    },
  },
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: "../../../node_modules/@puredit/parser/wasm/*",
          dest: "wasm"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      crypto: "node:crypto",
    },
  },
});
