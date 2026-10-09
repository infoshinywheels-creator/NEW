import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

// Foam bubbles drifting upwards — echoes the foam in the Shinywheels logo.
export const Bubbles: React.FC<{ count?: number; seed?: string; opacity?: number }> = ({
  count = 18,
  seed = "bubbles",
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const size = 18 + random(`${seed}-s-${i}`) * 70;
        const x = random(`${seed}-x-${i}`) * width;
        const speed = 90 + random(`${seed}-v-${i}`) * 160; // px per second
        const delay = random(`${seed}-d-${i}`) * 1.2 * fps;
        const local = Math.max(0, frame - delay);
        const y = height + size - (local / fps) * speed;
        const sway = Math.sin((local / fps) * 2 + i) * 14;
        const fade = interpolate(local, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              opacity: fade * 0.85,
              border: `2px solid ${COLORS.ice}`,
              background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9) 0 12%, rgba(226,244,252,0.18) 30%, rgba(90,196,255,0.08) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
