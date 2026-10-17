import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT_DISPLAY, FONT_TEXT } from "./theme";

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const CYRILLIC = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";

// Cyrillic-capable families (OFL, from @fontsource) for Ukrainian videos.
export const FONT_HEAD = "SW Head"; // Unbounded
export const FONT_BODY = "SW Body"; // Inter Tight

// PLACEHOLDER for the LeatherCare reel: Inter Black/Bold stand in until the brand
// font files (Soyuz Grotesk etc.) are added to public/fonts.
const FONT_FILES = [
  { family: FONT_DISPLAY, file: "fonts/Inter-Black.otf", weight: "900" },
  { family: FONT_TEXT, file: "fonts/Inter-Bold.otf", weight: "700" },
  ...(["700", "900"] as const).flatMap((w) => [
    { family: FONT_HEAD, file: `fonts/unbounded-latin-${w}-normal.woff2`, weight: w, unicodeRange: LATIN },
    { family: FONT_HEAD, file: `fonts/unbounded-cyrillic-${w}-normal.woff2`, weight: w, unicodeRange: CYRILLIC },
  ]),
  ...(["600", "700", "800"] as const).flatMap((w) => [
    { family: FONT_BODY, file: `fonts/inter-tight-latin-${w}-normal.woff2`, weight: w, unicodeRange: LATIN },
    { family: FONT_BODY, file: `fonts/inter-tight-cyrillic-${w}-normal.woff2`, weight: w, unicodeRange: CYRILLIC },
  ]),
];

export const loadFonts = () =>
  Promise.all(
    FONT_FILES.map((f) =>
      loadFont({
        family: f.family,
        url: staticFile(f.file),
        weight: f.weight,
        ...("unicodeRange" in f ? { unicodeRange: f.unicodeRange } : {}),
      }),
    ),
  );

// Start loading as soon as the bundle is evaluated, so every render tab has the
// fonts (loadFont delays rendering until they are ready).
export const fontsReady = loadFonts();
