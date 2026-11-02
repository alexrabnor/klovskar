"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Stamning } from "@/content/ljud";

// Ljud är av tills spelaren slår på det. Web Audio i stället för <audio loop>,
// eftersom mp3 annars får ett hörbart glapp i skarven.

const NYCKEL = "klov-ljud";
const LOOP_VOLYM = 0.55;
const OPPNA_VOLYM = 0.7;
const KANT = 0.03; // sekunder som kapas i loopens ändar (mp3-kodarens tystnad)

let ctx: AudioContext | null = null;
let pa = false;
let onskad: Stamning | null = null;
let spelar: { namn: Stamning; kalla: AudioBufferSourceNode; gain: GainNode } | null = null;
const buffertar = new Map<string, Promise<AudioBuffer>>();
const lyssnare = new Set<() => void>();

function lasPa() {
  try { return localStorage.getItem(NYCKEL) === "1"; } catch { return false; }
}

function kontext() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function buffert(namn: string) {
  let p = buffertar.get(namn);
  if (!p) {
    p = fetch(`/ljud/${namn}.mp3`).then((r) => r.arrayBuffer()).then((b) => kontext().decodeAudioData(b));
    p.catch(() => buffertar.delete(namn));
    buffertar.set(namn, p);
  }
  return p;
}

function tonaUt(sekunder = 1) {
  if (!spelar || !ctx) return;
  const { kalla, gain } = spelar;
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.linearRampToValueAtTime(0, t + sekunder);
  kalla.stop(t + sekunder + 0.05);
  spelar = null;
}

async function startaLoop(namn: Stamning) {
  if (spelar?.namn === namn) return;
  tonaUt();
  const buf = await buffert(namn).catch(() => null);
  if (!buf || !pa || onskad !== namn || spelar) return;
  const c = kontext();
  const kalla = c.createBufferSource();
  kalla.buffer = buf;
  kalla.loop = true;
  kalla.loopStart = KANT;
  kalla.loopEnd = buf.duration - KANT;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(LOOP_VOLYM, c.currentTime + 2.5);
  kalla.connect(gain).connect(c.destination);
  kalla.start(0, KANT);
  spelar = { namn, kalla, gain };
}

async function spelaOppna() {
  const buf = await buffert("oppna").catch(() => null);
  if (!buf || !pa) return;
  const c = kontext();
  const kalla = c.createBufferSource();
  kalla.buffer = buf;
  const gain = c.createGain();
  gain.gain.value = OPPNA_VOLYM;
  kalla.connect(gain).connect(c.destination);
  kalla.start();
}

function meddela() { lyssnare.forEach((f) => f()); }

function satPa(varde: boolean) {
  pa = varde;
  try { localStorage.setItem(NYCKEL, varde ? "1" : "0"); } catch {}
  if (varde) {
    kontext();
    if (onskad) startaLoop(onskad);
  } else {
    tonaUt(0.4);
  }
  meddela();
}

let initierad = false;
function initiera() {
  if (initierad || typeof window === "undefined") return;
  initierad = true;
  pa = lasPa();
  // Webbläsaren släpper inte ut ljud före första tryckningen på sidan.
  const vack = () => { if (pa && ctx?.state === "suspended") ctx.resume().catch(() => {}); if (pa && onskad && !spelar) startaLoop(onskad); };
  window.addEventListener("pointerdown", vack, { passive: true });
  window.addEventListener("keydown", vack);
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else if (pa) ctx.resume().catch(() => {});
  });
}

function prenumerera(f: () => void) {
  initiera();
  lyssnare.add(f);
  return () => { lyssnare.delete(f); };
}

export function LjudKnapp() {
  const ar = useSyncExternalStore(prenumerera, () => pa, () => false);
  return (
    <button
      type="button"
      className="ljud-knapp"
      aria-pressed={ar}
      aria-label={ar ? "Stäng av ljud" : "Slå på ljud"}
      title={ar ? "Stäng av ljud" : "Slå på ljud"}
      onClick={() => satPa(!ar)}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" stroke="none" />
        {ar
          ? <><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>
          : <><path d="M16 9l5 6" /><path d="M21 9l-5 6" /></>}
      </svg>
      <span className="ljud-text">{ar ? "Ljud på" : "Ljud av"}</span>
    </button>
  );
}

/** Läggs på en lucksida: prassel när luckan öppnas, sedan platsens stämningsljud tills man lämnar sidan. */
export function LuckLjud({ stamning }: { stamning?: Stamning }) {
  useEffect(() => {
    initiera();
    onskad = stamning ?? null;
    if (pa) {
      spelaOppna();
      if (stamning) startaLoop(stamning);
    }
    return () => {
      if (onskad === (stamning ?? null)) onskad = null;
      // Vänta ett ögonblick: bläddrar man till en lucka med samma stämning fortsätter loopen utan omstart.
      setTimeout(() => { if (!onskad) tonaUt(); }, 80);
    };
  }, [stamning]);
  return null;
}
