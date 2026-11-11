import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Snö som faller jämnt – deterministisk så att varje rendering blir likadan.
export const Sno: React.FC<{ antal?: number; styrka?: number }> = ({ antal = 90, styrka = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(antal).fill(0).map((_, i) => {
        const djup = random(`d${i}`);
        const storlek = 3 + djup * 9;
        const fart = 1.2 + djup * 3.2;
        const y = ((random(`y${i}`) * (height + 40) + frame * fart) % (height + 40)) - 20;
        const x = random(`x${i}`) * width + Math.sin(frame / (25 + djup * 30) + i) * 18 * djup;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: storlek,
              height: storlek,
              borderRadius: "50%",
              background: "#fff",
              opacity: (0.25 + djup * 0.6) * styrka,
              filter: djup < 0.35 ? "blur(1.5px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Mörk kant runt bilden + mörkare band där texten ligger.
export const Vinjett: React.FC<{ band?: "topp" | "botten" | "mitt" | "ingen" }> = ({ band = "botten" }) => {
  const gradient =
    band === "botten"
      ? "linear-gradient(to bottom, rgba(5,10,13,0) 35%, rgba(5,10,13,.85) 75%, rgba(5,10,13,.95) 100%)"
      : band === "topp"
        ? "linear-gradient(to top, rgba(5,10,13,0) 40%, rgba(5,10,13,.85) 80%, rgba(5,10,13,.95) 100%)"
        : band === "mitt"
          ? "linear-gradient(to bottom, rgba(5,10,13,.2), rgba(5,10,13,.75) 50%, rgba(5,10,13,.2))"
          : "none";
  return (
    <>
      <AbsoluteFill style={{ background: gradient }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 60px rgba(0,0,0,.75)" }} />
    </>
  );
};

// Bild som fyller rutan och rör sig långsamt (Ken Burns).
export const RorligBild: React.FC<{
  fil: string;
  skala: number;
  forskjutning: string;
  position?: string;
}> = ({ fil, skala, forskjutning, position = "50% 50%" }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
    <Img
      src={staticFile(`bilder/${fil}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        scale: String(skala),
        translate: forskjutning,
      }}
    />
  </AbsoluteFill>
);

export const useSkala = () => useVideoConfig().width / 1080;
