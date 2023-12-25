import { resolve } from "path";
import { defineConfig } from "vite";

import minify from "./vite/minify";
import bookmarkletList from "./vite/bookmarkletList";

export default defineConfig({
  plugins: [
    minify({
      terser: {
        ecma: 2020,
        compress: {
          passes: 5,
          keep_fargs: false,
          unsafe_arrows: true,
        },
        mangle: {
          module: true,
        },
      },
      uglifyJS: {
        module: false, // true gets rid of the top-level IIFE.
        compress: {
          passes: 5,
        },
      },
    }),
    bookmarkletList(),
  ],
  build: {
    target: "es2020",
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/captureVideoFrameBookmarklet.ts"),
      name: "captureVideoFrameBookmarklet",
      fileName: "captureVideoFrameBookmarklet",
      formats: ["es"],
    },
  },
});
