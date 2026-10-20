export type OnboardingSlideData = {
  key: string;
  image: string;
  location: string;
  headline: string;
  body: string;
};

// Sample photos from Unsplash.
export const slides: OnboardingSlideData[] = [
  {
    key: "find",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1080&q=80",
    location: "Whistler, BC",
    headline: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  {
    key: "describe",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1080&q=80",
    location: "Tulum, Mexico",
    headline: "Describe it in one sentence",
    body: "Type something like “quiet beach bungalow under $300 a night” and roam ranks the stays that fit.",
  },
  {
    key: "ask",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1080&q=80",
    location: "Emerald Lake, BC",
    headline: "Ask anything about a stay",
    body: "Check-in times, pets, cancellations. Get answers straight from the stay’s own rules and policies.",
  },
];
