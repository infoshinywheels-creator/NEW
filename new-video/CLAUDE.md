# new-video

Remotion project. All editing follows `docs/MONTAGE_REGLAMENT.md` — read it before any work.

- Fonts required in `public/fonts/`: `InterTight-Bold.ttf`, `InterTight-Black.ttf`, `NeueMachina-Ultrabold.otf`. If any is missing, stop and ask the user to attach them.
- Source materials go in `public/materials/`.
- Visual references (if provided): `docs/reglament_reference/page-1.png` … `page-7.png`.

## Project overrides (take precedence over the reglament)

- **Brand: Shinywheels** (mobile car detailing, Koch Chemie). The reglament's IMIGO.AI palette and CTA variants do NOT apply — use Shinywheels brand colors (pending from user) and Shinywheels CTAs.
- **Spoken language: English.** Whisper: `language: "English"` (not Russian). Captions in English, UPPERCASE, per reglament.
- Everything else (fonts, caption style/timing, Whisper pipeline, sound, technical rules) follows the reglament.
