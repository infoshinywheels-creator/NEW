import { Composition } from "remotion";
import { CarWash, CAR_WASH_FRAMES, type CarWashProps } from "./carwash/CarWash";
import { fontsReady } from "./fonts";
import { LeatherCare, leatherCareDuration, type LeatherCareProps } from "./LeatherCare";

const leatherDefaults: LeatherCareProps = {
  sfxVolume: 0.7,
  ambientVolume: 0.6,
  showOutroCTA: true,
};

const carWashDefaults: CarWashProps = {
  sfxVolume: 0.6,
  musicVolume: 0.5,
  voiceVolume: 1,
  voiceSrc: null,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LeatherCare"
        component={LeatherCare}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={leatherCareDuration(leatherDefaults)}
        defaultProps={leatherDefaults}
        calculateMetadata={async ({ props }) => {
          await fontsReady;
          return { durationInFrames: leatherCareDuration(props) };
        }}
      />
      <Composition
        id="CarWash"
        component={CarWash}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={CAR_WASH_FRAMES}
        defaultProps={carWashDefaults}
        calculateMetadata={async () => {
          await fontsReady;
          return {};
        }}
      />
    </>
  );
};
