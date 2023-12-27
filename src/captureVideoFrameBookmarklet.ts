export {};

async function main(): Promise<void> {
  try {
    const url = URL.createObjectURL(
      await canvasToBlob(videoToCanvas(getVideo()))
    );

    try {
      await openWindowAndWait(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (e) {
    alert(`Capture Video Frame\n${e}`);
  }
}

function getVideo(): HTMLVideoElement {
  const videos = Array.from(document.querySelectorAll("video"));
  if (videos.length === 0) {
    throw new Error("No video found");
  }

  const videoArea = (video: HTMLVideoElement) =>
    video.videoWidth * video.videoHeight;

  return videos.reduce((largest, video) =>
    videoArea(video) > videoArea(largest) ? video : largest
  );
}

function videoToCanvas(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  if (!canvas) {
    throw new Error("Failed to create canvas");
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context");
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob"));
      } else {
        resolve(blob);
      }
    });
  });
}

function openWindowAndWait(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window.open(url, "_blank");

    if (!win) {
      reject(new Error("Failed to open tab"));
    } else {
      // There seems to be no event for the window being closed. "unload"
      // is fired even when the opened page is reloaded.
      const timer = setInterval(() => {
        if (win.closed) {
          clearInterval(timer);
          resolve();
        }
      }, 10e3);
    }
  });
}

main();
