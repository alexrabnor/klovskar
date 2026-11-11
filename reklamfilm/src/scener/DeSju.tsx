import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useSkala, Vinjett } from "../Effekter";
import { FARG } from "../stil";
import { Rad, Textyta } from "./Text";

// Scen 4 – de sju misstänkta på anslagstavlan.
export const DeSju: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSkala();
  const { height } = useVideoConfig();
  const hog = height / 1080 > 1.5; // 9:16
  // Tavlan får plats mellan texterna även i 4:5.
  const bredd = hog ? 1000 * s : height * 0.56;
  return (
    <AbsoluteFill style={{ background: FARG.natt }}>
      <Img
        src={staticFile("bilder/misstankta.jpg")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(.45)", scale: "1.2" }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: hog ? 0 : height * 0.02 }}>
        <Img
          src={staticFile("bilder/misstankta.jpg")}
          style={{
            width: bredd,
            borderRadius: 6 * s,
            boxShadow: "0 30px 80px rgba(0,0,0,.8)",
            rotate: interpolate(frame, [0, 170], ["-1.5deg", "0.5deg"]),
            scale: String(interpolate(frame, [0, 170], [0.94, 1.04], { easing: Easing.inOut(Easing.quad) })),
          }}
        />
      </AbsoluteFill>
      <Vinjett band="ingen" />
      <Textyta topp={hog ? 0.1 : 0.04}>
        <Rad fran={6} storlek={hog ? 86 : 70}>Sju personer var på ön den natten.</Rad>
      </Textyta>
      <Textyta topp={hog ? 0.72 : 0.8}>
        <Rad fran={70} storlek={hog ? 96 : 80} farg={FARG.barnsten}>En av dem är mördaren.</Rad>
      </Textyta>
    </AbsoluteFill>
  );
};
