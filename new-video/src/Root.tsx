import { Composition } from "remotion";
import { fontsReady } from "./fonts";
import { LeatherCare, leatherCareDuration, type LeatherCareProps } from "./LeatherCare";

const defaultProps: LeatherCareProps = {
  sfxVolume: 0.7,
  ambientVolume: 0.6,
  showOutroCTA: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LeatherCare"
      component={LeatherCare}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={leatherCareDuration(defaultProps)}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        await fontsReady;
        return { durationInFrames: leatherCareDuration(props) };
      }}
    />
  );
};
