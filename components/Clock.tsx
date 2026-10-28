"use client";
import { useRef } from "react";
import { hourStore } from "@/lib/hour-store";
import { useHourFrame, useManual } from "@/lib/hooks";
import { fmt, periodOf } from "@/lib/palette";
import { toast } from "./Toast";

const R = 40;
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2, r1 = i % 6 === 0 ? 27 : 31, r2 = 35;
  return { x1: 50 + r1 * Math.cos(a), y1: 50 + r1 * Math.sin(a), x2: 50 + r2 * Math.cos(a), y2: 50 + r2 * Math.sin(a) };
});

/** The control for the one number that drives everything. Noon is at the top. */
export function Clock() {
  const dial = useRef<SVGSVGElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const time = useRef<HTMLElement>(null);
  const period = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);
  const manual = useManual();

  useHourFrame((h) => {
    const ang = ((h - 12) / 24) * Math.PI * 2 - Math.PI / 2;
    dot.current?.setAttribute("cx", (50 + R * Math.cos(ang)).toFixed(2));
    dot.current?.setAttribute("cy", (50 + R * Math.sin(ang)).toFixed(2));
    if (time.current) time.current.textContent = fmt(h);
    if (period.current) period.current.textContent = periodOf(h);
    dial.current?.setAttribute("aria-valuenow", (h % 24).toFixed(1));
    dial.current?.setAttribute("aria-valuetext", `${fmt(h)}, ${periodOf(h)}`);
  });

  const fromPointer = (e: React.PointerEvent) => {
    const r = dial.current!.getBoundingClientRect();
    const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    return (((ang + Math.PI / 2) / (Math.PI * 2)) * 24 + 12 + 24) % 24;
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 3 : 0.5, cur = hourStore.current();
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); hourStore.set(cur + step, true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); hourStore.set(cur - step, true); }
  };
  const now = () => {
    const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    hourStore.set(h);
    toast(`Your hour — ${fmt(h)}`);
  };

  return (
    <aside className="clock" aria-label="Time of day control">
      <svg ref={dial} id="dial" viewBox="0 0 100 100" role="slider" tabIndex={0} aria-label="Hour of day"
        aria-valuemin={0} aria-valuemax={24} aria-valuenow={6}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); hourStore.set(fromPointer(e), true); }}
        onPointerMove={(e) => { if (dragging.current) hourStore.set(fromPointer(e), true); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        onKeyDown={onKey}>
        <circle className="d-ring" cx="50" cy="50" r="40" />
        <g className="d-ticks">{TICKS.map((t, i) => <line key={i} {...t} />)}</g>
        <circle ref={dot} className="d-hand-dot" cx="50" cy="10" r="7" />
      </svg>
      <div className="c-read">
        <b ref={time}>06:00</b>
        <span ref={period}>Dawn</span>
        <div className="c-btns">
          <button className={manual ? undefined : "on"} aria-pressed={!manual} title="Let scrolling control the hour"
            onClick={() => { hourStore.auto(); toast("Scrolling controls the hour"); }}>Auto</button>
          <button onClick={now} title="Jump to your local time">Now</button>
        </div>
      </div>
    </aside>
  );
}
