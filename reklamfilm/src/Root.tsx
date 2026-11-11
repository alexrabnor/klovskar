import React from "react";
import { Composition, Folder } from "remotion";
import { LANGD, Reklamfilm, SCENER } from "./Reklamfilm";
import { Ankomst } from "./scener/Ankomst";
import { Telegram } from "./scener/Telegram";
import { Trappan } from "./scener/Trappan";
import { DeSju } from "./scener/DeSju";
import { Luckor } from "./scener/Luckor";
import { Slut, SlutProps } from "./scener/Slut";

const FPS = 30;
const props: SlutProps = { pris: "Introduktionspris 99 kr per lag", webb: "adventdeckare.se" };

export const RemotionRoot: React.FC = () => (
  <>
    {/* 9:16 – Reels, TikTok, Stories, Shorts */}
    <Composition id="Reklam-9x16" component={Reklamfilm} width={1080} height={1920} fps={FPS} durationInFrames={LANGD} defaultProps={props} />
    {/* 4:5 – Facebook- och Instagram-flöde */}
    <Composition id="Reklam-4x5" component={Reklamfilm} width={1080} height={1350} fps={FPS} durationInFrames={LANGD} defaultProps={props} />
    <Folder name="Scener">
      <Composition id="Ankomst" component={Ankomst} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.ankomst} />
      <Composition id="Telegram" component={Telegram} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.telegram} />
      <Composition id="Trappan" component={Trappan} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.trappan} />
      <Composition id="DeSju" component={DeSju} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.deSju} />
      <Composition id="Luckor" component={Luckor} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.luckor} />
      <Composition id="Slut" component={Slut} width={1080} height={1920} fps={FPS} durationInFrames={SCENER.slut} defaultProps={props} />
    </Folder>
  </>
);
