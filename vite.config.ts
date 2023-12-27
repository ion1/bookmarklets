import { resolve } from "path";
import { defineConfig } from "vite";

import minify from "./vite/minify";
import bookmarkletList from "./vite/bookmarkletList";

export default defineConfig({
  plugins: [minify(), bookmarkletList()],
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
