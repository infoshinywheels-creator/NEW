import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { Brush, CarIcon } from "./Brush";
import { SCENES } from "./timeline";
import { Backdrop, ip, SAND, SceneFade, Title } from "./ui";

type SfxProps = { readonly sfxVolume: number };

// 1. Hook — a giant rotating brush, cars streaming through it.
export const HookScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const D = SCENES.hook;
  // conveyor of cars accelerating through the brush
  const speed = ip(frame, [0, D], [10, 46], (t) => t * t);
  let dist = 0;
  for (let f = 0; f < frame; f++) dist += ip(f, [0, D], [10, 46], (t) => t * t);
  const gap = 300;
  return (
    <SceneFade duration={D} inFrames={1} outFrames={6}>
      <Backdrop seed="hook" />
      <AbsoluteFill style={{ scale: `${ip(frame, [0, 22], [1.35, 1])}`, transformOrigin: "50% 60%" }}>
        <Brush cx={540} top={830} radius={250} height={600} speed={0.18 + frame * 0.002} />
        <svg width={width} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={1555} width={width} height={10} rx={5} fill={COLORS.deep} />
          {new Array(8).fill(0).map((_, k) => {
            const x = ((dist + k * gap) % (gap * 8)) - 200;
            return (
              <g key={k}>
                <CarIcon x={x} y={1520} scale={1.1} opacity={0.9} />
                <line x1={x - 140} x2={x - 140 - speed * 4} y1={1490} y2={1490} stroke={COLORS.aqua} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <Title lines={["ЦЯ ЩІТКА", "ВЖЕ ПОМИЛА", "СОТНІ МАШИН", "ДО ВАШОЇ"]} accent={[2]} size={96} top={170} />
      <Audio src={staticFile("sfx/hit.wav")} volume={sfxVolume} />
      <Audio src={staticFile("sfx/rumble.wav")} volume={sfxVolume * 0.8} />
    </SceneFade>
  );
};

// 2. Sand trapped in the bristles — seen through a magnifier.
export const SandScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const D = SCENES.sand;
  const cx = 540;
  const cy = 1060;
  const r = 400;
  const grains = new Array(16).fill(0).map((_, i) => ({
    x: cx - 300 + random(`gx${i}`) * 600,
    y: cy - 300 + random(`gy${i}`) * 600,
    s: 16 + random(`gs${i}`) * 26,
    rot: random(`gr${i}`) * 360,
    at: 6 + i * 2.2,
  }));
  return (
    <SceneFade duration={D}>
      <Backdrop seed="sand" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="lens">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
          <radialGradient id="lensBg">
            <stop offset="0" stopColor="#173B63" />
            <stop offset="1" stopColor={COLORS.navy} />
          </radialGradient>
        </defs>
        <g style={{ scale: `${ip(frame, [0, 14], [0.4, 1])}`, transformOrigin: `${cx}px ${cy}px` }}>
          <g clipPath="url(#lens)">
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="url(#lensBg)" />
            {new Array(13).fill(0).map((_, i) => {
              const x = cx - r + 30 + i * 62;
              const sway = Math.sin(frame / 9 + i) * 26;
              return (
                <path
                  key={i}
                  d={`M${x} ${cy - r - 20} C ${x + sway} ${cy - 120}, ${x - sway} ${cy + 120}, ${x + sway * 1.4} ${cy + r + 20}`}
                  stroke={i % 2 ? COLORS.sky : "#2F86E0"}
                  strokeWidth={30}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.9}
                />
              );
            })}
            {grains.map((g, i) => {
              const f = frame - g.at;
              const s = ip(f, [0, 6], [0, 1]);
              const ring = ip(f, [0, 14], [0, 1], undefined);
              const pts = new Array(6)
                .fill(0)
                .map((__, k) => {
                  const a = (k / 6) * Math.PI * 2;
                  const rr = g.s * (0.7 + random(`gp${i}-${k}`) * 0.5);
                  return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
                })
                .join(" ");
              return (
                <g key={i} transform={`translate(${g.x} ${g.y + Math.sin(frame / 9 + i) * 8}) rotate(${g.rot}) scale(${s})`}>
                  <circle r={g.s * 1.8 * ring} fill="none" stroke={COLORS.yellow} strokeWidth={4} opacity={1 - ring} />
                  <polygon points={pts} fill={SAND} stroke="#8C6B33" strokeWidth={3} />
                  <circle cx={-g.s * 0.25} cy={-g.s * 0.25} r={g.s * 0.18} fill="#fff" opacity={0.6} />
                </g>
              );
            })}
          </g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.ice} strokeWidth={14} />
          <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={COLORS.sky} strokeWidth={4} opacity={0.6} />
          <rect x={cx + r * 0.62} y={cy + r * 0.62} width={60} height={260} rx={24} fill="#16243A" stroke={COLORS.ice} strokeWidth={6} transform={`rotate(-45 ${cx + r * 0.62} ${cy + r * 0.62})`} />
          <path d={`M${cx - r * 0.6} ${cy - r * 0.5} A ${r * 0.85} ${r * 0.85} 0 0 1 ${cx - r * 0.1} ${cy - r * 0.82}`} stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.35} />
        </g>
      </svg>
      <Title lines={["ВЕСЬ ЇХНІЙ ПІСОК —", "ДОСІ У ВОРСІ"]} accent={[1]} accentColor={COLORS.yellow} top={250} size={80} />
      <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      <Audio from={Math.round(0.2 * fps)} src={staticFile("sfx/bubbles.wav")} volume={sfxVolume * 0.7} />
    </SceneFade>
  );
};

