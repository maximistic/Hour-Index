"use client";
import { useRef } from "react";
import { hourStore } from "@/lib/hour-store";
import { useHourFrame } from "@/lib/hooks";
import { STOPS, TOKENS, luminance, paletteAt, pad2, rgb2hex } from "@/lib/palette";
import { copy, toast } from "./Toast";

/** Live swatches. Hex values are written straight to the DOM each frame — no React re-render. */
export function Ledger() {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = useRef("");
  useHourFrame((_, p) => {
    const hexes = TOKENS.map((t) => rgb2hex(p[t.key]));
    const joined = hexes.join();
    if (joined === last.current) return; // only touch the DOM when a hex changes
    last.current = joined;
    TOKENS.forEach((t, i) => {
      const b = refs.current[i];
      if (!b) return;
      b.querySelector(".hex")!.textContent = hexes[i];
      b.style.background = hexes[i];
      b.style.color = luminance(p[t.key]) < 0.5 ? "#fff" : "#111";
      b.style.borderColor = t.key === "bg" || t.key === "surface" ? "var(--line)" : "transparent";
    });
  });

  const init = paletteAt(6);
  return (
    <div className="ledger" data-reveal>
      {TOKENS.map((t, i) => (
        <button
          key={t.css}
          ref={(el) => { refs.current[i] = el; }}
          className="sw"
          style={{ background: rgb2hex(init[t.key]), color: luminance(init[t.key]) < 0.5 ? "#fff" : "#111" }}
          onClick={(e) => copy(e.currentTarget.querySelector(".hex")!.textContent!, `${t.css} copied`)}
        >
          <span className="hex">{rgb2hex(init[t.key])}</span>
          <b>{t.name}</b><code>{t.css}</code><small>{t.role}</small>
        </button>
      ))}
    </div>
  );
}

export function Stops() {
  return (
    <div className="stops" data-reveal>
      {STOPS.slice(0, 4).map((s) => (
        <button key={s.name} className="stop" onClick={() => { hourStore.set(s.h); toast(`Travelling to ${pad2(s.h % 24)}:00`); }}>
          <span className="bands">
            {(["bg", "accent", "accent2", "ink"] as const).map((k) => <i key={k} style={{ background: rgb2hex(s[k]) }} />)}
          </span>
          <span className="lbl"><b>{s.name}</b><small>{pad2(s.h % 24)}:00 · Jump here</small></span>
        </button>
      ))}
    </div>
  );
}
