import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const STRIP_COLORS = [COLORS.sky, "#2F86E0", COLORS.aqua, "#1F5FB0"];

type BrushProps = {
  readonly cx: number;
  readonly top: number;
  readonly radius: number;
  readonly height: number;
  readonly speed?: number; // radians per frame
  readonly spray?: boolean;
};

// A rotating car-wash brush drawn as a pseudo-3D cylinder of bristle strips.
export const Brush: React.FC<BrushProps> = ({ cx, top, radius, height, speed = 0.22, spray = true }) => {
  const frame = useCurrentFrame();
  const { width, height: H } = useVideoConfig();
  const N = 34;
  const rot = frame * speed;
  const strips = new Array(N).fill(0).map((_, i) => {
    const theta = (i / N) * Math.PI * 2 + rot;
    return { i, x: Math.sin(theta), depth: Math.cos(theta) };
  });
  strips.sort((a, b) => a.depth - b.depth);
  const stripW = ((2 * Math.PI * radius) / N) * 1.25;

  return (
    <svg width={width} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* shaft */}
      <rect x={cx - 26} y={top - 120} width={52} height={height + 160} rx={10} fill="#0B1424" />
      <rect x={cx - 80} y={top - 150} width={160} height={46} rx={14} fill="#16243A" />
      {strips.map(({ i, x, depth }) => {
        if (depth < -0.15) return null;
        const w = stripW * Math.max(0.18, depth);
        const sx = cx + x * radius;
        const flare = 1 + 0.12 * Math.sin(frame * 0.5 + i);
        const color = STRIP_COLORS[i % STRIP_COLORS.length];
        const light = 0.45 + 0.55 * Math.max(0, depth);
        return (
          <g key={i} opacity={light}>
            <rect x={sx - w / 2} y={top} width={w} height={height} rx={w / 2} fill={color} />
            {/* frayed tips at the bottom */}
            <rect x={sx - (w * flare) / 2} y={top + height - 30} width={w * flare} height={60} rx={w / 2} fill={color} opacity={0.7} />
          </g>
        );
      })}
      <rect x={cx - radius - 12} y={top} width={radius * 2 + 24} height={height + 30} fill="url(#shade)" />
      {/* motion streaks */}
      {new Array(6).fill(0).map((_, k) => {
        const y = top + 60 + k * (height / 6);
        const off = ((frame * 22 + k * 70) % (radius * 2)) - radius;
        return (
          <line
            key={k}
            x1={cx + off - 50}
            x2={cx + off + 50}
            y1={y}
            y2={y}
            stroke={COLORS.ice}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.35 * (1 - Math.abs(off) / radius)}
          />
        );
      })}
      {/* water spray flung off the edges */}
      {spray
        ? new Array(26).fill(0).map((_, k) => {
            const life = 18;
            const born = Math.floor((frame + k * 3) / life) * life - k * 3;
            const age = frame - born;
            const side = random(`side${k}`) > 0.5 ? 1 : -1;
            const y0 = top + random(`y${k}-${born}`) * height;
            const vx = side * (10 + random(`vx${k}-${born}`) * 14);
            const vy = -4 + random(`vy${k}-${born}`) * 8;
            return (
              <circle
                key={k}
                cx={cx + side * radius + vx * age}
                cy={y0 + vy * age + 0.4 * age * age}
                r={3 + random(`r${k}`) * 5}
                fill={COLORS.ice}
                opacity={Math.max(0, 1 - age / life) * 0.8}
              />
            );
          })
        : null}
    </svg>
  );
};

// Simple side-view car silhouette.
export const CarIcon: React.FC<{ readonly x: number; readonly y: number; readonly scale?: number; readonly color?: string; readonly opacity?: number }> = ({
  x,
  y,
  scale = 1,
  color = COLORS.ice,
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <path
      d="M-95 10 L-90 -12 Q-86 -22 -72 -24 L-45 -28 L-22 -50 Q-15 -56 0 -56 L40 -56 Q52 -56 60 -48 L80 -28 Q98 -25 100 -12 L100 10 Z"
      fill={color}
    />
    <path d="M-14 -46 L-2 -46 L-2 -30 L-30 -30 Z M6 -46 L40 -46 Q48 -46 54 -40 L64 -30 L6 -30 Z" fill={COLORS.navy} opacity={0.7} />
    <circle cx={-55} cy={12} r={18} fill={COLORS.navy} stroke={color} strokeWidth={6} />
    <circle cx={60} cy={12} r={18} fill={COLORS.navy} stroke={color} strokeWidth={6} />
  </g>
);
