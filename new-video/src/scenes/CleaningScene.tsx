import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Bubbles } from "../components/Bubbles";
import { StepCard } from "../components/StepCard";
import { COLORS, FONT_DISPLAY } from "../theme";

export const CLEANING_RATE = 0.55;
export const HOOK_FRAMES = 66;
export const STEP_FRAMES = 60;
export const CLEANING_FRAMES = HOOK_FRAMES + 4 * STEP_FRAMES + 1;

type Props = { readonly sfxVolume: number; readonly ambientVolume: number };

// Hook + steps 1–4 over the Pol Star brushing clip (slowed down).
export const CleaningScene: React.FC<Props> = ({ sfxVolume, ambientVolume }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, HOOK_FRAMES, durationInFrames], [1.18, 1.06, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
          transformOrigin: "55% 70%",
        }}
      >
        <Video
          name="Pol Star clip"
          src={staticFile("materials/leather-seat.mp4")}
          playbackRate={CLEANING_RATE}
          volume={ambientVolume}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      {/* Hook */}
      <Sequence name="Hook" durationInFrames={HOOK_FRAMES + 6} premountFor={fps}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(10,28,54,0.85) 0%, rgba(10,28,54,0.35) 45%, rgba(10,28,54,0) 70%)",
            opacity: interpolate(frame, [HOOK_FRAMES - 4, HOOK_FRAMES + 6], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Bubbles seed="hook" count={14} />
          <div
            style={{
              position: "absolute",
              top: 300,
              left: 70,
              right: 70,
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 104,
              lineHeight: 1.0,
              color: COLORS.ice,
              opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [0, 12], ["0px 40px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: ease,
              }),
            }}
          >
            STILL CLEANING LEATHER SEATS WITH{" "}
            <span style={{ color: COLORS.sky }}>DISH SOAP?</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 760,
              left: 70,
              padding: "14px 40px",
              borderRadius: 24,
              background: COLORS.yellow,
              color: COLORS.navy,
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontSize: 96,
              rotate: "-4deg",
              opacity: interpolate(frame, [34, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              scale: interpolate(frame, [34, 42], [1.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: ease,
              }),
            }}
          >
            STOP.
          </div>
        </AbsoluteFill>
      </Sequence>
      <Audio name="Hook hit" src={staticFile("sfx/hit.wav")} volume={sfxVolume} />
      <Audio name="Hook bubbles" src={staticFile("sfx/bubbles.wav")} volume={sfxVolume * 0.6} />
      <Audio name="STOP pop" from={34} src={staticFile("sfx/pop.wav")} volume={sfxVolume} premountFor={fps} />

      {/* Steps 1–4 */}
      <Sequence name="Step 1" from={HOOK_FRAMES} durationInFrames={STEP_FRAMES} premountFor={fps}>
        <StepCard step={1} total={5} title="VACUUM FIRST" subtitle="SEAMS AND PERFORATION HOLD THE MOST DUST" durationInFrames={STEP_FRAMES} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      </Sequence>
      <Sequence name="Step 2" from={HOOK_FRAMES + STEP_FRAMES} durationInFrames={STEP_FRAMES} premountFor={fps}>
        <StepCard step={2} total={5} title="SPRAY THE BRUSH, NOT THE SEAT" subtitle="NO LIQUID IN THE PERFORATION" product="POL STAR" durationInFrames={STEP_FRAMES} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
        <Audio from={12} src={staticFile("sfx/tick.wav")} volume={sfxVolume} />
      </Sequence>
      <Sequence name="Step 3" from={HOOK_FRAMES + 2 * STEP_FRAMES} durationInFrames={STEP_FRAMES} premountFor={fps}>
        <StepCard step={3} total={5} title="SOFT BRUSH, GENTLE CIRCLES" subtitle="THE FOAM LIFTS THE DIRT OUT" durationInFrames={STEP_FRAMES} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
        <Audio from={8} src={staticFile("sfx/bubbles.wav")} volume={sfxVolume * 0.7} />
      </Sequence>
      <Sequence name="Step 4" from={HOOK_FRAMES + 3 * STEP_FRAMES} durationInFrames={STEP_FRAMES + 1} premountFor={fps}>
        <StepCard step={4} total={5} title="WIPE IT OFF RIGHT AWAY" subtitle="MICROFIBER, BEFORE IT DRIES" durationInFrames={STEP_FRAMES + 1} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
