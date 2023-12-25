import { type Plugin } from "vite";
import { Eta } from "eta";

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookmarklets</title>
  <style>
    main {
      max-width: 60rem;
      margin: 1rem auto;
    }
    small {
      opacity: 0.7;
    }
    a[href^="javascript:"] {
      padding: 0.25rem;
      box-shadow: 0 0.125rem 0.375rem 0.0625rem grey;
    }
  </style>
</head>
<body>
  <main>
    <h1>Bookmarklets</h1>
    <p>Drag the link to your bookmark bar.</p>
    <ul>
      <li>
        <a href="javascript:<%= encodeURIComponent(it.bookmarklets["captureVideoFrameBookmarklet.min"]) %>">Capture Video Frame</a> opens the currently visible video frame as an image in a new tab.
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&amp;The+Game">An example web page with a video for testing</a>.
        <small><a href="https://github.com/ion1/bookmarklets/blob/master/src/captureVideoFrameBookmarklet.ts">Source</a></small>
      </li>
    </ul>
  </main>
</body>
</html>
`;

export function bookmarkletList(): Plugin {
  const eta = new Eta();

  return {
    name: "bookmarkletList",

    async generateBundle(_options, bundle) {
      const bookmarklets: Record<string, string | Uint8Array> = {};

      for (const [fileName, chunk] of Object.entries(bundle)) {
        const name = chunk.name;
        if (
          !(
            chunk.type === "asset" &&
            fileName.endsWith(".min.js") &&
            name != null
          )
        ) {
          continue;
        }

        bookmarklets[name] = chunk.source;
      }

      this.emitFile({
        type: "asset",
        name: "bookmarklets",
        fileName: "index.html",
        source: eta.renderString(template, { bookmarklets }),
      });
    },
  };
}

export default bookmarkletList;
