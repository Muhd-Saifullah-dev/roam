// Amenities a stay can list. Synonyms are the phrases a guest might type for each
// one; search matches them as whole words. Plain data, no React, so search runs in Node.
export const amenities = {
  hotTub: { label: "Hot tub", synonyms: ["hot tub", "hot tubs", "hottub", "jacuzzi", "spa", "whirlpool"] },
  pool: { label: "Pool", synonyms: ["pool", "swimming pool", "pools"] },
  fireplace: { label: "Fireplace", synonyms: ["fireplace", "fire place", "wood stove", "fire pit", "firepit"] },
  wifi: { label: "Wi-Fi", synonyms: ["wifi", "wi fi", "internet"] },
  kitchen: { label: "Kitchen", synonyms: ["kitchen", "full kitchen"] },
  parking: { label: "Parking", synonyms: ["parking", "garage", "free parking"] },
  workspace: { label: "Workspace", synonyms: ["workspace", "desk", "office", "work from home", "remote work"] },
  ac: { label: "Air conditioning", synonyms: ["ac", "a c", "air conditioning", "aircon"] },
  washer: { label: "Washer", synonyms: ["washer", "laundry", "washing machine"] },
  beachAccess: { label: "Beach access", synonyms: ["beach access", "on the beach", "beachfront", "oceanfront", "steps to the beach"] },
  gym: { label: "Gym", synonyms: ["gym", "fitness"] },
  bbq: { label: "BBQ grill", synonyms: ["bbq", "grill", "barbecue"] },
} as const;

export type AmenityKey = keyof typeof amenities;
