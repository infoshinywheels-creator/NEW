import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT_DISPLAY, FONT_TEXT } from "./theme";

// PLACEHOLDER: Inter Black/Bold stand in until the brand font files
// (Soyuz Grotesk etc.) are added to public/fonts — swap the `file` paths below.
const FONT_FILES = [
  { family: FONT_DISPLAY, file: "fonts/Inter-Black.otf", weight: "900" },
  { family: FONT_TEXT, file: "fonts/Inter-Bold.otf", weight: "700" },
];

export const loadFonts = () =>
  Promise.all(
    FONT_FILES.map((f) =>
      loadFont({ family: f.family, url: staticFile(f.file), weight: f.weight }),
    ),
  );

// Start loading as soon as the bundle is evaluated, so every render tab has the
// fonts (loadFont delays rendering until they are ready).
export const fontsReady = loadFonts();
