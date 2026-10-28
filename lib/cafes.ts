import type { Period } from "./palette";

export type Cafe = {
  name: string; hood: string; period: Period; peak: number; open: [number, number];
  line: string; long: string; sig: string; roast: string; mood: string;
};

export const CAFES: Cafe[] = [
  { name: "Saltgrain", hood: "Harbour Street", period: "Dawn", peak: 6.5, open: [5.5, 11], line: "Bakery-café where the first light hits the tide gauge.", long: "Run by two sisters and a very old oven. Saltgrain opens before the ferries and sells out of cardamom buns by nine. Every table faces the water; nobody talks before the second cup.", sig: "Cardamom bun + cortado", roast: "Light · Ethiopian natural", mood: "Quiet, gulls, wet rope" },
  { name: "Paper Lantern", hood: "Old Town", period: "Dawn", peak: 9, open: [8, 15], line: "Hojicha and tamago toast under a ceiling of folded lamps.", long: "A narrow room with sixty paper lanterns and one communal table. The menu is short, the tea is roasted in-house, and the playlist has not repeated a track since 2019.", sig: "Hojicha latte + egg toast", roast: "Tea-forward · Roasted hojicha", mood: "Warm, papery, unhurried" },
  { name: "Noon Atlas", hood: "Cartographers' Row", period: "Day", peak: 12.5, open: [11, 17], line: "Lunch counter for people who still print their maps.", long: "Walls of unframed charts and a counter lit like a drafting table. Fast, precise, and slightly obsessive — the espresso tonic is measured to the gram, the focaccia to the minute.", sig: "Espresso tonic + olive focaccia", roast: "Medium · Colombian washed", mood: "Sharp, bright, efficient" },
  { name: "The Greenhouse", hood: "Glass Quarter", period: "Day", peak: 15, open: [13, 19], line: "Afternoon light, filtered through three hundred plants.", long: "A Victorian glasshouse turned café. The afternoon sun does most of the interior design. Lemonade comes with a sprig of whatever is growing nearest your table.", sig: "Tarragon lemonade + flat white", roast: "Medium-light · Kenyan", mood: "Green, slow, dappled" },
  { name: "Vesper", hood: "Terrace Hill", period: "Dusk", peak: 18.5, open: [16, 23], line: "Orange-peel espresso as the harbour lights come on.", long: "The city's unofficial sunset appointment. Vesper stacks its terrace in tiers so everyone gets the horizon. Order the almond cake before the sky turns, and stay after.", sig: "Orange-peel espresso + almond cake", roast: "Medium-dark · Brazilian", mood: "Golden, social, wistful" },
  { name: "Low Tide Radio", hood: "Dockside", period: "Night", peak: 23, open: [20, 26], line: "Dark roast, vinyl hour, and a chocolate-salt cookie at midnight.", long: "A listening café in a former harbour-master's office. The owner plays one record a night, front to back, no talking. The last order is whenever the album ends.", sig: "Dark roast + chocolate-salt cookie", roast: "Dark · Sumatran", mood: "Hushed, analog, nocturnal" },
];

export const isOpen = (c: Cafe, h: number) => {
  const x = ((h % 24) + 24) % 24;
  return (x >= c.open[0] && x < c.open[1]) || (x + 24 >= c.open[0] && x + 24 < c.open[1]);
};
