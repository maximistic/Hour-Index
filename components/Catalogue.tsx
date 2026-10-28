"use client";
import { useEffect, useRef, useState } from "react";
import { CAFES, isOpen } from "@/lib/cafes";
import { hourStore } from "@/lib/hour-store";
import { useHour } from "@/lib/hooks";
import { fmt } from "@/lib/palette";
import { Emblem } from "./Emblem";
import { toast } from "./Toast";

const FILTERS = ["All hours", "Dawn", "Day", "Dusk", "Night"] as const;

function Card({ i, open, onOpen }: { i: number; open: boolean; onOpen: () => void }) {
  const c = CAFES[i];
  const tilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 9).toFixed(2) + "deg");
    el.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5) * 9).toFixed(2) + "deg");
  };
  const reset = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <button className="card" data-open={open} onClick={onOpen} onPointerMove={tilt} onPointerLeave={reset}
      aria-label={`${c.name}, ${c.hood}. ${open ? "Open now." : "Closed."} Open details.`}>
      <span className="tile">
        <span className="status"><i /><em>{open ? "Open now" : "Closed"}</em></span>
        <Emblem index={i} />
      </span>
      <span className="meta"><span className="c-time">{fmt(c.peak)} · {c.period}</span><span className="c-hood">{c.hood}</span></span>
      <span className="c-name">{c.name}</span>
      <span className="c-line">{c.line}</span>
      <span className="go" aria-hidden="true">→</span>
    </button>
  );
}

function Detail({ i, onClose }: { i: number | null; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dlg.current!;
    if (i !== null && !d.open) d.showModal();
  }, [i]);

  const c = i === null ? null : CAFES[i];
  const segs = c ? (c.open[1] > 24 ? [[c.open[0], 24], [0, c.open[1] - 24]] : [c.open]) : [];
  return (
    <dialog ref={dlg} aria-labelledby="d-name" onClose={onClose}
      onClick={(e) => { if (e.target === dlg.current) dlg.current!.close(); }}>
      <form method="dialog"><button className="d-close" aria-label="Close">✕</button></form>
      {c && i !== null && (
        <div className="d-body">
          <div className="d-tile"><Emblem index={i} /></div>
          <div className="d-info">
            <p className="eyebrow">{c.hood} · {c.period}</p>
            <h3 id="d-name">{c.name}</h3>
            <p>{c.long}</p>
            <dl className="specs">
              <div><dt>Signature</dt><dd>{c.sig}</dd></div>
              <div><dt>Roast</dt><dd>{c.roast}</dd></div>
              <div><dt>Mood</dt><dd>{c.mood}</dd></div>
              <div><dt>Best at</dt><dd>{fmt(c.peak)}</dd></div>
            </dl>
            <p className="eyebrow" style={{ marginBottom: 0 }}>Open hours</p>
            <div className="day-bar">
              {segs.map(([a, b], k) => <i key={k} style={{ left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100}%` }} />)}
            </div>
            <div className="day-ticks"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
            <button className="btn primary d-visit" onClick={() => { dlg.current!.close(); hourStore.set(c.peak); toast(`Travelling to ${fmt(c.peak)}…`); }}>
              Visit at {fmt(c.peak)} →
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Catalogue() {
  const hour = useHour();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All hours");
  const [sel, setSel] = useState<number | null>(null);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter by time of day" data-reveal>
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "on" : undefined} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="cards">
        {CAFES.map((c, i) =>
          filter === "All hours" || filter === c.period ? <Card key={c.name} i={i} open={isOpen(c, hour)} onOpen={() => setSel(i)} /> : null,
        )}
      </div>
      <Detail i={sel} onClose={() => setSel(null)} />
    </>
  );
}
