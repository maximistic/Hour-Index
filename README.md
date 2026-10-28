# The Hour Index

A self-initiated design project, built to be linked from a portfolio: a design system told as a story. Six cafés in a fictional harbour city, and a set of tokens that change with the hour.

Next.js 16 (App Router) · React 19 · TypeScript · plain CSS custom properties. No animation or UI libraries.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Make it yours

- `lib/site.ts` — your name, role, a link back to your main portfolio, email and links (shown in the colophon and footer).
- `lib/cafes.ts` — the six café entries. `components/Emblem.tsx` — their marks.
- `lib/palette.ts` — the four anchor palettes. Everything between them is interpolated.

## How it works

One number, the hour, drives the whole page.

- `lib/hour-store.ts` holds it outside React and runs a single `requestAnimationFrame` loop that writes CSS variables to `:root`.
- `lib/palette.ts` interpolates colour, font weight and softness between four anchor hours, and guarantees text contrast at every hour in between.
- React subscribes at quarter-hour resolution (`lib/hooks.ts`); per-frame things (the dial, the swatches) write to the DOM directly.
