"use client";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export const CHAPTERS = [
  { id: "light", numeral: "I", label: "Light" },
  { id: "voice", numeral: "II", label: "Voice" },
  { id: "form", numeral: "III", label: "Form" },
  { id: "rhythm", numeral: "IV", label: "Rhythm" },
  { id: "catalogue", numeral: "V", label: "Catalogue" },
];

export function Bar() {
  return (
    <header className="bar">
      <a className="mark" href="#top" aria-label="The Hour Index, home"><span>Hour</span><i>/</i><span>Index</span></a>
      <nav aria-label="Chapters">
        {CHAPTERS.map((c) => <a key={c.id} href={`#${c.id}`}>{c.label}</a>)}
        {site.portfolioUrl && <a className="back" href={site.portfolioUrl}>← Portfolio</a>}
      </nav>
    </header>
  );
}

const RAIL = [{ id: "top", numeral: "0" }, ...CHAPTERS, { id: "colophon", numeral: "VI" }];

/** Progress rail: highlights whichever [data-chapter] crosses the middle of the viewport. */
export function Rail() {
  const [on, setOn] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setOn((e.target as HTMLElement).dataset.chapter!); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <ol className="rail" aria-hidden="true">
      {RAIL.map((r) => <li key={r.id} className={on === r.id ? "on" : undefined}>{r.numeral}</li>)}
    </ol>
  );
}
