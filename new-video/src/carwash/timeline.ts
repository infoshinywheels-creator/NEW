// Scene lengths in frames (30 fps). Tuned to the voiceover lines.
export const FPS = 30;

export const SCENES = {
  hook: 72, // "Ця щітка вже помила сотні машин до вашої."
  sand: 60, // "І весь їхній пісок — досі у ворсі."
  layers: 66, // "Кожен оберт — це мікроподряпини."
  swirls: 60, // "А на сонці — ось така павутинка."
  damage: 57, // "Ще й дзеркала, антени, диски."
  solution: 105, // "Ми миємо піною і окремою мікрофіброю. І приїдемо до вас."
  cta: 72, // "Перешліть тому, хто їздить на мийку щодня."
} as const;

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const sceneStart = (key: keyof typeof SCENES) => {
  let acc = 0;
  for (const k of Object.keys(SCENES) as (keyof typeof SCENES)[]) {
    if (k === key) return acc;
    acc += SCENES[k];
  }
  return acc;
};
