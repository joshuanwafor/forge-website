import * as THREE from "three";

/**
 * Artwork for the 3D building, painted on canvas at runtime — no image files.
 * Every piece is seeded, so it looks the same on every visit.
 *
 * The palette leans on the brand: ember yellow, ink, cream, plus a few warm
 * and muted accents so the walls don't all shout.
 */

export type ArtKind =
  | "sunrise"
  | "arc"
  | "dots"
  | "contours"
  | "blocks"
  | "bauhaus"
  | "calm"
  | "ring"
  | "sign"
  | "daylight";

const C = {
  cream: "#efe7d6",
  paper: "#f6f1e7",
  ink: "#141418",
  ember: "#facc15",
  amber: "#f59e0b",
  terracotta: "#c8553d",
  sage: "#7f9c84",
  navy: "#1f2b45",
  plum: "#4a2c4f",
  slate: "#3c4a5c",
};

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Light canvas grain so flat fills read as paint, not pixels. */
function grain(g: CanvasRenderingContext2D, w: number, h: number, rand: () => number, amount = 0.06) {
  for (let i = 0; i < (w * h) / 40; i++) {
    g.fillStyle = rand() > 0.5 ? `rgba(255,255,255,${rand() * amount})` : `rgba(0,0,0,${rand() * amount})`;
    g.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
}

const painters: Record<Exclude<ArtKind, "sign">, (g: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void> = {
  // Sun on the horizon over still water — the brand yellow as the hero
  sunrise(g, w, h, rand) {
    const horizon = h * 0.58;
    const sky = g.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, C.navy);
    sky.addColorStop(0.55, C.plum);
    sky.addColorStop(1, C.terracotta);
    g.fillStyle = sky;
    g.fillRect(0, 0, w, horizon);
    g.fillStyle = C.ember;
    g.beginPath();
    g.arc(w * 0.62, horizon, h * 0.26, Math.PI, 0);
    g.fill();
    const sea = g.createLinearGradient(0, horizon, 0, h);
    sea.addColorStop(0, "#5a2f3a");
    sea.addColorStop(1, "#141826");
    g.fillStyle = sea;
    g.fillRect(0, horizon, w, h - horizon);
    // Broken reflection of the sun
    for (let i = 0; i < 14; i++) {
      const y = horizon + 6 + i * ((h - horizon) / 15);
      const half = h * 0.26 * (1 - i / 16) * (0.6 + rand() * 0.4);
      g.fillStyle = `rgba(250, 204, 21, ${0.65 - i * 0.04})`;
      g.fillRect(w * 0.62 - half, y, half * 2, 3 + rand() * 3);
    }
    grain(g, w, h, rand);
  },

  // Thick ember quarter-arc on black
  arc(g, w, h) {
    g.fillStyle = C.ink;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = C.ember;
    g.lineWidth = w * 0.11;
    g.beginPath();
    g.arc(w * 0.18, h * 0.82, w * 0.62, -Math.PI / 2, 0);
    g.stroke();
    g.fillStyle = C.cream;
    g.beginPath();
    g.arc(w * 0.72, h * 0.24, w * 0.09, 0, Math.PI * 2);
    g.fill();
  },

  // A grid of ink dots, one of them ember
  dots(g, w, h) {
    g.fillStyle = C.paper;
    g.fillRect(0, 0, w, h);
    const cols = 5;
    const rows = 7;
    const r = w * 0.055;
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        g.fillStyle = i === 3 && j === 2 ? C.ember : C.ink;
        g.beginPath();
        g.arc(w * (0.18 + (i * 0.64) / (cols - 1)), h * (0.13 + (j * 0.74) / (rows - 1)), r, 0, Math.PI * 2);
        g.fill();
      }
  },

  // Topographic contour lines, like a site survey
  contours(g, w, h, rand) {
    g.fillStyle = C.cream;
    g.fillRect(0, 0, w, h);
    const peaks = [
      [w * 0.3, h * 0.55],
      [w * 0.72, h * 0.4],
    ];
    peaks.forEach(([cx, cy], p) => {
      for (let k = 1; k < 14; k++) {
        g.strokeStyle = p === 0 && k === 5 ? C.amber : "rgba(20,20,24,0.75)";
        g.lineWidth = p === 0 && k === 5 ? 3 : 1.4;
        g.beginPath();
        for (let a = 0; a <= 64; a++) {
          const t = (a / 64) * Math.PI * 2;
          const wobble = 1 + 0.12 * Math.sin(t * 3 + p + k * 0.4) + 0.05 * Math.sin(t * 7 + k);
          const rad = k * h * 0.045 * wobble;
          const x = cx + Math.cos(t) * rad * 1.5;
          const y = cy + Math.sin(t) * rad;
          if (a === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
      }
    });
    grain(g, w, h, rand, 0.04);
  },

  // Colour-field blocks with soft edges
  blocks(g, w, h, rand) {
    g.fillStyle = "#2a1f24";
    g.fillRect(0, 0, w, h);
    const bands: Array<[string, number, number]> = [
      [C.terracotta, 0.08, 0.36],
      [C.amber, 0.42, 0.22],
      [C.plum, 0.68, 0.24],
    ];
    for (const [color, top, height] of bands) {
      g.save();
      g.filter = "blur(6px)";
      g.fillStyle = color;
      g.fillRect(w * 0.08, h * top, w * 0.84, h * height);
      g.restore();
    }
    grain(g, w, h, rand, 0.08);
  },

  // Bauhaus composition
  bauhaus(g, w, h, rand) {
    g.fillStyle = C.cream;
    g.fillRect(0, 0, w, h);
    g.fillStyle = C.ink;
    g.beginPath();
    g.arc(w * 0.38, h * 0.36, w * 0.28, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = C.ember;
    g.beginPath();
    g.arc(w * 0.62, h * 0.66, w * 0.3, Math.PI, 0);
    g.fill();
    g.fillStyle = C.terracotta;
    g.fillRect(w * 0.12, h * 0.7, w * 0.22, h * 0.2);
    g.strokeStyle = C.ink;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(w * 0.08, h * 0.62);
    g.lineTo(w * 0.92, h * 0.62);
    g.moveTo(w * 0.8, h * 0.08);
    g.lineTo(w * 0.8, h * 0.5);
    g.stroke();
    grain(g, w, h, rand, 0.05);
  },

  // Soft horizontal washes — for the quiet room
  calm(g, w, h, rand) {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#dfe6e1");
    bg.addColorStop(1, "#a9bdb2");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) {
      const y = h * (0.15 + i * 0.09);
      g.fillStyle = `rgba(${60 + i * 6}, ${90 + i * 4}, ${95 + i * 3}, ${0.18 + rand() * 0.12})`;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= w; x += w / 8) g.lineTo(x, y + Math.sin(x / w * Math.PI * 2 + i) * h * 0.02);
      g.lineTo(w, y + h * 0.06);
      g.lineTo(0, y + h * 0.06);
      g.fill();
    }
    g.fillStyle = "rgba(250, 204, 21, 0.85)";
    g.beginPath();
    g.arc(w * 0.7, h * 0.18, w * 0.07, 0, Math.PI * 2);
    g.fill();
    grain(g, w, h, rand, 0.04);
  },

  // The view through an office window: bright sky over a soft city skyline
  daylight(g, w, h, rand) {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#a9cbe8");
    sky.addColorStop(0.7, "#e3eef6");
    sky.addColorStop(1, "#f4f1ea");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    // Two layers of distant buildings, paler further away
    for (const [tone, base, maxH] of [
      ["rgba(150, 165, 180, 0.55)", 0.86, 0.3],
      ["rgba(110, 125, 140, 0.7)", 0.95, 0.22],
    ] as const) {
      let x = -rand() * 30;
      while (x < w) {
        const bw = 18 + rand() * 46;
        const bh = h * (0.05 + rand() * maxH);
        g.fillStyle = tone;
        g.fillRect(x, h * base - bh, bw, bh + h);
        x += bw + rand() * 6;
      }
    }
    // A little glare across the glass
    const glare = g.createLinearGradient(0, 0, w, h);
    glare.addColorStop(0.3, "rgba(255,255,255,0)");
    glare.addColorStop(0.45, "rgba(255,255,255,0.22)");
    glare.addColorStop(0.6, "rgba(255,255,255,0)");
    g.fillStyle = glare;
    g.fillRect(0, 0, w, h);
  },

  // Ink ring on ember
  ring(g, w, h) {
    g.fillStyle = C.ember;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = C.ink;
    g.lineWidth = w * 0.07;
    g.beginPath();
    g.arc(w / 2, h * 0.45, w * 0.28, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = C.ink;
    g.fillRect(w * 0.2, h * 0.82, w * 0.6, h * 0.025);
  },
};

const cache = new Map<string, THREE.CanvasTexture>();

/** A canvas texture for one piece, sized to its aspect ratio. */
export function paintArt(kind: ArtKind, aspect: number): THREE.CanvasTexture {
  const key = `${kind}:${aspect.toFixed(2)}`;
  const cached = cache.get(key);
  if (cached) return cached;

  // The sign carries small type, so it gets twice the resolution.
  const w = kind === "sign" ? 1024 : 512;
  const h = Math.round(w / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  const rand = seeded(kind.length * 131 + Math.round(aspect * 100));

  if (kind === "sign") {
    g.fillStyle = "#17171b";
    g.fillRect(0, 0, w, h);
  } else {
    painters[kind](g, w, h, rand);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  cache.set(key, texture);
  return texture;
}

/**
 * Draws the Forge wordmark (public/forgetext.svg, white) onto a sign texture.
 * The SVG has no fixed size, so it's given one before rasterising.
 */
export async function drawSign(texture: THREE.CanvasTexture): Promise<void> {
  const canvas = texture.image as HTMLCanvasElement;
  const g = canvas.getContext("2d");
  if (!g || canvas.dataset.signed) return;
  canvas.dataset.signed = "1";

  const w = canvas.width;
  const h = canvas.height;
  const svg = (await (await fetch("/forgetext.svg")).text()).replace(
    /width="100%" height="100%"/,
    'width="1930" height="710"'
  );
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const logoH = h * 0.46;
    const logoW = logoH * (193 / 71);
    g.drawImage(img, (w - logoW) / 2, h * 0.16, logoW, logoH);
  } finally {
    URL.revokeObjectURL(url);
  }

  // Ember rule and a quiet strapline under the wordmark
  g.fillStyle = C.ember;
  g.fillRect(w * 0.44, h * 0.7, w * 0.12, Math.max(2, h * 0.025));
  const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
  g.font = `500 ${Math.round(h * 0.085)}px ${mono}`;
  g.fillStyle = "rgba(255,255,255,0.6)";
  g.textAlign = "center";
  g.fillText("A WORKSPACE FOR PEOPLE WHO BUILD", w / 2, h * 0.86);
  texture.needsUpdate = true;
}
