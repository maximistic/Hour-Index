"use client";
import { useState } from "react";

type SliderProps = { label: string; id: string; min: number; max: number; v: number; set: (n: number) => void };

function Slider({ label, id, min, max, v, set }: SliderProps) {
  return (
    <label htmlFor={id}>{label} <output>{v}</output>
      <input id={id} type="range" min={min} max={max} value={v} onChange={(e) => set(+e.target.value)} />
    </label>
  );
}

/** The type playground: four variable axes on one serif. */
export function Specimen() {
  const [wght, setWght] = useState(500);
  const [opsz, setOpsz] = useState(144);
  const [soft, setSoft] = useState(0);
  const [wonk, setWonk] = useState(false);
  const axes = { "--w": wght, "--o": opsz, "--s": soft, "--k": wonk ? 1 : 0 } as React.CSSProperties;

  return (
    <div className="type-grid">
      <div className="specimen" data-reveal><span style={axes} aria-label="Aa">Aa</span></div>
      <div className="controls" data-reveal>
        <Slider label="Weight" id="s-wght" min={100} max={900} v={wght} set={setWght} />
        <Slider label="Optical size" id="s-opsz" min={9} max={144} v={opsz} set={setOpsz} />
        <Slider label="Softness" id="s-soft" min={0} max={100} v={soft} set={setSoft} />
        <label className="check"><input type="checkbox" checked={wonk} onChange={(e) => setWonk(e.target.checked)} /> Wonk <small>(quirky leaning forms)</small></label>
        <p className="note">Fraunces for stories. Instrument Sans for everything that needs to be understood quickly.</p>
      </div>
    </div>
  );
}
