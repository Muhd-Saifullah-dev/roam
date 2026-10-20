import { amenities, type AmenityKey } from "../../data/amenities";
import { regionNames, stays, type StayType, type Vibe } from "../../data/stays";

// Reads a guest's one-sentence search into hard constraints (filters) and soft
// terms (ranking). Every value is parsed in code. This stands in for the GROQ
// filter + embeddings split until Sanity search is wired.

export type Place = { label: string; city?: string; region?: string };

export type ParsedQuery = {
  text: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  types: StayType[];
  amenities: AmenityKey[];
  pets: boolean;
  places: Place[];
  /** Words left after the constraints, for ranking. */
  softTerms: string[];
  /** Vibes the soft terms name ("peaceful" → quiet). */
  vibes: Vibe[];
};

const typeSynonyms: Record<StayType, string[]> = {
  cabin: ["cabin", "cabins", "lodge", "a frame", "aframe", "chalet", "log cabin", "mountain house"],
  beach: ["beach", "beach house", "beachfront", "oceanfront", "seaside", "coastal", "by the ocean", "by the sea"],
  city: ["city", "apartment", "apt", "loft", "condo", "flat", "downtown", "urban", "brownstone", "high rise", "penthouse"],
  villa: ["villa", "villas", "mansion", "estate"],
};

const vibeSynonyms: Record<Vibe, string[]> = {
  quiet: ["quiet", "peaceful", "calm", "tranquil", "relaxing", "serene"],
  cozy: ["cozy", "cosy", "snug", "warm", "homey"],
  secluded: ["secluded", "private", "remote", "isolated", "hidden", "off grid"],
  romantic: ["romantic", "couple", "couples", "honeymoon", "anniversary", "getaway"],
  family: ["family", "kids", "kid friendly", "children", "family friendly"],
  lively: ["lively", "nightlife", "vibrant", "fun", "bars", "music"],
  walkable: ["walkable", "central", "walking distance", "close to everything"],
  views: ["view", "views", "scenic", "ocean view", "mountain view", "sunset", "skyline"],
  modern: ["modern", "contemporary", "sleek", "stylish"],
  rustic: ["rustic", "charming", "classic", "log", "historic"],
  luxury: ["luxury", "luxurious", "upscale", "high end", "fancy", "lavish"],
};

const petPhrases = ["pet friendly", "pets allowed", "pets ok", "pets", "pet", "dog friendly", "dogs", "dog", "cats", "cat", "puppy"];

const stopWords = new Set(
  ("a an the with and or in on at near by for of to from per night nights a night stay stays place places house home " +
    "rental rentals something somewhere i we me my our us want need looking look find show that has have is are " +
    "allowed allows friendly some any good nice great very really please trip weekend")
    .split(" "),
);

// Places come from the data, so a new city in stays is searchable at once.
const placeIndex: { phrase: string; place: Place }[] = [
  ...[...new Set(stays.map((s) => s.city))].map((city) => ({ phrase: city.toLowerCase(), place: { label: city, city } })),
  ...Object.entries(regionNames).map(([region, name]) => ({ phrase: name.toLowerCase(), place: { label: name, region } })),
  { phrase: "nyc", place: { label: "New York", region: "NY" } },
  { phrase: "socal", place: { label: "California", region: "CA" } },
];

