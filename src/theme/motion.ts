// Animation durations in ms, so motion across the app feels related.
export const motion = {
  press: 120, // press scale
  fast: 150, // press, toggle, exits
  reflow: 200, // list items fading and moving into place
  base: 250, // segmented indicator, list entrances
  stagger: 40, // delay between list rows entering
} as const;
