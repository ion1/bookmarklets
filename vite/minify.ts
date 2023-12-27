import { type Plugin } from "vite";
import esbuild from "esbuild";

export function minifyPlugin(): Plugin {
  return {
    name: "minify",

    async generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!(chunk.type === "chunk" && chunk.isEntry)) {
          continue;
        }

        const minified = await esbuild.transform(chunk.code, {
          platform: "browser",
          format: "iife",
          target: "es2022",
          minify: true,
          treeShaking: true,
          sourcemap: false,
        });

        this.emitFile({
          type: "asset",
          name: `${chunk.name}.min`,
          fileName: `${fileName}.min.js`,
          source: minified.code,
        });
      }
    },
  };
}

export default minifyPlugin;
