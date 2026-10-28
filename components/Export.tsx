"use client";
import { useHour } from "@/lib/hooks";
import { hourStore } from "@/lib/hour-store";
import { exportCss, fmt, paletteAt } from "@/lib/palette";
import { copy } from "./Toast";

/** Snapshot of the system, re-derived each quarter-hour. */
export function Export() {
  const hour = useHour();
  const code = exportCss(hour, paletteAt(hour));
  return (
    <div className="export" data-reveal>
      <div>
        <h3 className="sub">Take the tokens with you</h3>
        <p className="note">Snapshot of the system at <strong>{fmt(hour)}</strong>. Drag the dial, then copy the hour you like.</p>
        <button className="btn primary" onClick={() => copy(exportCss(hourStore.current(), paletteAt(hourStore.current())), "Tokens copied to clipboard")}>
          Copy CSS variables
        </button>
      </div>
      <pre className="code" aria-label="Exported tokens">{code}</pre>
    </div>
  );
}
