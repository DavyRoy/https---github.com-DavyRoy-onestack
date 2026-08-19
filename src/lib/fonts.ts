import { Unbounded } from "next/font/google";

// Unbounded — a soft, geometric, expressive display face with full Cyrillic
// support. Replaces Playfair Display: the old high-contrast serif read as
// "neon" once outlined in teal (WebkitTextStroke); Unbounded's even, rounded
// strokes stay clear and modern whether filled or outlined.
// Only latin + cyrillic are subset — the site copy is Russian/English only.
export const serif = Unbounded({
  weight: "600",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Unbounded has no italic cut; reuse the upright face where an "italic"
// wordmark was previously requested (only the nav logo) at a lighter weight
// so it still reads as a distinct, softer mark next to the bold headlines.
export const serifItalic = Unbounded({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
