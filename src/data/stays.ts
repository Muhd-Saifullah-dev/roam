import type { AmenityKey } from "./amenities";

// Local stand-in for Sanity property documents, shaped so the swap is mechanical.
// Photos are remote placeholder images.

export const stayTypes = {
  cabin: { label: "Cabin", plural: "Cabins" },
  beach: { label: "Beach", plural: "Beach" },
  city: { label: "City", plural: "City" },
  villa: { label: "Villa", plural: "Villas" },
} as const;

export type StayType = keyof typeof stayTypes;

/** Soft qualities. Search ranks by these; it never filters on them. */
export type Vibe =
  | "quiet"
  | "cozy"
  | "secluded"
  | "romantic"
  | "family"
  | "lively"
  | "walkable"
  | "views"
  | "modern"
  | "rustic"
  | "luxury";

export type Stay = {
  id: string;
  title: string;
  type: StayType;
  city: string;
  /** Two-letter state code. */
  region: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  petsAllowed: boolean;
  amenities: AmenityKey[];
  vibes: Vibe[];
  description: string;
  imageUrl: string;
};

/** State names for the codes used in `stays`, so "California" finds CA stays. */
export const regionNames: Record<string, string> = {
  CA: "California",
  TN: "Tennessee",
  FL: "Florida",
  MA: "Massachusetts",
  IL: "Illinois",
  NY: "New York",
  TX: "Texas",
};

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

