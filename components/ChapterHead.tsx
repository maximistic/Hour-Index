/** Shared chapter opener (server component). */
export function ChapterHead({ numeral, kicker, title, shows, children }: { numeral: string; kicker: string; title: string; shows: string; children: React.ReactNode }) {
  return (
    <header className="chap-head" data-reveal>
      <span className="numeral" aria-hidden="true">{numeral}</span>
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        <p className="lead">{children}</p>
        <p className="shows"><b>Design note</b>{shows}</p>
      </div>
    </header>
  );
}
