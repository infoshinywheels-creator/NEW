import { Audio } from "@remotion/media";
import { Img, random, staticFile, useCurrentFrame } from "remotion";
import { FONT_BODY, FONT_HEAD } from "../fonts";
import { COLORS } from "../theme";
import { SCENES } from "./timeline";
import { Backdrop, ip, SceneFade, Title } from "./ui";

type SfxProps = { readonly sfxVolume: number };

const ICON = { stroke: COLORS.ice, strokeWidth: 12, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MirrorIcon = () => (
  <g>
    <path d="M-80 -50 Q-80 -70 -55 -70 L70 -60 Q90 -58 88 -35 L80 40 Q76 62 52 60 L-60 52 Q-82 50 -82 28 Z" {...ICON} />
    <path d="M-30 52 L-50 95" {...ICON} />
  </g>
);
const AntennaIcon = () => (
  <g>
    <path d="M-90 80 L90 80" {...ICON} />
    <path d="M-30 80 Q-30 50 0 46 Q30 50 30 80" {...ICON} />
    <path d="M0 46 L50 -90" {...ICON} />
    <circle cx={50} cy={-90} r={10} fill={COLORS.ice} />
  </g>
);
const WheelIcon = () => (
  <g>
    <circle r={88} {...ICON} />
    <circle r={22} {...ICON} />
    {new Array(5).fill(0).map((_, i) => (
      <path key={i} d="M0 -26 L0 -80" {...ICON} transform={`rotate(${i * 72})`} />
    ))}
  </g>
);

const DamageTile: React.FC<{ readonly x: number; readonly at: number; readonly crack: string; readonly children: React.ReactNode; readonly label: string }> = ({
  x,
  at,
  crack,
  children,
  label,
}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  const hit = f - 10;
  const shake = hit > 0 && hit < 8 ? Math.sin(hit * 3.2) * (8 - hit) * 2 : 0;
  const len = 420;
  return (
    <g transform={`translate(${x + shake} 1080)`} opacity={ip(f, [0, 6], [0, 1])}>
      <g style={{ scale: `${ip(f, [0, 10], [0.6, 1])}` }}>
        <rect x={-150} y={-150} width={300} height={300} rx={48} fill="rgba(18,49,79,0.85)" stroke={COLORS.sky} strokeWidth={4} />
        {children}
        <path
          d={crack}
          stroke={COLORS.yellow}
          strokeWidth={10}
          fill="none"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - ip(hit, [0, 5], [0, 1], undefined))}
          style={{ filter: `drop-shadow(0 0 10px ${COLORS.yellow})` }}
        />
      </g>
      <text y={225} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={800} fontSize={40} fill={COLORS.ice} letterSpacing={2}>
        {label}
      </text>
    </g>
  );
};

// 5. Collateral damage: mirrors, antennas, wheels.
export const DamageScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const D = SCENES.damage;
  return (
    <SceneFade duration={D}>
      <Backdrop seed="damage" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <DamageTile x={200} at={2} label="ДЗЕРКАЛА" crack="M-60 -70 L-20 -20 L-40 10 L10 40 L-5 70">
          <MirrorIcon />
        </DamageTile>
        <DamageTile x={540} at={14} label="АНТЕНИ" crack="M10 -40 L40 -10 L20 10 L60 40">
          <AntennaIcon />
        </DamageTile>
        <DamageTile x={880} at={26} label="ДИСКИ" crack="M-70 -50 L-30 -30 L-40 0 L10 20 L0 50 L60 70">
          <WheelIcon />
        </DamageTile>
      </svg>
      <Title lines={["ЩЕ Й ДЗЕРКАЛА,", "АНТЕНИ, ДИСКИ"]} accent={[1]} accentColor={COLORS.yellow} top={360} size={80} />
      <Audio src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
      <Audio from={12} src={staticFile("sfx/snap.wav")} volume={sfxVolume} />
      <Audio from={24} src={staticFile("sfx/snap.wav")} volume={sfxVolume * 0.9} />
      <Audio from={36} src={staticFile("sfx/snap.wav")} volume={sfxVolume} />
    </SceneFade>
  );
};

const Badge: React.FC<{ readonly top: number; readonly at: number; readonly icon: React.ReactNode; readonly title: string; readonly sub?: string }> = ({
  top,
  at,
  icon,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        height: 190,
        borderRadius: 40,
        background: "rgba(10,28,54,0.78)",
        border: `3px solid ${COLORS.aqua}88`,
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "0 40px",
        opacity: ip(f, [0, 6], [0, 1]),
        translate: `${ip(f, [0, 14], [-120, 0])}px 0px`,
        boxShadow: `0 0 40px ${COLORS.sky}33`,
      }}
    >
      <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ flexShrink: 0 }}>
        {icon}
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: 40, color: COLORS.ice, lineHeight: 1.1, whiteSpace: "nowrap" }}>{title}</div>
        {sub ? <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 36, color: COLORS.aqua, marginTop: 8 }}>{sub}</div> : null}
      </div>
      <svg width={84} height={84} viewBox="-42 -42 84 84" style={{ flexShrink: 0, scale: `${ip(f, [8, 16], [0, 1])}` }}>
        <circle r={38} fill={COLORS.sky} />
        <path d="M-16 0 L-4 13 L18 -12" stroke={COLORS.navy} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const FoamIcon = () => (
  <g fill="none" stroke={COLORS.ice} strokeWidth={6}>
    <circle cx={-18} cy={10} r={24} />
    <circle cx={18} cy={-6} r={30} />
    <circle cx={14} cy={34} r={16} />
    <circle cx={-30} cy={-30} r={12} />
  </g>
);
const ClothIcon = () => (
  <g fill="none" stroke={COLORS.ice} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-44 -36 L40 -44 L46 34 L-38 42 Z" />
    <path d="M-30 -14 Q-10 -24 10 -14 T 36 -18 M-28 8 Q-8 -2 12 8 T 38 4" />
  </g>
);
const HomeIcon = () => (
  <g fill="none" stroke={COLORS.ice} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    <path d="M0 50 C -40 10 -44 -10 -44 -18 A44 44 0 0 1 44 -18 C 44 -10 40 10 0 50 Z" />
    <path d="M-18 -10 L0 -28 L18 -10 L18 10 L-18 10 Z" />
  </g>
);

