import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bubbles } from "../components/Bubbles";
import { COLORS, FONT_DISPLAY, FONT_TEXT } from "../theme";

export const OUTRO_FRAMES = 96;

// Logo + soft CTA: mobile service at the customer's home.
export const OutroScene: React.FC<{ readonly sfxVolume: number }> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${COLORS.deep} 0%, ${COLORS.navy} 72%)`,
        opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <Bubbles seed="outro" count={20} opacity={0.7} />
      <Img
        src={staticFile("brand/shinywheels-logo.png")}
        style={{
          position: "absolute",
          left: 70,
          width: 940,
          top: 560,
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 0.6 * fps], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0.5 * fps, 0.9 * fps], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          }),
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 92, color: COLORS.ice, lineHeight: 1.02 }}>
          WE COME
          <br />
          TO YOUR HOME
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_TEXT, fontWeight: 700, fontSize: 44, color: COLORS.aqua }}>
          YOUR CAR NEVER EVEN
          <br />
          LEAVES THE DRIVEWAY
        </div>
      </div>
      <Audio src={staticFile("sfx/sparkle.wav")} volume={sfxVolume} />
      <Audio from={4} src={staticFile("sfx/bubbles.wav")} volume={sfxVolume * 0.6} premountFor={fps} />
      <Audio from={15} src={staticFile("sfx/pop.wav")} volume={sfxVolume * 0.8} premountFor={fps} />
    </AbsoluteFill>
  );
};