export const stays: Stay[] = [
  {
    id: "lake-arrowhead-modern-cabin",
    title: "Modern Cabin with Hot Tub",
    type: "cabin",
    city: "Lake Arrowhead",
    region: "CA",
    pricePerNight: 280,
    rating: 4.9,
    reviewCount: 342,
    maxGuests: 6,
    bedrooms: 3,
    petsAllowed: true,
    amenities: ["hotTub", "fireplace", "wifi", "kitchen", "parking", "bbq"],
    vibes: ["quiet", "cozy", "modern", "views"],
    description:
      "A glass-fronted cabin among tall pines, with a cedar hot tub on the deck, a fire pit and a dog-friendly fenced yard. Ten minutes from the lake village.",
    imageUrl: photo("1600585154340-be6161a56a0c"),
  },
  {
    id: "big-bear-a-frame",
    title: "Secluded A-Frame in the Pines",
    type: "cabin",
    city: "Big Bear Lake",
    region: "CA",
    pricePerNight: 195,
    rating: 4.8,
    reviewCount: 218,
    maxGuests: 4,
    bedrooms: 2,
    petsAllowed: true,
    amenities: ["fireplace", "wifi", "kitchen", "parking"],
    vibes: ["secluded", "quiet", "cozy", "rustic", "romantic", "views"],
    description:
      "A classic A-frame at the end of a private road, with a wood stove, a loft bedroom under the beams, mountain views from the deck and trailheads right outside the door.",
    imageUrl: photo("1542718610-a1d656d1884c"),
  },
  {
    id: "gatlinburg-log-lodge",
    title: "Smoky Mountain Log Lodge",
    type: "cabin",
    city: "Gatlinburg",
    region: "TN",
    pricePerNight: 340,
    rating: 4.7,
    reviewCount: 511,
    maxGuests: 10,
    bedrooms: 5,
    petsAllowed: false,
    amenities: ["hotTub", "fireplace", "wifi", "kitchen", "parking", "bbq", "ac"],
    vibes: ["family", "views", "rustic"],
    description:
      "A big log lodge with mountain views from every porch, a hot tub, a game loft for the kids and room for the whole family.",
    imageUrl: photo("1510798831971-661eb04b3739"),
  },
  {
    id: "santa-cruz-oceanfront-bungalow",
    title: "Oceanfront Bungalow",
    type: "beach",
    city: "Santa Cruz",
    region: "CA",
    pricePerNight: 310,
    rating: 4.8,
    reviewCount: 187,
    maxGuests: 4,
    bedrooms: 2,
    petsAllowed: true,
    amenities: ["beachAccess", "wifi", "kitchen", "bbq", "parking"],
    vibes: ["quiet", "romantic", "views", "cozy"],
    description:
      "A small bungalow on the bluff with stairs down to a quiet cove. Watch the sunset over the bay from the deck. Dogs welcome on the beach.",
    imageUrl: photo("1499793983690-e29da59ef1c2"),
  },
  {
    id: "destin-gulf-beach-house",
    title: "Gulf Coast Beach House",
    type: "beach",
    city: "Destin",
    region: "FL",
    pricePerNight: 425,
    rating: 4.9,
    reviewCount: 402,
    maxGuests: 8,
    bedrooms: 4,
    petsAllowed: false,
    amenities: ["pool", "beachAccess", "wifi", "kitchen", "ac", "washer", "parking"],
    vibes: ["family", "lively", "views"],
    description:
      "A bright four-bedroom house steps from white sand, with a private pool, bunk room for the kids and a rooftop deck facing the Gulf.",
    imageUrl: photo("1520250497591-112f2f40a3f4"),
  },
  {
    id: "wellfleet-shingle-cottage",
    title: "Cape Cod Shingle Cottage",
    type: "beach",
    city: "Wellfleet",
    region: "MA",
    pricePerNight: 230,
    rating: 4.6,
    reviewCount: 96,
    maxGuests: 5,
    bedrooms: 3,
    petsAllowed: true,
    amenities: ["beachAccess", "wifi", "kitchen", "washer", "bbq"],
    vibes: ["quiet", "cozy", "rustic", "secluded"],
    description:
      "A weathered shingle cottage tucked behind the dunes, with an outdoor shower, a screened porch and a short sandy path to the bay beach.",
    imageUrl: photo("1518780664697-55e3ad937233"),
  },
  {
    id: "chicago-west-loop-loft",
    title: "Industrial Loft in the West Loop",
    type: "city",
    city: "Chicago",
    region: "IL",
    pricePerNight: 185,
    rating: 4.7,
    reviewCount: 263,
    maxGuests: 3,
    bedrooms: 1,
    petsAllowed: false,
    amenities: ["wifi", "kitchen", "workspace", "ac", "washer", "gym"],
    vibes: ["modern", "walkable", "lively"],
    description:
      "Exposed brick, timber beams and big factory windows, a block from Randolph Street's restaurants. Fast Wi-Fi and a real desk for work trips.",
    imageUrl: photo("1493809842364-78817add7ffb"),
  },
  {
    id: "brooklyn-brownstone-garden",
    title: "Brownstone Garden Apartment",
    type: "city",
    city: "Brooklyn",
    region: "NY",
    pricePerNight: 240,
    rating: 4.8,
    reviewCount: 154,
    maxGuests: 4,
    bedrooms: 2,
    petsAllowed: true,
    amenities: ["wifi", "kitchen", "workspace", "ac", "washer"],
    vibes: ["cozy", "walkable", "quiet"],
    description:
      "The garden floor of a tree-lined Park Slope brownstone, with a private backyard, a fireplace mantel full of books and Prospect Park two blocks away.",
    imageUrl: photo("1502672260266-1c1ef2d93688"),
  },
  {
    id: "austin-skyline-high-rise",
    title: "Downtown High-Rise with Skyline Views",
    type: "city",
    city: "Austin",
    region: "TX",
    pricePerNight: 165,
    rating: 4.5,
    reviewCount: 329,
    maxGuests: 2,
    bedrooms: 1,
    petsAllowed: false,
    amenities: ["pool", "wifi", "gym", "workspace", "ac", "parking"],
    vibes: ["modern", "lively", "walkable", "views"],
    description:
      "A 30th-floor one-bedroom with floor-to-ceiling windows over Lady Bird Lake, a rooftop pool and Rainey Street's live music a short walk away.",
    imageUrl: photo("1522708323590-d24dbb6b0267"),
  },
  {
    id: "palm-springs-desert-villa",
    title: "Desert Modern Villa with Pool",
    type: "villa",
    city: "Palm Springs",
    region: "CA",
    pricePerNight: 520,
    rating: 4.9,
    reviewCount: 211,
    maxGuests: 8,
    bedrooms: 4,
    petsAllowed: true,
    amenities: ["pool", "hotTub", "wifi", "kitchen", "ac", "parking", "bbq"],
    vibes: ["luxury", "modern", "quiet", "views"],
    description:
      "A mid-century villa behind a walled garden, with a saltwater pool and spa, mountain views and quiet nights under the desert stars.",
    imageUrl: photo("1613490493576-7fde63acd811"),
  },
  {
    id: "sonoma-vineyard-villa",
    title: "Hillside Villa above the Vineyards",
    type: "villa",
    city: "Sonoma",
    region: "CA",
    pricePerNight: 650,
    rating: 4.9,
    reviewCount: 138,
    maxGuests: 10,
    bedrooms: 5,
    petsAllowed: false,
    amenities: ["pool", "hotTub", "fireplace", "wifi", "kitchen", "parking"],
    vibes: ["luxury", "romantic", "views", "secluded"],
    description:
      "A stone villa on a private hilltop surrounded by vines, with an infinity pool, an outdoor fireplace and long dinners on the terrace.",
    imageUrl: photo("1600596542815-ffad4c1539a9"),
  },
  {
    id: "malibu-mediterranean-villa",
    title: "Mediterranean Villa near the Beach",
    type: "villa",
    city: "Malibu",
    region: "CA",
    pricePerNight: 890,
    rating: 4.8,
    reviewCount: 74,
    maxGuests: 12,
    bedrooms: 6,
    petsAllowed: false,
    amenities: ["pool", "beachAccess", "wifi", "kitchen", "gym", "ac", "parking"],
    vibes: ["luxury", "views", "family"],
    description:
      "A gated Mediterranean estate with ocean views, a pool terrace, a home gym and a private path down to the sand.",
    imageUrl: photo("1580587771525-78b9dba3b914"),
  },
];
