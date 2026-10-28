/* A tiny external store for the hour. It lives outside React on purpose:
   the colour of the page changes ~60 times a second, and only a handful of
   things (the dial, the swatches, the CSS variables) need to hear about it.
   React subscribes at quarter-hour resolution via useSyncExternalStore. */
import { clamp, norm, paletteAt, rgbCss, rgb2hex, COLOR_KEYS, type Palette } from "./palette";

export type FrameListener = (hour: number, palette: Palette) => void;

const START = 6;
let cur = START;
let target = START;
let manual = false;
let reduced = false;
let raf = 0;
let quarter = Math.floor(START * 4);

const frames = new Set<FrameListener>();
const quarters = new Set<() => void>();
const modes = new Set<() => void>();

/* ---- Writing the system to the page ---- */
function paint(h: number, p: Palette) {
  const s = document.documentElement.style;
  for (const k of COLOR_KEYS) s.setProperty("--" + k, rgbCss(p[k]));
  s.setProperty("--line", `rgb(${p.ink.map(Math.round).join(" ")} / .16)`);
  s.setProperty("--wght", String(Math.round(p.wght)));
  s.setProperty("--soft", String(Math.round(p.soft)));
  // night = 1 around midnight, 0 through the day; the 1.4 / .15 shaping gives a longer dark plateau.
  const night = clamp(Math.cos(((h - 24) / 12) * Math.PI) * 1.4 - 0.15, 0, 1);
  s.setProperty("--night", night.toFixed(3));
  // sun and moon sit on opposite sides of one orbit
  const a = ((h - 6) / 24) * Math.PI * 2;
  s.setProperty("--sx", (50 - 42 * Math.cos(a)).toFixed(2) + "%");
  s.setProperty("--sy", (70 - 55 * Math.sin(a)).toFixed(2) + "%");
  s.setProperty("--mx", (50 + 42 * Math.cos(a)).toFixed(2) + "%");
  s.setProperty("--my", (70 + 55 * Math.sin(a)).toFixed(2) + "%");
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", rgb2hex(p.bg));
}

function render(h: number) {
  const p = paletteAt(h);
  paint(h, p);
  frames.forEach((f) => f(h, p));
  const q = Math.floor(h * 4);
  if (q !== quarter) {
    quarter = q;
    quarters.forEach((l) => l());
  }
}

function tick() {
  const d = target - cur;
  cur = Math.abs(d) < 0.002 || reduced ? target : cur + d * 0.075;
  render(cur);
  raf = cur === target ? 0 : requestAnimationFrame(tick);
}
const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
const setManual = (v: boolean) => { if (manual !== v) { manual = v; modes.forEach((l) => l()); } };

/* ---- Public API ---- */
export const hourStore = {
  /** Jump the day to `h`. Takes control away from scrolling until auto() is called. */
  set(h: number, instant = false) {
    setManual(true);
    target = norm(h);
    if (instant || reduced) { cur = target; render(cur); } else kick();
  },
  /** Give control back to scrolling. */
  auto() { setManual(false); hourStore.fromScroll(); },
  fromScroll() {
    if (manual) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    target = 6 + clamp(scrollY / Math.max(1, max), 0, 1) * 19;
    if (reduced) { cur = target; render(cur); } else kick();
  },
  current: () => cur,

  /** Per-frame subscription. Called immediately with the current state. */
  onFrame(cb: FrameListener) {
    frames.add(cb);
    cb(cur, paletteAt(cur));
    return () => { frames.delete(cb); };
  },
  /** Quarter-hour React snapshot. */
  subscribeQuarter(l: () => void) { quarters.add(l); return () => { quarters.delete(l); }; },
  getQuarter: () => quarter,
  getServerQuarter: () => Math.floor(START * 4),
  subscribeMode(l: () => void) { modes.add(l); return () => { modes.delete(l); }; },
  isManual: () => manual,

  /** Wire up scroll + resize + reduced-motion. Returns a teardown. */
  start() {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    reduced = mq.matches;
    const onMq = () => { reduced = mq.matches; };
    const onScroll = () => hourStore.fromScroll();
    mq.addEventListener("change", onMq);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    render(cur);
    hourStore.fromScroll();
    return () => {
      mq.removeEventListener("change", onMq);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      raf = 0;
    };
  },
};
