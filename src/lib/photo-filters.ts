function clamp(v: number) { return Math.max(0, Math.min(255, v)); }

function applyToCanvas(
  canvas: HTMLCanvasElement,
  fn: (d: ImageData) => void
) {
  const ctx = canvas.getContext("2d")!;
  const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
  fn(d);
  ctx.putImageData(d, 0, 0);
}

export function popArt(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    const colors = [
      [255, 50, 50], [50, 200, 255], [255, 220, 50], [50, 255, 100],
    ];
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const idx = g < 85 ? 0 : g < 145 ? 1 : g < 200 ? 2 : 3;
      p[i] = colors[idx][0];
      p[i + 1] = colors[idx][1];
      p[i + 2] = colors[idx][2];
    }
  });
}

export function comicEffect(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      p[i] = p[i] < 120 ? 0 : p[i] > 200 ? 255 : p[i] * 1.3;
      p[i + 1] = p[i + 1] < 120 ? 0 : p[i + 1] > 200 ? 255 : p[i + 1] * 1.3;
      p[i + 2] = p[i + 2] < 120 ? 0 : p[i + 2] > 200 ? 255 : p[i + 2] * 1.3;
    }
  });
  // edge detect
  const ctx = c.getContext("2d")!;
  const d = ctx.getImageData(0, 0, c.width, c.height);
  const p = d.data;
  const w = c.width * 4;
  const out = new Uint8ClampedArray(p.length);
  for (let y = 1; y < c.height - 1; y++) {
    for (let x = 1; x < c.width - 1; x++) {
      const i = (y * c.width + x) * 4;
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const gL = p[i - 4] * 0.3 + p[i - 3] * 0.59 + p[i - 2] * 0.11;
      const gR = p[i + 4] * 0.3 + p[i + 5] * 0.59 + p[i + 6] * 0.11;
      const gU = p[i - w] * 0.3 + p[i - w + 1] * 0.59 + p[i - w + 2] * 0.11;
      const gD = p[i + w] * 0.3 + p[i + w + 1] * 0.59 + p[i + w + 2] * 0.11;
      const edge = Math.abs(g - gL) + Math.abs(g - gR) + Math.abs(g - gU) + Math.abs(g - gD);
      if (edge > 60) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
      } else {
        out[i] = p[i];
        out[i + 1] = p[i + 1];
        out[i + 2] = p[i + 2];
      }
      out[i + 3] = 255;
    }
  }
  p.set(out);
  ctx.putImageData(d, 0, 0);
}

export function halftone(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const cell = 6;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const imgData = ctx.getImageData(0, 0, w, h);
  const p = imgData.data;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  for (let r = 0; r < rows; r++) {
    for (let co = 0; co < cols; co++) {
      let sum = 0;
      let count = 0;
      for (let dy = 0; dy < cell; dy++) {
        for (let dx = 0; dx < cell; dx++) {
          const px = co * cell + dx;
          const py = r * cell + dy;
          if (px < w && py < h) {
            const i = (py * w + px) * 4;
            sum += p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
            count++;
          }
        }
      }
      const avg = sum / count;
      const radius = (1 - avg / 255) * (cell / 2) * 1.2;
      const cx = co * cell + cell / 2;
      const cy = r * cell + cell / 2;
      if (radius > 0.5) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();
      }
    }
  }
}

export function sketch(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const d = ctx.getImageData(0, 0, w, h);
  const p = d.data;
  const out = new Uint8ClampedArray(p.length).fill(255);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const gR = p[i + 4] * 0.3 + p[i + 5] * 0.59 + p[i + 6] * 0.11;
      const gD = p[i + w] * 0.3 + p[i + w + 1] * 0.59 + p[i + w + 2] * 0.11;
      const diff = Math.sqrt((g - gR) ** 2 + (g - gD) ** 2);
      const v = 255 - clamp(diff * 3);
      out[i] = v;
      out[i + 1] = v;
      out[i + 2] = v;
    }
  }
  p.set(out);
  ctx.putImageData(d, 0, 0);
}

export function vintage(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i];
      const g = p[i + 1];
      const b = p[i + 2];
      p[i] = clamp(r * 0.9 + g * 0.5 + b * 0.1 + 20);
      p[i + 1] = clamp(r * 0.3 + g * 0.7 + b * 0.2 + 10);
      p[i + 2] = clamp(r * 0.1 + g * 0.3 + b * 0.6);
    }
    for (let i = 0; i < p.length; i += 4) {
      const noise = Math.random() * 20 - 10;
      p[i] = clamp(p[i] + noise);
      p[i + 1] = clamp(p[i + 1] + noise);
      p[i + 2] = clamp(p[i + 2] + noise);
    }
  });
}

export function neonGlow(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      p[i] = clamp(g < 128 ? p[i] * 2 : 255 - (p[i] * 0.3));
      p[i + 1] = clamp(g < 128 ? p[i + 1] * 0.5 : 255);
      p[i + 2] = clamp(g < 128 ? 255 : 255 - (p[i + 2] * 0.5));
    }
  });
}

export function cartoon(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    const levels = 6;
    const step = 255 / levels;
    for (let i = 0; i < p.length; i += 4) {
      p[i] = Math.round(p[i] / step) * step;
      p[i + 1] = Math.round(p[i + 1] / step) * step;
      p[i + 2] = Math.round(p[i + 2] / step) * step;
    }
  });
}

export function lomo(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      p[i + 1] = clamp(p[i + 1] * 1.3);
      p[i + 2] = clamp(p[i + 2] * 0.9);
    }
  });
  const d = ctx.getImageData(0, 0, w, h);
  const p = d.data;
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const factor = Math.max(0, 1 - (dist / maxDist) * 0.5);
      p[i] = clamp(p[i] * factor);
      p[i + 1] = clamp(p[i + 1] * factor);
      p[i + 2] = clamp(p[i + 2] * factor);
    }
  }
  ctx.putImageData(d, 0, 0);
}