// 3. Paint cross-section — grains carve micro-scratches into the clear coat.
export const LayersScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const D = SCENES.layers;
  const left = 90;
  const right = 990;
  const top = 980;
  const layers = [
    { name: "ЛАК", h: 120, fill: "url(#clear)", text: COLORS.ice },
    { name: "БАЗА", h: 100, fill: "url(#base)", text: COLORS.navy },
    { name: "ҐРУНТ", h: 80, fill: "#7E8CA0", text: COLORS.navy },
    { name: "МЕТАЛ", h: 110, fill: "url(#metal)", text: COLORS.navy },
  ];
  const grooves = [
    { x: 300, at: 8, depth: 70 },
    { x: 560, at: 22, depth: 90 },
    { x: 800, at: 36, depth: 60 },
  ];
  let y = top;
  return (
    <SceneFade duration={D}>
      <Backdrop seed="layers" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="clear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E2F4FC" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8AE0FE" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="base" x1="0" x2="1">
            <stop offset="0" stopColor="#5AC4FF" />
            <stop offset="1" stopColor="#2F86E0" />
          </linearGradient>
          <linearGradient id="metal" x1="0" x2="1">
            <stop offset="0" stopColor="#9AA7B8" />
            <stop offset="0.5" stopColor="#C9D2DD" />
            <stop offset="1" stopColor="#5D6A7C" />
          </linearGradient>
        </defs>
        <g style={{ translate: `0px ${ip(frame, [0, 14], [80, 0])}px` }} opacity={ip(frame, [0, 8], [0, 1])}>
          {layers.map((l) => {
            const ly = y;
            y += l.h;
            return (
              <g key={l.name}>
                <rect x={left} y={ly} width={right - left} height={l.h} fill={l.fill} />
                <text x={left + 26} y={ly + l.h / 2 + 12} fontFamily="SW Body" fontWeight={800} fontSize={34} fill={l.text} letterSpacing={3}>
                  {l.name}
                </text>
              </g>
            );
          })}
          <line x1={left} x2={right} y1={top} y2={top} stroke="#fff" strokeWidth={5} opacity={0.9} />
          {grooves.map((g, i) => {
            const p = ip(frame - g.at, [0, 12], [0, 1]);
            const d = g.depth * p;
            const gx = g.x;
            // the grain: drops in, digs, rolls away
            const grainY = ip(frame - g.at, [-8, 0, 12], [top - 260, top - 18, top - 18]);
            const grainX = gx + ip(frame - g.at, [0, 12, 24], [0, 0, 140]);
            const flash = ip(frame - g.at, [0, 3, 10], [0, 1, 0], undefined);
            return (
              <g key={i}>
                <path d={`M${gx - 34 * p} ${top} L${gx} ${top + d} L${gx + 34 * p} ${top} Z`} fill={COLORS.navy} stroke={COLORS.yellow} strokeWidth={4} />
                <circle cx={gx} cy={top + d} r={40 * flash} fill={COLORS.yellow} opacity={0.5 * flash} />
                <polygon
                  points="-22,-8 -6,-24 18,-18 24,4 6,22 -18,16"
                  transform={`translate(${grainX} ${grainY}) rotate(${frame * 8})`}
                  fill={SAND}
                  stroke="#8C6B33"
                  strokeWidth={3}
                  opacity={ip(frame - g.at, [14, 24], [1, 0])}
                />
              </g>
            );
          })}
          {/* depth callout on the deepest scratch */}
          <g opacity={ip(frame, [40, 48], [0, 1])}>
            <line x1={560} x2={700} y1={top + 90} y2={top - 120} stroke={COLORS.yellow} strokeWidth={4} />
            <text x={710} y={top - 128} fontFamily="SW Body" fontWeight={800} fontSize={40} fill={COLORS.yellow}>
              ПОДРЯПИНА
            </text>
          </g>
        </g>
      </svg>
      <Title lines={["КОЖЕН ОБЕРТ —", "МІКРОПОДРЯПИНИ"]} accent={[1]} accentColor={COLORS.yellow} top={300} size={80} />
      <Audio from={8} src={staticFile("sfx/scratch.wav")} volume={sfxVolume} />
      <Audio from={22} src={staticFile("sfx/scratch.wav")} volume={sfxVolume * 0.9} />
      <Audio from={36} src={staticFile("sfx/scratch.wav")} volume={sfxVolume * 0.8} />
    </SceneFade>
  );
};

