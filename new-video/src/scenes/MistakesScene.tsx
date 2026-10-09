import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_DISPLAY, FONT_TEXT } from "../theme";

export const MISTAKES_FRAMES = 120;

const Mistake: React.FC<{ readonly label: string; readonly index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const strike = interpolate(frame, [0.3 * fps, 0.55 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 900 + index * 200,
        display: "flex",
        alignItems: "center",
        gap: 36,
        opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(frame, [0, 0.35 * fps], ["60px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        }),
      }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
        <circle cx="55" cy="55" r="50" fill="none" stroke={COLORS.yellow} strokeWidth="6" />
        <path d="M35 35 L75 75 M75 35 L35 75" stroke={COLORS.yellow} strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: FONT_TEXT, fontWeight: 700, fontSize: 56, color: COLORS.ice, lineHeight: 1.05, whiteSpace: "nowrap" }}>
          {label}
        </div>
        <div
          style={{
            position: "absolute",
            left: -8,
            top: "50%",
            height: 8,
            borderRadius: 4,
            width: `calc(${strike}% + 16px)`,
            background: COLORS.yellow,
          }}
        />
      </div>
    </div>
  );
};

// Full-screen dark insert: the three most common mistakes.
export const MistakesScene: React.FC<{ readonly sfxVolume: number }> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 30%, ${COLORS.deep} 0%, ${COLORS.navy} 70%)`,
        opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 80,
          right: 80,
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 112,
          lineHeight: 1.0,
          color: COLORS.ice,
          translate: interpolate(frame, [0, 0.4 * fps], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        <span style={{ color: COLORS.yellow }}>3 MISTAKES</span> THAT RUIN LEATHER
      </div>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />

      <Sequence name="Mistake 1" from={20} premountFor={fps}>
        <Mistake index={0} label="ALL-PURPOSE CLEANER" />
        <Audio from={9} src={staticFile("sfx/buzz.wav")} volume={sfxVolume} />
      </Sequence>
      <Sequence name="Mistake 2" from={46} premountFor={fps}>
        <Mistake index={1} label="STIFF BRUSH" />
        <Audio from={9} src={staticFile("sfx/buzz.wav")} volume={sfxVolume} />
      </Sequence>
      <Sequence name="Mistake 3" from={72} premountFor={fps}>
        <Mistake index={2} label="SKIPPING THE CONDITIONER" />
        <Audio from={9} src={staticFile("sfx/buzz.wav")} volume={sfxVolume} />
      </Sequence>
    </AbsoluteFill>
  );
};
