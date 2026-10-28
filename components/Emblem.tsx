/* Each café mark is built from three primitives and the live tokens,
   so logos recolour with the hour and stay crisp at any size. */
const A = "var(--accent)", B = "var(--accent2)", I = "var(--ink)", G = "var(--bg)";
const wave = "M12 76q12-9 24 0t24 0 24 0 24 0";

const MARKS = [
  /* Saltgrain — sun on the tide */
  <>
    <circle cx="60" cy="66" r="32" fill={B} />
    <rect x="0" y="66" width="120" height="60" fill={G} />
    <g fill="none" stroke={A} strokeWidth="3.5" strokeLinecap="round">
      <path d={wave} />
      <path d={wave} transform="translate(0 14)" opacity=".7" />
      <path d={wave} transform="translate(0 28)" opacity=".4" />
    </g>
  </>,
  /* Paper Lantern */
  <>
    <rect x="44" y="18" width="32" height="9" rx="4" fill={I} />
    <rect x="34" y="26" width="52" height="70" rx="24" fill={A} />
    <path d="M60 26V96M48 28Q41 61 48 94M72 28Q79 61 72 94" fill="none" stroke={G} strokeWidth="2" opacity=".8" />
    <rect x="44" y="94" width="32" height="9" rx="4" fill={I} />
    <path d="M60 103v13" stroke={B} strokeWidth="3.5" strokeLinecap="round" />
  </>,
  /* Noon Atlas */
  <>
    <circle cx="60" cy="60" r="42" fill="none" stroke={I} strokeWidth="2.5" />
    <ellipse cx="60" cy="60" rx="18" ry="42" fill="none" stroke={I} strokeWidth="2" />
    <path d="M60 18V102M18 60H102" stroke={I} strokeWidth="2" />
    <circle cx="82" cy="38" r="11" fill={A} />
    <circle cx="60" cy="60" r="3.5" fill={B} />
  </>,
  /* The Greenhouse */
  <>
    <path d="M20 102V58L60 22l40 36v44Z" fill="none" stroke={I} strokeWidth="3" strokeLinejoin="round" />
    <path d="M60 22v80M20 80h80M40 40v62M80 40v62" stroke={I} strokeWidth="1.5" opacity=".5" />
    <path d="M60 102q-6-30 20-40 5 28-20 40Z" fill={A} />
    <circle cx="38" cy="66" r="6" fill={B} />
  </>,
  /* Vesper */
  <>
    <path d="M76 20A42 42 0 1 0 100 82 34 34 0 0 1 76 20Z" fill={B} />
    <path d="M36 30l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5Z" fill={A} />
    <circle cx="92" cy="40" r="3" fill={A} />
    <circle cx="84" cy="98" r="2.5" fill={I} />
  </>,
  /* Low Tide Radio — a record */
  <>
    <circle cx="60" cy="60" r="44" fill="none" stroke={I} strokeWidth="2" strokeDasharray="3 6" />
    <circle cx="60" cy="60" r="30" fill="none" stroke={B} strokeWidth="7" strokeDasharray="46 142" strokeLinecap="round" />
    <circle cx="60" cy="60" r="18" fill="none" stroke={I} strokeWidth="2" />
    <circle cx="60" cy="60" r="8" fill={A} />
  </>,
];

export function Emblem({ index, className }: { index: number; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {MARKS[index]}
    </svg>
  );
}