// 6. Shinywheels way: snow foam, one microfiber per car, we come to you.
export const SolutionScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const D = SCENES.solution;
  return (
    <SceneFade duration={D}>
      <Backdrop glow="#1E5A92" seed="sol" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {new Array(46).fill(0).map((_, i) => {
          const at = random(`fa${i}`) * 20;
          const s = ip(frame - at, [0, 14], [0, 1]);
          const r = (40 + random(`fr${i}`) * 110) * s;
          const x = random(`fx${i}`) * 1080;
          const y = 1920 - random(`fy${i}`) * 520 - frame * 1.2;
          return (
            <g key={i} opacity={0.5}>
              <circle cx={x} cy={y} r={r} fill={COLORS.ice} fillOpacity={0.12} stroke={COLORS.ice} strokeWidth={3} />
              <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.15} fill="#fff" opacity={0.7} />
            </g>
          );
        })}
      </svg>
      <Title lines={["МИ МИЄМО ІНАКШЕ"]} top={300} size={80} />
      <Badge top={620} at={8} icon={<FoamIcon />} title="ПІНА-ПЕРЕДМИТТЯ" sub="бруд відходить без тертя" />
      <Badge top={860} at={30} icon={<ClothIcon />} title="ОКРЕМА МІКРОФІБРА" sub="на кожне авто — нова" />
      <Badge top={1100} at={70} icon={<HomeIcon />} title="ВИЇЗД ДО ВАС" sub="авто навіть не покине двір" />
      <Audio src={staticFile("sfx/bubbles.wav")} volume={sfxVolume} />
      <Audio from={8} src={staticFile("sfx/pop.wav")} volume={sfxVolume} />
      <Audio from={30} src={staticFile("sfx/pop.wav")} volume={sfxVolume} />
      <Audio from={70} src={staticFile("sfx/pop.wav")} volume={sfxVolume} />
      <Audio from={74} src={staticFile("sfx/sparkle.wav")} volume={sfxVolume * 0.8} />
    </SceneFade>
  );
};

// 7. CTA: share it with someone who uses tunnel washes every day.
export const CtaScene: React.FC<SfxProps> = ({ sfxVolume }) => {
  const frame = useCurrentFrame();
  const D = SCENES.cta;
  const t = ip(frame, [10, 40], [0, 1]);
  const px = 160 + t * 760;
  const py = 1420 - Math.sin(t * Math.PI) * 220 - t * 120;
  return (
    <SceneFade duration={D} outFrames={1}>
      <Backdrop seed="cta" glow="#163F6C" />
      <Img
        src={staticFile("brand/shinywheels-logo.png")}
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: 260,
          opacity: ip(frame, [0, 8], [0, 1]),
          scale: `${ip(frame, [0, 16], [0.85, 1])}`,
        }}
      />
      <Title lines={["ПЕРЕШЛІТЬ", "ТОМУ, ХТО ЇЗДИТЬ", "НА МИЙКУ ЩОДНЯ"]} accent={[2]} top={700} size={76} delay={4} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path
          d={`M160 1420 Q 540 ${1420 - 330} 920 1300`}
          stroke={COLORS.aqua}
          strokeWidth={5}
          strokeDasharray="4 22"
          strokeLinecap="round"
          fill="none"
          opacity={ip(frame, [10, 40], [0, 0.8])}
        />
        <g transform={`translate(${px} ${py}) rotate(${-25 + t * 40})`} opacity={ip(frame, [8, 12], [0, 1])}>
          <path d="M-60 -10 L60 -50 L20 60 L0 10 Z" fill={COLORS.sky} stroke={COLORS.ice} strokeWidth={5} strokeLinejoin="round" />
          <path d="M0 10 L60 -50" stroke={COLORS.ice} strokeWidth={5} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1620,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 40,
          color: COLORS.aqua,
          opacity: ip(frame, [30, 40], [0, 1]),
        }}
      >
        Shinywheels · мобільний детейлінг
      </div>
      <Audio src={staticFile("sfx/sparkle.wav")} volume={sfxVolume * 0.8} />
      <Audio from={10} src={staticFile("sfx/whoosh.wav")} volume={sfxVolume} />
    </SceneFade>
  );
};
