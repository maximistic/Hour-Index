/* The whole system is one number: the hour, on a 6 → 30 axis (dawn → next dawn).
   paletteAt(hour) interpolates every token between four designed anchor hours. */

export type RGB = [number, number, number];
export const COLOR_KEYS = ["bg", "surface", "ink", "muted", "accent", "accent2", "sky"] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];
export type Palette = Record<ColorKey, RGB> & { wght: number; soft: number };
/** `hold`: fraction of the segment *starting* at this stop during which the look stays put. */
export type Stop = Palette & { h: number; name: Period; hold: number };
export type Period = "Dawn" | "Day" | "Dusk" | "Night";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const hex2rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
export const rgb2hex = (a: RGB) =>
  "#" + a.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
export const luminance = ([r, g, b]: RGB) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const rgbCss = (c: RGB) => `rgb(${c.map(Math.round).join(" ")})`;

type Hex = Record<ColorKey, string>;
const DAWN: Hex = { bg: "#F6E3D3", surface: "#FBEFE4", ink: "#3A2230", muted: "#8A6B6B", accent: "#E4572E", accent2: "#F2A65A", sky: "#F4A98F" };
const DAY: Hex = { bg: "#F4F0E6", surface: "#FFFBF2", ink: "#1E2A24", muted: "#5F6B59", accent: "#2F6F4F", accent2: "#E9B949", sky: "#8FC9F0" };
const DUSK: Hex = { bg: "#2B1B3D", surface: "#3A2650", ink: "#FBE9DC", muted: "#C3A7BC", accent: "#FF7A59", accent2: "#FFC15E", sky: "#5B3A7A" };
const NIGHT: Hex = { bg: "#0E1220", surface: "#161C30", ink: "#E8ECF8", muted: "#8F9ABA", accent: "#7AA2FF", accent2: "#F7C873", sky: "#05070F" };

const stop = (h: number, name: Period, c: Hex, wght: number, soft: number, hold = 0): Stop => ({
  h, name, wght, soft, hold,
  ...(Object.fromEntries(COLOR_KEYS.map((k) => [k, hex2rgb(c[k])])) as Record<ColorKey, RGB>),
});

export const STOPS: Stop[] = [
  stop(6, "Dawn", DAWN, 400, 60),
  // Day holds until ~14:45, then turns quickly: a slow cream → purple blend is muddy and low-contrast.
  stop(12, "Day", DAY, 620, 0, 0.45),
  stop(18, "Dusk", DUSK, 450, 80),
  stop(24, "Night", NIGHT, 320, 100),
  stop(30, "Dawn", DAWN, 400, 60),
];

const relLum = (c: RGB) => {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
/** WCAG contrast ratio, 1–21. */
export const contrast = (a: RGB, b: RGB) => {
  const x = relLum(a), y = relLum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** Nudge `fg` toward black or white (whichever the background allows) until it reaches `min`. */
function ensureContrast(fg: RGB, bg: RGB, min: number): RGB {
  if (contrast(fg, bg) >= min) return fg;
  const end: RGB = relLum(bg) > 0.179 ? [0, 0, 0] : [255, 255, 255];
  const mix = (t: number) => fg.map((v, i) => lerp(v, end[i], t)) as RGB;
  let lo = 0, hi = 1;
  for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (contrast(mix(m), bg) >= min) hi = m; else lo = m; }
  return mix(hi);
}

export function paletteAt(h: number): Palette {
  let i = 0;
  while (i < STOPS.length - 2 && h >= STOPS[i + 1].h) i++;
  const a = STOPS[i], b = STOPS[i + 1];
  const raw = clamp((h - a.h) / (b.h - a.h), 0, 1);
  const t = smooth(clamp((raw - a.hold) / (1 - a.hold), 0, 1));
  const out = { wght: lerp(a.wght, b.wght, t), soft: lerp(a.soft, b.soft, t) } as Palette;
  for (const k of COLOR_KEYS) out[k] = a[k].map((v, n) => lerp(v, b[k][n], t)) as RGB;
  // Whatever the mix does to the background, text must stay readable on it.
  out.ink = ensureContrast(out.ink, out.bg, 9);
  out.muted = ensureContrast(out.muted, out.bg, 4.6);
  out.accent = ensureContrast(out.accent, out.bg, 3); // buttons and focus rings are UI: 3:1
  return out;
}

/** Fold any hour into the [6, 30) axis the palette lives on. */
export const norm = (h: number) => {
  h = ((h % 24) + 24) % 24;
  return h < 6 ? h + 24 : h;
};

export const periodOf = (h: number): Period => {
  const x = ((h % 24) + 24) % 24;
  return x >= 5 && x < 10 ? "Dawn" : x >= 10 && x < 16 ? "Day" : x >= 16 && x < 20.5 ? "Dusk" : "Night";
};

export const fmt = (h: number) => {
  const x = ((h % 24) + 24) % 24;
  const m = Math.round((x % 1) * 60);
  const hh = Math.floor(x) + (m === 60 ? 1 : 0);
  return `${pad2(hh % 24)}:${pad2(m % 60)}`;
};

/** Tokens that are exposed to people (name + role), in ledger order. */
export const TOKENS: { css: string; key: ColorKey; name: string; role: string }[] = [
  { css: "--bg", key: "bg", name: "Paper", role: "The page itself" },
  { css: "--surface", key: "surface", name: "Cup", role: "Cards and panels" },
  { css: "--ink", key: "ink", name: "Espresso", role: "Text and strong shapes" },
  { css: "--muted", key: "muted", name: "Steam", role: "Secondary text" },
  { css: "--accent", key: "accent", name: "Signal", role: "Action and emphasis" },
  { css: "--accent2", key: "accent2", name: "Glow", role: "Light sources, highlights" },
];

export function exportCss(h: number, p: Palette) {
  return (
    `:root { /* ${fmt(h)} · ${periodOf(h)} */\n` +
    TOKENS.map((t) => `  ${t.css}: ${rgb2hex(p[t.key])};`).join("\n") +
    `\n  --font-weight-display: ${Math.round(p.wght)};\n  --font-softness: ${Math.round(p.soft)};\n}`
  );
}
