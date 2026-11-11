import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { F_RUBRIK, F_MASKIN, FARG, SKUGGA } from "../stil";
import { useSkala } from "../Effekter";

const ut = Easing.bezier(0.16, 1, 0.3, 1);

// En textrad som tonar in och glider upp lite. `fran` och `till` i bildrutor inom scenen.
export const Rad: React.FC<{
  children: React.ReactNode;
  fran: number;
  till?: number;
  storlek?: number;
  typ?: "rubrik" | "maskin";
  farg?: string;
  stil?: React.CSSProperties;
}> = ({ children, fran, till, storlek = 84, typ = "rubrik", farg = FARG.fg, stil }) => {
  const frame = useCurrentFrame();
  const s = useSkala();
  const in_ = interpolate(frame, [fran, fran + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ut });
  const ut_ = till === undefined ? 1 : interpolate(frame, [till - 10, till], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: in_ * ut_,
        translate: `0px ${(1 - in_) * 28 * s}px`,
        fontFamily: typ === "rubrik" ? F_RUBRIK : F_MASKIN,
        fontSize: storlek * s,
        lineHeight: typ === "rubrik" ? 1.08 : 1.35,
        letterSpacing: typ === "maskin" ? "0.08em" : undefined,
        textTransform: typ === "maskin" ? "uppercase" : undefined,
        color: farg,
        textShadow: SKUGGA,
        textAlign: "center",
        textWrap: "balance",
        ...stil,
      }}
    >
      {children}
    </div>
  );
};

// Textblock placerat inom säkra zonen för Reels/TikTok (undviker gränssnittet nedtill och till höger).
export const Textyta: React.FC<{ children: React.ReactNode; topp: number; gap?: number }> = ({ children, topp, gap = 22 }) => {
  const s = useSkala();
  return (
    <div
      style={{
        position: "absolute",
        left: 90 * s,
        right: 120 * s,
        top: `${topp * 100}%`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: gap * s,
      }}
    >
      {children}
    </div>
  );
};
