import type { Card } from "scryfall-api";

export function sortCards(a: Card, b: Card) {
  const dateDiff = +a.released_at - +b.released_at;
  if (dateDiff !== 0) return dateDiff;
  const setDiff = a.set.localeCompare(b.set);
  if (setDiff !== 0) return setDiff;
  // return a.collector_number.localeCompare(b.collector_number);
  const aParts = parseGroupings(a.collector_number);
  const bParts = parseGroupings(b.collector_number);
  // if(aParts[0] === 'JMP-' || bParts[0] === 'JMP-') console.log(aParts, bParts);
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const ap = aParts[i];
    const bp = bParts[i];

    // A is out of parts, so is shorter, goes first
    if (ap === undefined) return -1;

    // B is out of parts, so is shorter, goes first
    if (bp === undefined) return 1;

    if (typeof ap === "string" || typeof bp === "string") {
      // If at least one is non-numeric, let's use default sorting
      const res = ap.toString(10).localeCompare(bp.toString(10));
      if (res !== 0) return res;
    } else {
      // Both are numbers
      const res = ap - bp;
      if (res !== 0) return res;
    }
  }
  return 0;
}

function parseGroupings(n: string) {
  const parts = [];
  const re = /\d+/g;
  let match = re.exec(n);
  let lastIndex = 0;
  while (match) {
    if (match.index > lastIndex) parts.push(n.slice(lastIndex, match.index));
    parts.push(parseInt(match[0], 10));
    lastIndex = match.index + match[0].length;
    match = re.exec(n);
  }
  if (lastIndex < n.length) {
    parts.push(n.slice(lastIndex));
  }
  return parts;
}

export function toPrintId(c: Card, finish: string) {
  return foilText(c, finish) + toCardId(c);
}
export function toCardId(c: Card) {
  const collNumFixed = c.collector_number.replace("★", "");
  return `${c.set.toUpperCase()} ${collNumFixed}`;
}
export function foilText(card: Card, finish: string) {
  const promoTypeFoils = card.promo_types?.find((x) =>
    x.includes("foil")
  ) as string;
  switch (promoTypeFoils) {
    case "surgefoil":
      return "SURGE ";
    case "galaxyfoil":
      return "GALAXY ";
    case "ripplefoil":
      return "RIPPLE ";
    default:
      return finish === "nonfoil" ? "" : `${finish.toUpperCase()} `;
  }
}