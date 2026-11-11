import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Ankomst } from "./scener/Ankomst";
import { Telegram } from "./scener/Telegram";
import { Trappan } from "./scener/Trappan";
import { DeSju } from "./scener/DeSju";
import { Luckor } from "./scener/Luckor";
import { Slut, SlutProps } from "./scener/Slut";

export const OVERGANG = 15;
// Tajmat efter berättarrösten (public/ljud/berattare.mp3, startar efter RÖST_START bildrutor).
export const RÖST_START = 9;
export const SCENER = { ankomst: 162, telegram: 126, trappan: 113, deSju: 157, luckor: 203, slut: 184 };
export const LANGD = Object.values(SCENER).reduce((a, b) => a + b, 0) - OVERGANG * (Object.keys(SCENER).length - 1);

// Var varje scen börjar i den färdiga filmen (för ljudeffekter).
const start = (() => {
  const v = Object.values(SCENER);
  return v.map((_, i) => v.slice(0, i).reduce((a, b) => a + b, 0) - i * OVERGANG);
})();

const toning = () => <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: OVERGANG })} />;

export const Reklamfilm: React.FC<SlutProps> = (props) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Ankomst" durationInFrames={SCENER.ankomst}><Ankomst /></TransitionSeries.Sequence>
        {toning()}
        <TransitionSeries.Sequence name="Telegram" durationInFrames={SCENER.telegram}><Telegram /></TransitionSeries.Sequence>
        {toning()}
        <TransitionSeries.Sequence name="Trappan" durationInFrames={SCENER.trappan}><Trappan /></TransitionSeries.Sequence>
        {toning()}
        <TransitionSeries.Sequence name="De sju" durationInFrames={SCENER.deSju}><DeSju /></TransitionSeries.Sequence>
        {toning()}
        <TransitionSeries.Sequence name="Luckor" durationInFrames={SCENER.luckor}><Luckor /></TransitionSeries.Sequence>
        {toning()}
        <TransitionSeries.Sequence name="Slut" durationInFrames={SCENER.slut}><Slut {...props} /></TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Ljud: alla CC0 från Freesound, se ../public/ljud/KALLOR.md i spelet */}
      <Audio
        src={staticFile("ljud/vind.mp3")}
        volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.45, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Audio
        src={staticFile("ljud/hav.mp3")}
        volume={(f) => interpolate(f, [0, 30, start[1] + 20, start[1] + 50], [0, 0.25, 0.25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Sequence from={start[1] + 4} durationInFrames={50}>
        <Audio src={staticFile("ljud/oppna.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={start[2]} durationInFrames={start[4] - start[2] + 10}>
        <Audio
          src={staticFile("ljud/klocka.mp3")}
          volume={(f) => interpolate(f, [0, 15, start[4] - start[2] - 10, start[4] - start[2] + 10], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      <Sequence from={start[4]} durationInFrames={50}>
        <Audio src={staticFile("ljud/oppna.mp3")} volume={0.5} />
      </Sequence>
      {/* Berättarröst: ElevenLabs (eleven_v4) */}
      <Sequence from={RÖST_START} name="Berättare">
        <Audio src={staticFile("ljud/berattare.mp3")} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
