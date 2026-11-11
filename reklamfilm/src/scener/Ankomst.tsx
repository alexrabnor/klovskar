import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { RorligBild, Sno, Vinjett } from "../Effekter";
import { FARG } from "../stil";
import { Rad, Textyta } from "./Text";

// Scen 1 – kroken: ön i isen.
export const Ankomst: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RorligBild
        fil="hotellet-dag.jpg"
        position="20% 50%"
        skala={interpolate(frame, [0, 165], [1.12, 1.22], { extrapolateRight: "clamp" })}
        forskjutning={interpolate(frame, [0, 165], ["4% 0%", "-12% 0%"], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) })}
      />
      <Vinjett band="botten" />
      <Sno antal={70} />
      <Textyta topp={0.56}>
        <Rad typ="maskin" fran={8} storlek={44} farg={FARG.barnsten}>December 1962</Rad>
        <Rad fran={88} storlek={92}>Isen har lagt sig runt Klovskär.</Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
