import { Catalogue } from "@/components/Catalogue";
import { ChapterHead } from "@/components/ChapterHead";
import { Bar, Rail } from "@/components/Chrome";
import { Clock } from "@/components/Clock";
import { Export } from "@/components/Export";
import { Hero } from "@/components/Hero";
import { Eases } from "@/components/Motion";
import { Ledger, Stops } from "@/components/Palette";
import { Playground } from "@/components/Playground";
import { Specimen } from "@/components/Specimen";
import { Toast } from "@/components/Toast";
import { site } from "@/lib/site";

const DECISIONS = [
  { n: "01", t: "Tokens over themes", p: "No “light mode” and “dark mode”. Colour, weight and softness are continuous values interpolated across a 24-hour axis, so every hour in between is a valid, designed state." },
  { n: "02", t: "Two typefaces, four axes", p: "Fraunces carries the voice and its optical-size, softness and wonk axes carry the mood. Instrument Sans handles UI. That's the entire type system." },
  { n: "03", t: "Generated emblems", p: "Each café mark is a small SVG built from three primitives and the live tokens, so logos recolour with the hour and stay crisp at any size." },
  { n: "04", t: "One number, no re-renders", p: "The hour lives in a tiny store outside React. A single animation frame writes CSS variables to the root; React only hears about it every quarter-hour. The page changes colour at 60fps without rendering a component." },
];

export default function Page() {
  return (
    <>
      <Bar />
      <Rail />

      <main id="top">
        <Hero />

        <section className="chapter" id="light" data-chapter="light">
          <div className="wrap">
            <ChapterHead numeral="I" kicker="Chapter one · Colour" title="Every café here is named for the light it keeps." shows="Colour is a curve, not a set of themes. Four anchor palettes are blended across the day, and text contrast is held above accessibility minimums at every hour between them.">
              Port Aurel has no single palette. It has four hours, and every colour in this system is a point on the line between them. The tokens below are alive — they are being mixed right now, as you read.
            </ChapterHead>
            <Ledger />
            <p className="note" data-reveal>Click any swatch to copy its current value.</p>
            <h3 className="sub" data-reveal>The four anchor hours</h3>
            <Stops />
          </div>
        </section>

        <section className="chapter" id="voice" data-chapter="voice">
          <div className="wrap">
            <ChapterHead numeral="II" kicker="Chapter two · Typography" title="A voice that is crisp at noon and soft at midnight." shows="One variable serif does the emotional work: weight and softness are tied to the hour. A second, plain sans keeps the interface legible.">
              One variable serif, four axes. By day the letterforms sharpen and gain weight; as night falls they round off and thin out. Try the axes yourself — the headline above is already doing this on its own.
            </ChapterHead>
            <Specimen />
            <ul className="scale" data-reveal>
              <li><span className="tag">Display<br /><small>Fraunces · 600 · clamp 56–192</small></span><p className="s-display">Last cup before the tide</p></li>
              <li><span className="tag">Heading<br /><small>Fraunces · 500 · 40</small></span><p className="s-head">The bakery opens when the gulls do.</p></li>
              <li><span className="tag">Body<br /><small>Instrument Sans · 400 · 18/1.6</small></span><p className="s-body">Steam on the windows, a cardamom bun cooling on the rack, and a city still deciding whether it&apos;s awake. This is the best seat in Port Aurel.</p></li>
              <li><span className="tag">Label<br /><small>Instrument Sans · 600 · 12 · +14%</small></span><p className="s-label">Open now · Harbour Street</p></li>
            </ul>
          </div>
        </section>

        <section className="chapter" id="form" data-chapter="form">
          <div className="wrap">
            <ChapterHead numeral="III" kicker="Chapter three · Components" title="The same café card, three ways to hold it." shows="Components hold no opinions. Density and corner radius are tokens, so one card can be compact and sharp or airy and round without any new styles.">
              Components don&apos;t carry opinions — tokens do. Change the density and the corner style and watch a single card, button and field rearrange themselves without a line of new code.
            </ChapterHead>
            <Playground />
          </div>
        </section>

        <section className="chapter" id="rhythm" data-chapter="rhythm">
          <div className="wrap">
            <ChapterHead numeral="IV" kicker="Chapter four · Motion" title="Everything moves the way coffee does." shows="Motion has a small vocabulary — three named easings, each with one job — so the interface feels consistent. It all steps down for anyone who prefers reduced motion.">
              Three easings, named after the three things a café does with liquid. Hover or tap a track to replay it. Motion collapses to a gentle fade if you&apos;ve asked your device for less.
            </ChapterHead>
            <Eases />
          </div>
        </section>

        <section className="chapter" id="catalogue" data-chapter="catalogue">
          <div className="wrap">
            <ChapterHead numeral="V" kicker="Chapter five · The catalogue" title="Six cafés, indexed by the hour they're best." shows="The system applied to a real interface: filters, a detail view and live open/closed states, all built from the same tokens.">
              Everything so far, in use. Each entry is built from the same tokens, so the city feels like one place even when it looks like six. Open one, then visit it — the whole system will travel to its hour.
            </ChapterHead>
            <Catalogue />
          </div>
        </section>

        <section className="chapter colophon" id="colophon" data-chapter="colophon">
          <div className="wrap">
            <ChapterHead numeral="VI" kicker="Colophon · How it was made" title="Closing time." shows="The decisions behind the project, and a way to take away the exact tokens for any hour you like.">
              A system is only a story if someone can pick it up and continue it. These are the decisions behind the Hour Index.
            </ChapterHead>

            <div className="decisions" data-reveal>
              {DECISIONS.map((d) => (
                <article key={d.n}><b>{d.n}</b><h4>{d.t}</h4><p>{d.p}</p></article>
              ))}
            </div>

            <Export />

            <div className="maker" data-reveal>
              <p className="eyebrow">About this project</p>
              <p className="maker-name">{site.name}</p>
              <p className="maker-role">{site.role}. The Hour Index is a self-initiated project exploring how a design system can respond to context, instead of switching between light and dark themes.</p>
              <div className="maker-links">
                {site.portfolioUrl && <a className="btn primary" href={site.portfolioUrl}>See more of my work</a>}
                {site.email && <a className="btn ghost" href={`mailto:${site.email}`}>Say hello</a>}
                {site.links.map((l) => <a key={l.href} className="btn ghost" href={l.href}>{l.label}</a>)}
              </div>
            </div>

            <footer className="foot">
              <p>Designed &amp; built by <strong>{site.name}</strong> · A fictional city, a real system.</p>
              <p>Next.js · React · TypeScript · Set in Fraunces &amp; Instrument Sans · No animation libraries.</p>
            </footer>
          </div>
        </section>
      </main>

      <Clock />
      <Toast />
    </>
  );
}
