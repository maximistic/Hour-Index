/* Server component. The skyline and stars are generated from a fixed seed,
   so the markup is identical on server and client. */
function buildSky() {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const back: { x: number; y: number; w: number; h: number }[] = [];
  const front: { x: number; y: number; w: number; h: number; awn: boolean }[] = [];
  const windows: { x: number; y: number }[] = [];

  for (let x = -20; x < 1460; ) {
    const w = 36 + rnd() * 54, h = 70 + rnd() * 120;
    back.push({ x, y: 260 - h, w, h });
    x += w * 0.8;
  }
  for (let x = -10; x < 1460; ) {
    const w = 44 + rnd() * 70, h = 30 + rnd() * 90, y = 260 - h;
    front.push({ x, y, w, h, awn: rnd() > 0.35 });
    for (let wy = y + 14; wy < 250; wy += 18)
      for (let wx = x + 10; wx < x + w - 10; wx += 16) if (rnd() > 0.55) windows.push({ x: wx, y: wy });
    x += w + 4 + rnd() * 10;
  }
  const stars = Array.from({ length: 90 }, () =>
    `${(rnd() * 100).toFixed(1)}vw ${(rnd() * 70).toFixed(1)}vh 0 ${rnd() > 0.85 ? 1.5 : 0.5}px rgba(255,255,255,${(0.4 + rnd() * 0.6).toFixed(2)})`,
  ).join(",");
  return { back, front, windows, stars };
}
const SKY = buildSky();
const f = (n: number) => +n.toFixed(1);

import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" data-chapter="top">
      <div className="sky" aria-hidden="true">
        <div className="stars" style={{ boxShadow: SKY.stars }} />
        <div className="orb sun" />
        <div className="orb moon" />
        <svg className="skyline" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice">
          <g fill="color-mix(in srgb, var(--ink) 16%, var(--bg))">
            {SKY.back.map((b, i) => <rect key={i} x={f(b.x)} y={f(b.y)} width={f(b.w)} height={f(b.h)} />)}
          </g>
          <g fill="color-mix(in srgb, var(--ink) 9%, var(--bg))">
            {SKY.front.map((b, i) => (
              <g key={i}>
                <rect x={f(b.x)} y={f(b.y)} width={f(b.w)} height={f(b.h)} />
                {b.awn && <rect x={f(b.x + b.w * 0.1)} y={f(b.y - 6)} width={f(b.w * 0.8)} height="6" rx="3" fill="var(--accent)" />}
              </g>
            ))}
          </g>
          <g fill="var(--accent2)" style={{ opacity: "calc(var(--night) * 1.1)" }}>
            {SKY.windows.map((w, i) => <rect key={i} x={f(w.x)} y={f(w.y)} width="6" height="8" rx="1" />)}
          </g>
          <rect x="0" y="250" width="1440" height="10" fill="var(--bg)" />
        </svg>
      </div>

      <div className="wrap hero-copy">
        <p className="eyebrow"><span className="dot" />A self-initiated design project by {site.name}</p>
        <h1 className="display">The Hour<br /><em>Index</em></h1>
        <p className="lede">Port Aurel is an invented café city, designed as a living system. Its colour, type, components and motion all change with the time of day — and you set the clock.</p>
        <ul className="explore" aria-label="How to explore">
          <li><b>Scroll</b> to let the day pass</li>
          <li><b>Drag the dial</b> to pick the hour</li>
          <li><b>Open a café</b> at the end</li>
        </ul>
        <a className="cta" href="#light">Start the day <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
