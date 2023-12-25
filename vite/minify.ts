import { type Plugin } from "vite";
import { type MinifyOptions, minify } from "terser";
import UglifyJS from "uglify-js";

export type Options = {
  terser?: MinifyOptions;
  uglifyJS?: UglifyJS.MinifyOptions;
};

export function minifyPlugin(opts: Options = {}): Plugin {
  return {
    name: "minify",

    async generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!(chunk.type === "chunk" && chunk.isEntry)) {
          continue;
        }

        const minifiedTerser = await minify(chunk.code, opts.terser);
        if (!minifiedTerser.code) {
          throw new Error(`Terser failed`);
        }

        const minifiedUglifyJS = UglifyJS.minify(chunk.code, opts.uglifyJS);
        if (minifiedUglifyJS.error) {
          throw new Error(`UglifyJS failed: ${minifiedUglifyJS.error}`);
        }

        const minifiedBoth = await minify(minifiedUglifyJS.code, opts.terser);
        if (!minifiedBoth.code) {
          throw new Error(`UglifyJS->Terser failed`);
        }

        const minified = [
          minifiedTerser.code,
          minifiedUglifyJS.code,
          minifiedBoth.code,
        ].reduce((shortest, code) =>
          code.length < shortest.length ? code : shortest
        );

        this.emitFile({
          type: "asset",
          name: `${chunk.name}.min`,
          fileName: `${fileName}.min.js`,
          source: minified,
        });
      }
    },
  };
}

export default minifyPlugin;