/** Lowercase, spaces for punctuation (keeps $ and digits), single spaces. */
function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9$]+/g, " ").trim()} `;
}

/**
 * Finds `phrase` as whole words in `text` (both normalized). On a hit, blanks it
 * out so it isn't matched again or left over as a soft term.
 */
function take(state: { text: string }, phrase: string) {
  const needle = ` ${phrase} `;
  if (!state.text.includes(needle)) return false;
  state.text = state.text.replace(needle, " ".repeat(needle.length - 1) + " ");
  return true;
}

function takeAny(state: { text: string }, phrases: readonly string[]) {
  // Longest first, so "beach house" wins over "beach".
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  let hit = false;
  for (const p of sorted) if (take(state, p)) hit = true;
  return hit;
}

function parsePrice(raw: string, parsed: ParsedQuery): string {
  let text = raw;
  const num = (s: string) => Number(s.replace(/,/g, ""));
  const cut = (m: RegExpMatchArray) => {
    text = text.replace(m[0], " ");
  };

  const range =
    text.match(/\$(\d[\d,]{1,5})\s*(?:-|–|to)\s*\$?(\d[\d,]{1,5})/) ??
    text.match(/between\s+\$?(\d[\d,]{1,5})\s+(?:and|to)\s+\$?(\d[\d,]{1,5})/);
  if (range) {
    const [a, b] = [num(range[1]!), num(range[2]!)];
    parsed.minPrice = Math.min(a, b);
    parsed.maxPrice = Math.max(a, b);
    cut(range);
  }

  const max = text.match(/(?:under|below|less than|max(?:imum)?|up to|no more than|cheaper than|within|<)\s*\$?(\d[\d,]{1,5})/);
  // Without a $, small numbers are more likely guests ("under 4 people").
  if (max && (max[0].includes("$") || num(max[1]!) >= 20)) {
    parsed.maxPrice = num(max[1]!);
    cut(max);
  }

  const min = text.match(/(?:over|above|more than|at least|min(?:imum)?|from)\s*\$(\d[\d,]{1,5})/);
  if (min) {
    parsed.minPrice = num(min[1]!);
    cut(min);
  }

  // A bare "$300" or "$300 a night" reads as a budget.
  const bare = text.match(/\$(\d[\d,]{1,5})/);
  if (bare && parsed.maxPrice === undefined) {
    parsed.maxPrice = num(bare[1]!);
    cut(bare);
  }
  return text;
}

function parseGuests(raw: string, parsed: ParsedQuery): string {
  const m =
    raw.match(/(?:for|sleeps|fits|family of|group of|party of)\s+(\d{1,2})(?:\s+(?:people|guests|adults|persons|of us|friends))?/) ??
    raw.match(/(\d{1,2})\s+(?:people|guests|adults|persons|friends)/);
  if (!m) return raw;
  const n = Number(m[1]);
  if (n >= 1 && n <= 30) parsed.guests = n;
  return raw.replace(m[0], " ");
}

export function parseQuery(text: string): ParsedQuery {
  const parsed: ParsedQuery = { text, types: [], amenities: [], pets: false, places: [], softTerms: [], vibes: [] };

  // Numbers first, on the raw lowercase text so "$200-$400" stays intact.
  let lower = ` ${text.toLowerCase()} `;
  lower = parsePrice(lower, parsed);
  lower = parseGuests(lower, parsed);

  const state = { text: normalize(lower) };
  // "a" and "per" before "night" go with the price; drop them with it.
  takeAny(state, ["a night", "per night", "night", "nightly", "nights"]);

  for (const { phrase, place } of placeIndex) {
    if (take(state, phrase) && !parsed.places.some((p) => p.label === place.label)) parsed.places.push(place);
  }

  // Amenities before types: "beachfront" is beach access, and a beach stay.
  for (const [key, a] of Object.entries(amenities) as [AmenityKey, (typeof amenities)[AmenityKey]][]) {
    const before = state.text;
    if (takeAny(state, a.synonyms)) {
      parsed.amenities.push(key);
      if (key === "beachAccess" && /beachfront|oceanfront/.test(before)) parsed.types.push("beach");
    }
  }

  for (const [type, phrases] of Object.entries(typeSynonyms) as [StayType, string[]][]) {
    if (takeAny(state, phrases) && !parsed.types.includes(type)) parsed.types.push(type);
  }

  if (takeAny(state, petPhrases)) parsed.pets = true;

  for (const [vibe, phrases] of Object.entries(vibeSynonyms) as [Vibe, string[]][]) {
    // Vibes stay in the text: they're soft terms, matched again when ranking.
    if (phrases.some((p) => state.text.includes(` ${p} `))) parsed.vibes.push(vibe);
  }

  parsed.softTerms = state.text
    .split(" ")
    .filter((w) => w.length > 1 && !stopWords.has(w) && !/^\d+$/.test(w));

  return parsed;
}

/** True when the query sets at least one filter. */
export function hasConstraints(q: ParsedQuery) {
  return (
    q.minPrice !== undefined ||
    q.maxPrice !== undefined ||
    q.guests !== undefined ||
    q.types.length > 0 ||
    q.amenities.length > 0 ||
    q.pets ||
    q.places.length > 0
  );
}
