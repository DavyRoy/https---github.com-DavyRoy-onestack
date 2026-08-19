import { Playfair_Display } from "next/font/google";

// DM Serif Display has no Cyrillic glyphs, so every Russian headline
// (the default locale) was silently falling back to a generic system
// serif. Playfair Display keeps the same high-contrast display-serif
// character but actually renders Cyrillic.
export const serif = Playfair_Display({
  weight: "500",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const serifItalic = Playfair_Display({
  weight: "500",
  style: "italic",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
