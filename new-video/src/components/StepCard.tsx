import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND_GRADIENT, COLORS, FONT_DISPLAY, FONT_TEXT } from "../theme";

type StepCardProps = {
  readonly step: number;
  readonly total: number;
  readonly title: string;
  readonly subtitle: string;
  readonly product?: string;
  readonly durationInFrames: number;
};

// A numbered step card in the upper third, sliding in from the left.
export const StepCard: React.FC<StepCardProps> = ({
  step,
  total,
  title,
  subtitle,
  product,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const outStart = durationInFrames - 0.25 * fps;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 210,
        padding: "40px 44px",
        borderRadius: 36,
        background: "rgba(10, 28, 54, 0.82)",
        border: "2px solid rgba(138, 224, 254, 0.35)",
        opacity: interpolate(frame, [0, 0.25 * fps, outStart, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 0.45 * fps], ["-80px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        }),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div
          style={{
            width: 104,
            height: 104,
            flexShrink: 0,
            borderRadius: "50%",
            background: BRAND_GRADIENT,
            color: COLORS.navy,
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {step}
        </div>
        <div style={{ fontFamily: FONT_TEXT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: COLORS.aqua }}>
          STEP {step} / {total}
        </div>
        {product ? (
          <div
            style={{
              marginLeft: "auto",
              padding: "10px 20px",
              borderRadius: 999,
              background: COLORS.yellow,
              color: COLORS.navy,
              fontFamily: FONT_TEXT,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 1,
              opacity: interpolate(frame, [0.4 * fps, 0.6 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {product}
          </div>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.02,
          color: COLORS.ice,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: FONT_TEXT,
          fontWeight: 700,
          fontSize: 38,
          color: COLORS.aqua,
          opacity: interpolate(frame, [0.3 * fps, 0.55 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
