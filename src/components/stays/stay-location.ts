import type { Stay } from "@/data/stays";

/** "Lake Arrowhead, CA" */
export function stayLocation(stay: Stay) {
  return `${stay.city}, ${stay.region}`;
}
