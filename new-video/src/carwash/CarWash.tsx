import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { HookScene, LayersScene, SandScene, SwirlScene } from "./ProblemScenes";
import { CtaScene, DamageScene, SolutionScene } from "./SolutionScenes";
import { SCENES, TOTAL_FRAMES } from "./timeline";

export type CarWashProps = {
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly voiceVolume: number;
  readonly voiceSrc: string | null; // e.g. "voice/carwash-vo.mp3" in public/
};

export const CAR_WASH_FRAMES = TOTAL_FRAMES;

export const CarWash: React.FC<CarWashProps> = ({ sfxVolume, musicVolume, voiceVolume, voiceSrc }) => {
  const { fps, durationInFrames } = useVideoConfig();
  // music ducks under the voice when there is one
  const bed = voiceSrc ? musicVolume * 0.55 : musicVolume;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Series>
        <Series.Sequence name="1 Hook — brush" durationInFrames={SCENES.hook} premountFor={fps}>
          <HookScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="2 Sand in bristles" durationInFrames={SCENES.sand} premountFor={fps}>
          <SandScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="3 Paint layers" durationInFrames={SCENES.layers} premountFor={fps}>
          <LayersScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="4 Swirls footage" durationInFrames={SCENES.swirls} premountFor={fps}>
          <SwirlScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="5 Damage" durationInFrames={SCENES.damage} premountFor={fps}>
          <DamageScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="6 Solution" durationInFrames={SCENES.solution} premountFor={fps}>
          <SolutionScene sfxVolume={sfxVolume} />
        </Series.Sequence>
        <Series.Sequence name="7 CTA" durationInFrames={SCENES.cta} premountFor={fps}>
          <CtaScene sfxVolume={sfxVolume} />
        </Series.Sequence>
      </Series>
      <Audio
        name="Music bed"
        src={staticFile("music/carwash-bed.wav")}
        volume={(f) => bed * interpolate(f, [0, 8, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {voiceSrc ? <Audio name="Voiceover" src={staticFile(voiceSrc)} volume={voiceVolume} /> : null}
    </AbsoluteFill>
  );
};
