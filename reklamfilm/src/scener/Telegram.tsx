import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RorligBild, Sno, Vinjett } from "../Effekter";
import { FARG } from "../stil";
import { Rad, Textyta } from "./Text";

// Scen 2 – telegrammet.
export const Telegram: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RorligBild
        fil="lucka-01.jpg"
        position="58% 50%"
        skala={interpolate(frame, [0, 130], [1.0, 1.18], { extrapolateRight: "clamp" })}
        forskjutning="0% -6%"
      />
      <Vinjett band="topp" />
      <Sno antal={30} styrka={0.6} />
      <Textyta topp={0.13}>
        <Rad typ="maskin" fran={8} storlek={44} farg={FARG.barnsten}>Telegram · Stop</Rad>
        <Rad fran={20} storlek={88}>Redaren Harald Ekberg hittas död i fyrtornet.</Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
