import type { Stay } from "../../data/stays";
import { hasConstraints, type ParsedQuery } from "./parse-query";

// Hard constraints filter; soft terms only rank (like GROQ filters + embeddings).

export type StayMatch = { stay: Stay; score: number };

function passes(stay: Stay, q: ParsedQuery) {
  if (q.maxPrice !== undefined && stay.pricePerNight > q.maxPrice) return false;
  if (q.minPrice !== undefined && stay.pricePerNight < q.minPrice) return false;
  if (q.guests !== undefined && stay.maxGuests < q.guests) return false;
  if (q.types.length > 0 && !q.types.includes(stay.type)) return false;
  if (q.amenities.some((a) => !stay.amenities.includes(a))) return false;
  if (q.pets && !stay.petsAllowed) return false;
  if (
    q.places.length > 0 &&
    !q.places.some((p) => (p.city ? stay.city === p.city : stay.region === p.region))
  ) {
    return false;
  }
  return true;
}

function score(stay: Stay, q: ParsedQuery) {
  const title = stay.title.toLowerCase();
  const description = stay.description.toLowerCase();
  let total = q.vibes.filter((v) => stay.vibes.includes(v)).length * 3;
  for (const term of q.softTerms) {
    if (title.includes(term)) total += 2;
    if (description.includes(term)) total += 1;
  }
  return total;
}

/**
 * Stays that meet every hard constraint, best soft match first, then by rating.
 * With no constraints, only stays that match a soft term come back.
 */
export function searchStays(all: Stay[], q: ParsedQuery): StayMatch[] {
  if (!q.text.trim()) return [];
  const filtered = all.filter((s) => passes(s, q)).map((stay) => ({ stay, score: score(stay, q) }));
  const results = hasConstraints(q) ? filtered : filtered.filter((m) => m.score > 0);
  return results.sort((a, b) => b.score - a.score || b.stay.rating - a.stay.rating);
}
