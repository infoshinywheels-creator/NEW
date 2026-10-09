# new-video

Remotion project. All editing follows `docs/MONTAGE_REGLAMENT.md` — read it before any work.

- Fonts required in `public/fonts/`: `InterTight-Bold.ttf`, `InterTight-Black.ttf`, `NeueMachina-Ultrabold.otf`. If any is missing, stop and ask the user to attach them.
- Source materials go in `public/materials/`.
- Visual references (if provided): `docs/reglament_reference/page-1.png` … `page-7.png`.

## Project overrides (take precedence over the reglament)

- **Brand: Shinywheels** (mobile car detailing, Koch Chemie). The reglament's IMIGO.AI palette and CTA variants do NOT apply — use Shinywheels brand colors (pending from user) and Shinywheels CTAs.
- **Spoken language: English.** Whisper: `language: "English"` (not Russian). Captions in English, UPPERCASE, per reglament.
- Everything else (fonts, caption style/timing, Whisper pipeline, sound, technical rules) follows the reglament.

## Brand assets & fonts (status)

- Palette (from logo): navy `#0A1C36`, deep `#12314F`, sky `#5AC4FF`, aqua `#8AE0FE`, ice `#E2F4FC`, yellow `#FFDB1F` — see `src/theme.ts`.
- Logo: `public/brand/shinywheels-logo.png` (background removed from the supplied image).
- User's brand fonts: Soyuz Grotesk (titles), Troika, FFF_HK, Stadium Display — files NOT yet provided. `src/fonts.ts` currently uses Inter Black/Bold as a placeholder; swap file paths there once the files are in `public/fonts/`.
- SFX are synthesized by `scripts/make-sfx.py` into `public/sfx/`.

## Render

`npx remotion render LeatherCare out/leather-care.mp4 --crf 16`
(in the cloud container add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`)
