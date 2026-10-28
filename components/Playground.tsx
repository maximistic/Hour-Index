"use client";
import { useState } from "react";
import { Emblem } from "./Emblem";

const DENSITY = { compact: ".7", cozy: "1", airy: "1.45" } as const;
const CORNERS = { sharp: ["2px", "2px"], soft: ["22px", "10px"], round: ["40px", "999px"] } as const;
type Density = keyof typeof DENSITY;
type Corners = keyof typeof CORNERS;

function Seg<T extends string>({ legend, options, value, onChange }: { legend: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="seg">
        {options.map((o) => (
          <button key={o} className={o === value ? "on" : undefined} aria-pressed={o === value} onClick={() => onChange(o)}>
            {o[0].toUpperCase() + o.slice(1)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** One card, driven entirely by two tokens. The code panel shows the tokens that produce what you see. */
export function Playground() {
  const [density, setDensity] = useState<Density>("compact");
  const [corners, setCorners] = useState<Corners>("soft");
  const [rc, rt] = CORNERS[corners];

  return (
    <div className="playground" data-reveal>
      <div className="panel">
        <Seg legend="Density" options={["compact", "cozy", "airy"] as const} value={density} onChange={setDensity} />
        <Seg legend="Corners" options={["sharp", "soft", "round"] as const} value={corners} onChange={setCorners} />
        <pre className="code" aria-label="Component CSS">
          <span className="v">/* tokens */</span>{"\n"}
          <span className="k">--space-scale</span>: {DENSITY[density]};{"\n"}
          <span className="k">--radius-card</span>: {rc};{"\n"}
          <span className="k">--radius-control</span>: {rt};{"\n\n"}
          <span className="v">/* component */</span>{"\n"}
          {".card {\n  "}<span className="k">padding</span>{": calc(1.2rem * var(--space-scale));\n  "}
          <span className="k">border-radius</span>{": var(--radius-card);\n}\n.btn {\n  "}
          <span className="k">border-radius</span>{": var(--radius-control);\n}"}
        </pre>
      </div>

      <div className="stage" data-density={density} data-corners={corners}>
        <article className="c-card">
          <div className="c-top">
            <Emblem index={0} className="c-emblem" />
            <span className="c-badge"><i /> Open now</span>
          </div>
          <h4>Saltgrain</h4>
          <p>Harbour bakery-café. Cardamom bun, a very good cortado, and the sound of rope.</p>
          <div className="c-chips"><span>Dawn</span><span>Bakery</span><span>Harbour St.</span></div>
          <label className="c-field"><span>Reserve a window seat</span><input type="text" placeholder="Your name" /></label>
          <div className="c-actions">
            <button className="btn primary">Save to my day</button>
            <button className="btn ghost">Details</button>
          </div>
        </article>
      </div>
    </div>
  );
}
