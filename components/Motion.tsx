"use client";
import { useRef } from "react";

const EASES = [
  { name: "Pour", curve: "cubic-bezier(.16,1,.3,1)", dur: 900, use: "Entrances, panels, anything arriving." },
  { name: "Steam", curve: "cubic-bezier(.45,0,.2,1)", dur: 1500, use: "Ambient change — the colour of the hour." },
  { name: "Clink", curve: "cubic-bezier(.34,1.56,.64,1)", dur: 520, use: "Small confirmations, toggles, taps." },
];

function Ease({ name, curve, dur, use }: (typeof EASES)[number]) {
  const el = useRef<HTMLButtonElement>(null);
  const ball = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const run = () => {
    const b = ball.current!, root = el.current!;
    clearTimeout(timer.current);
    b.style.transition = "none";
    root.classList.remove("play");
    void b.offsetWidth; // flush, so the transition restarts from the left
    b.style.transition = `left ${dur}ms ${curve}`;
    root.classList.add("play");
    timer.current = setTimeout(() => root.classList.remove("play"), dur + 500);
  };
  return (
    <button ref={el} className="ease" onPointerEnter={run} onClick={run}>
      <span className="e-name">{name}</span>
      <span className="e-spec">{curve.replace(/,/g, ", ")} · {dur}ms</span>
      <span className="track"><i ref={ball} className="ball" /></span>
      <span className="e-use">{use}</span>
    </button>
  );
}

export const Eases = () => (
  <div className="ease-grid" data-reveal>{EASES.map((e) => <Ease key={e.name} {...e} />)}</div>
);
