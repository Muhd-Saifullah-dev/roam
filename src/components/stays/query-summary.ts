import { amenities } from "@/data/amenities";
import { stayTypes } from "@/data/stays";
import type { ParsedQuery } from "@/lib/search";

function priceLabel(q: ParsedQuery) {
  if (q.minPrice !== undefined && q.maxPrice !== undefined) return `$${q.minPrice}–$${q.maxPrice}`;
  if (q.maxPrice !== undefined) return `Under $${q.maxPrice}`;
  if (q.minPrice !== undefined) return `From $${q.minPrice}`;
  return undefined;
}

/**
 * What the search understood, in the order a guest would say it:
 * ["Cabin", "Under $300", "Pets OK", "Hot tub", "Quiet"]. Filters come first,
 * then the vibes that only rank.
 */
export function querySummary(q: ParsedQuery): string[] {
  const parts: string[] = [];
  for (const t of q.types) parts.push(stayTypes[t].label);
  for (const p of q.places) parts.push(p.label);
  const price = priceLabel(q);
  if (price) parts.push(price);
  if (q.guests !== undefined) parts.push(`${q.guests}+ guest${q.guests === 1 ? "" : "s"}`);
  if (q.pets) parts.push("Pets OK");
  for (const a of q.amenities) parts.push(amenities[a].label);
  for (const v of q.vibes) parts.push(v[0]!.toUpperCase() + v.slice(1));
  return parts;
}
