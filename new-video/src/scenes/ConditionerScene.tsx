import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { StepCard } from "../components/StepCard";
import { COLORS } from "../theme";

export const CONDITIONER_RATE = 0.9;
export const CONDITIONER_FRAMES = 174;

type Props = { readonly sfxVolume: number; readonly ambientVolume: number };

// Step 5 over the Leather Star clip, with a "shine" sweep across the seat.
export const ConditionerScene: React.FC<Props> = ({ sfxVolume, ambientVolume }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sweepStart = 2.4 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Video
        name="Leather Star clip"
        src={staticFile("materials/leather-star.mp4")}
        playbackRate={CONDITIONER_RATE}
        volume={ambientVolume}
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          scale: interpolate(frame, [0, durationInFrames], [1.0, 1.08]),
        }}
      />
      {/* shine sweep */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(226,244,252,0.55) 50%, rgba(255,255,255,0) 60%)",
          backgroundSize: "300% 100%",
          backgroundPositionX: `${interpolate(frame, [sweepStart, sweepStart + 0.9 * fps], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}%`,
          opacity: interpolate(frame, [sweepStart, sweepStart + 4, sweepStart + 0.8 * fps, sweepStart + 0.9 * fps], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          mixBlendMode: "screen",
        }}
      />
      <Sequence name="Step 5" durationInFrames={CONDITIONER_FRAMES} premountFor={fps}>
        <StepCard
          step={5}
          total={5}
          title="CONDITION AND PROTECT"
          subtitle="UV PROTECTION, NO CRACKS"
          product="LEATHER STAR"
          durationInFrames={CONDITIONER_FRAMES}
        />
      </Sequence>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      <Audio from={12} src={staticFile("sfx/tick.wav")} volume={sfxVolume} premountFor={fps} />
      <Audio from={sweepStart} src={staticFile("sfx/sparkle.wav")} volume={sfxVolume} premountFor={fps} />
    </AbsoluteFill>
  );
};
