import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { CleaningScene, CLEANING_FRAMES } from "./scenes/CleaningScene";
import { ConditionerScene, CONDITIONER_FRAMES } from "./scenes/ConditionerScene";
import { MistakesScene, MISTAKES_FRAMES } from "./scenes/MistakesScene";
import { OutroScene, OUTRO_FRAMES } from "./scenes/OutroScene";
import { COLORS } from "./theme";

export type LeatherCareProps = {
  readonly sfxVolume: number;
  readonly ambientVolume: number;
  readonly showOutroCTA: boolean;
};

export const leatherCareDuration = (props: LeatherCareProps) =>
  CLEANING_FRAMES + MISTAKES_FRAMES + CONDITIONER_FRAMES + (props.showOutroCTA ? OUTRO_FRAMES : 0);

export const LeatherCare: React.FC<LeatherCareProps> = ({ sfxVolume, ambientVolume, showOutroCTA }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Series>
        <Series.Sequence name="Hook + steps 1–4" durationInFrames={CLEANING_FRAMES} premountFor={fps}>
          <CleaningScene sfxVolume={sfxVolume} ambientVolume={ambientVolume} />
        </Series.Sequence>
        <Series.Sequence name="3 mistakes" durationInFrames={MISTAKES_FRAMES} premountFor={fps}>
          <MistakesScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="Step 5 — Leather Star" durationInFrames={CONDITIONER_FRAMES} premountFor={fps}>
          <ConditionerScene sfxVolume={sfxVolume} ambientVolume={ambientVolume} />
        </Series.Sequence>
        {showOutroCTA ? (
          <Series.Sequence name="Outro CTA" durationInFrames={OUTRO_FRAMES} premountFor={fps}>
            <OutroScene sfxVolume={sfxVolume} />
          </Series.Sequence>
        ) : null}
      </Series>
    </AbsoluteFill>
  );
};