// 4. Real proof — swirl marks on black paint.
export const SwirlScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const D = SCENES.swirls;
  const circ = 2 * Math.PI * 250;
  return (
    <SceneFade duration={D}>
      <AbsoluteFill style={{ scale: `${ip(frame, [0, D], [1.04, 1.14], undefined)}`, transformOrigin: "20% 77%" }}>
        <Video src={staticFile("materials/swirl-marks.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,28,54,0.9) 0%, rgba(10,28,54,0.2) 38%, rgba(10,28,54,0) 60%)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={215}
          cy={1480}
          r={250}
          fill="none"
          stroke={COLORS.yellow}
          strokeWidth={9}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - ip(frame, [10, 34], [0, 1]))}
          strokeLinecap="round"
          transform="rotate(-90 215 1480)"
        />
        <g opacity={ip(frame, [30, 38], [0, 1])}>
          <line x1={440} x2={640} y1={1360} y2={1180} stroke={COLORS.yellow} strokeWidth={6} strokeLinecap="round" />
          <rect x={560} y={1090} width={420} height={96} rx={48} fill={COLORS.yellow} />
          <text x={770} y={1152} textAnchor="middle" fontFamily="SW Head" fontWeight={900} fontSize={42} fill={COLORS.navy}>
            ПАВУТИНКА
          </text>
        </g>
        {/* sun */}
        <g transform={`translate(900 640) rotate(${frame * 2})`} opacity={ip(frame, [0, 8], [0, 1])}>
          <circle r={46} fill={COLORS.yellow} />
          {new Array(10).fill(0).map((_, i) => (
            <line key={i} x1={0} y1={-66} x2={0} y2={-92} stroke={COLORS.yellow} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />
          ))}
        </g>
      </svg>
      <Title lines={["А НА СОНЦІ —", "ОСЬ ТАКА ПАВУТИНКА"]} accent={[1]} accentColor={COLORS.yellow} top={230} size={74} />
      <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      <Audio from={30} src={staticFile("sfx/pop.wav")} volume={sfxVolume} />
    </SceneFade>
  );
};
