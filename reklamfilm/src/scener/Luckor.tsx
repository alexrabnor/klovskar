import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Sno, useSkala, Vinjett } from "../Effekter";
import { FARG } from "../stil";
import { Rad, Textyta } from "./Text";

// Scen 5 – så funkar spelet.
export const Luckor: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSkala();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #17313a 0%, #0e1a1f 50%, #0b161b 100%)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={staticFile("bilder/karta.jpg")}
          style={{
            width: 820 * s,
            boxShadow: "0 30px 80px rgba(0,0,0,.8)",
            rotate: interpolate(frame, [0, 160], ["3deg", "-1deg"]),
            scale: String(interpolate(frame, [0, 160], [1.02, 1.1])),
            opacity: 0.55,
          }}
        />
      </AbsoluteFill>
      <Vinjett band="mitt" />
      <Sno antal={50} styrka={0.7} />
      <Textyta topp={0.2} gap={34}>
        <Rad fran={4} storlek={150} farg={FARG.barnsten}>24 luckor</Rad>
        <Rad typ="maskin" fran={22} storlek={46}>En ny varje morgon kl. 06.00</Rad>
        <Rad fran={55} storlek={78} stil={{ marginTop: 60 * s }}>Förhör, brev och fotografier från utredningen.</Rad>
        <Rad fran={95} storlek={78}>Lös fallet med ditt lag före julafton.</Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
