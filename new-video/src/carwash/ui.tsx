import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_HEAD } from "../fonts";
import { COLORS } from "../theme";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const ip = (
  frame: number,
  input: number[],
  output: number[],
  easing: ((t: number) => number) | undefined = EASE,
) => interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const SAND = "#D8B877"; // secondary detail colour (sand grains)

// Animated dark brand background: navy radial glow + drifting dust specks.
export const Backdrop: React.FC<{ readonly glow?: string; readonly seed?: string }> = ({
  glow = COLORS.deep,
  seed = "bg",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${45 + Math.sin(frame / 40) * 4}%, ${glow} 0%, ${COLORS.navy} 68%)`,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {new Array(40).fill(0).map((_, i) => {
          const x = (random(`${seed}x${i}`) * width + frame * (0.3 + random(`${seed}v${i}`))) % width;
          const y = (random(`${seed}y${i}`) * height - frame * 0.6 * random(`${seed}w${i}`) + height) % height;
          return <circle key={i} cx={x} cy={y} r={1.5 + random(`${seed}r${i}`) * 2.5} fill={COLORS.aqua} opacity={0.18} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

type TitleProps = {
  readonly lines: string[];
  readonly accent?: number[]; // indexes of lines drawn in the accent colour
  readonly accentColor?: string;
  readonly top?: number;
  readonly size?: number;
  readonly delay?: number;
};

// Headline: each line slides up and fades in, staggered.
export const Title: React.FC<TitleProps> = ({
  lines,
  accent = [],
  accentColor = COLORS.sky,
  top = 230,
  size = 84,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  // Unbounded is wide (~0.92em per capital): shrink so the longest line fits 940px.
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = Math.min(size, Math.floor(940 / (longest * 0.92)));
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: "center" }}>
      {lines.map((line, i) => {
        const f = frame - delay - i * 4;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 900,
              fontSize,
              whiteSpace: "nowrap",
              lineHeight: 1.12,
              color: accent.includes(i) ? accentColor : COLORS.ice,
              opacity: ip(f, [0, 6], [0, 1], undefined),
              translate: `0px ${ip(f, [0, 12], [36, 0])}px`,
              filter: accent.includes(i) ? `drop-shadow(0 0 18px ${accentColor}66)` : undefined,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

// Fade a whole scene in/out at its edges.
export const SceneFade: React.FC<{ readonly duration: number; readonly children: React.ReactNode; readonly inFrames?: number; readonly outFrames?: number }> = ({
  duration,
  children,
  inFrames = 5,
  outFrames = 5,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: ip(frame, [0, inFrames, duration - outFrames, duration], [0, 1, 1, 0], undefined) }}>
      {children}
    </AbsoluteFill>
  );
};