export function bwHighContrast(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const v = g < 128 ? 0 : 255;
      p[i] = v;
      p[i + 1] = v;
      p[i + 2] = v;
    }
  });
}

export function rgbSplit(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const d = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(d.data);
  const shift = 8;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const rI = (y * w + Math.max(0, x - shift)) * 4;
      const bI = (y * w + Math.min(w - 1, x + shift)) * 4;
      d.data[i] = src[rI];
      d.data[i + 1] = src[i + 1];
      d.data[i + 2] = src[bI + 2];
    }
  }
  ctx.putImageData(d, 0, 0);
}

export function pixelate(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  const size = 8;
  const d = ctx.getImageData(0, 0, w, h);
  const p = d.data;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < size && y + dy < h; dy++) {
        for (let dx = 0; dx < size && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          r += p[i];
          g += p[i + 1];
          b += p[i + 2];
          count++;
        }
      }
      r /= count;
      g /= count;
      b /= count;
      for (let dy = 0; dy < size && y + dy < h; dy++) {
        for (let dx = 0; dx < size && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          p[i] = r;
          p[i + 1] = g;
          p[i + 2] = b;
        }
      }
    }
  }
  ctx.putImageData(d, 0, 0);
}

export function warmFilm(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      p[i] = clamp(r * 1.1 + 15);
      p[i + 1] = clamp(g * 0.85 + 10);
      p[i + 2] = clamp(b * 0.7 + 5);
    }
    for (let i = 0; i < p.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      p[i] = clamp(p[i] + noise);
      p[i + 1] = clamp(p[i + 1] + noise);
      p[i + 2] = clamp(p[i + 2] + noise);
    }
  });
}

export function cinematic(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      const lum = r * 0.3 + g * 0.59 + b * 0.11;
      p[i] = clamp(lum + (r - lum) * 1.1 + 5);
      p[i + 1] = clamp(lum + (g - lum) * 0.85 - 8);
      p[i + 2] = clamp(lum + (b - lum) * 0.6 + 15);
    }
  });
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      p[i] = clamp(p[i] * 0.92);
      p[i + 2] = clamp(p[i + 2] * 1.15);
    }
  });
}

export function softPastel(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      p[i] = clamp(r * 0.85 + 40);
      p[i + 1] = clamp(g * 0.8 + 50);
      p[i + 2] = clamp(b * 0.75 + 60);
    }
  });
}

export function y2kFlash(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const boost = g < 180 ? 1.0 : 1.0 + (g - 180) / 180 * 0.5;
      p[i] = clamp(p[i] * boost + 10);
      p[i + 1] = clamp(p[i + 1] * boost + 8);
      p[i + 2] = clamp(p[i + 2] * boost + 25);
    }
  });
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      p[i] = g < 128 ? clamp(p[i] * 0.9) : p[i];
      p[i + 1] = g < 128 ? clamp(p[i + 1] * 0.85) : p[i + 1];
      p[i + 2] = g < 128 ? clamp(p[i + 2] * 0.8) : p[i + 2];
    }
  });
}

export function noirGrain(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const v = g < 80 ? 0 : g > 180 ? 255 : clamp((g / 255) * 300);
      p[i] = v;
      p[i + 1] = v;
      p[i + 2] = v;
    }
    for (let i = 0; i < p.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      p[i] = clamp(p[i] + noise);
      p[i + 1] = clamp(p[i + 1] + noise);
      p[i + 2] = clamp(p[i + 2] + noise);
    }
  });
}

export function grunge(c: HTMLCanvasElement) {
  applyToCanvas(c, (d) => {
    const p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const sat = 0.3;
      p[i] = clamp(g + (p[i] - g) * sat);
      p[i + 1] = clamp(g + (p[i + 1] - g) * sat);
      p[i + 2] = clamp(g + (p[i + 2] - g) * sat);
    }
    for (let i = 0; i < p.length; i += 4) {
      const g = p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11;
      const v = g < 100 ? clamp(g * 0.7) : g > 200 ? clamp(g * 1.3) : g;
      p[i] = clamp(v + (Math.random() - 0.5) * 20);
      p[i + 1] = clamp(v + (Math.random() - 0.5) * 20);
      p[i + 2] = clamp(v + (Math.random() - 0.5) * 20);
    }
  });
}

export const FILTERS = [
  { id: "original", name: "Original", fn: null },
  { id: "warmfilm", name: "Warm Film", fn: warmFilm },
  { id: "cinematic", name: "Cinematic", fn: cinematic },
  { id: "softpastel", name: "Soft Pastel", fn: softPastel },
  { id: "y2kflash", name: "Y2K Flash", fn: y2kFlash },
  { id: "noirgrain", name: "Noir Grain", fn: noirGrain },
  { id: "grunge", name: "Grunge", fn: grunge },
  { id: "vintage", name: "Vintage", fn: vintage },
  { id: "popart", name: "Pop Art", fn: popArt },
  { id: "comic", name: "Comic", fn: comicEffect },
  { id: "neon", name: "Neon Glow", fn: neonGlow },
  { id: "cartoon", name: "Cartoon", fn: cartoon },
  { id: "lomo", name: "Lomo", fn: lomo },
  { id: "halftone", name: "Halftone", fn: halftone },
  { id: "sketch", name: "Sketch", fn: sketch },
  { id: "bw-hc", name: "B&W HC", fn: bwHighContrast },
  { id: "rgbsplit", name: "RGB Split", fn: rgbSplit },
  { id: "pixelate", name: "Pixelate", fn: pixelate },
];
