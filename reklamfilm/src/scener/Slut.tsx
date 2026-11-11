import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { RorligBild, Sno, useSkala } from "../Effekter";
import { F_BROD, FARG } from "../stil";
import { Rad, Textyta } from "./Text";

export type SlutProps = { pris: string; webb: string };

// Scen 6 – omslaget (har titeln inbakad) + uppmaning.
export const Slut: React.FC<SlutProps> = ({ pris, webb }) => {
  const frame = useCurrentFrame();
  const s = useSkala();
  return (
    <AbsoluteFill>
      <RorligBild
        fil="omslag.jpg"
        position="50% 0%"
        skala={interpolate(frame, [0, 160], [1.08, 1.0], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })}
        forskjutning="0% 0%"
      />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(5,10,13,0) 50%, rgba(5,10,13,.8) 66%, rgba(5,10,13,.8) 82%, rgba(5,10,13,0) 100%)" }} />
      <Sno antal={60} />
      <Textyta topp={0.6} gap={20}>
        <Rad typ="maskin" fran={20} storlek={42} farg={FARG.barnsten}>Adventsmysteriet 2026</Rad>
        <Rad fran={32} storlek={62}>Spela tillsammans – upp till 5 per lag</Rad>
        <Rad fran={48} storlek={56} farg={FARG.dampad} stil={{ fontFamily: F_BROD }}>{pris}</Rad>
        <div style={{ height: 14 * s }} />
        <Rad fran={64} storlek={64} stil={{ fontFamily: F_BROD, fontWeight: 600, color: "#1c1306", textShadow: "none", background: FARG.barnsten, padding: `${16 * s}px ${44 * s}px`, borderRadius: 10 * s }}>
          {webb}
        </Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
