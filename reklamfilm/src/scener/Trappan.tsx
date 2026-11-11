import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RorligBild, Vinjett } from "../Effekter";
import { Rad, Textyta } from "./Text";

// Scen 3 – brottsplatsen i spiraltrappan.
export const Trappan: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RorligBild
        fil="brottsplats.jpg"
        position="72% 50%"
        skala={interpolate(frame, [0, 115], [1.25, 1.08], { extrapolateRight: "clamp" })}
        forskjutning="0% 4%"
      />
      <Vinjett band="topp" />
      <Textyta topp={0.13}>
        <Rad fran={6} storlek={88}>Färjan går inte.</Rad>
        <Rad fran={30} storlek={88}>Ingen kan lämna ön.</Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
