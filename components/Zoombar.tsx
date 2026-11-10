"use client";
import { useEffect, useRef, useState } from "react";
import { bildUrl } from "./Bild";

// Pinch och dra på mobil, hjul och förstoringsglas på dator.
export interface BildInfoProp { w: number; h: number; lqip: string }

export function Zoombar({ namn, alt, prioritet, info }: { namn: string; alt: string; prioritet?: boolean; info?: BildInfoProp | null }) {
  const [laddad, setLaddad] = useState(false);
  const ram = useRef<HTMLDivElement>(null);
  const bild = useRef<HTMLImageElement>(null);
  const lupp = useRef<HTMLDivElement>(null);
  const [luppPa, setLuppPa] = useState(false);
  const t = useRef({ s: 1, x: 0, y: 0 });
  const pekare = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{ d: number; s: number; mx: number; my: number; x: number; y: number } | null>(null);

  const tillamp = () => {
    const r = ram.current!.getBoundingClientRect();
    const { s } = t.current;
    // Håll bilden inom ramen
    t.current.x = Math.min(0, Math.max(r.width - r.width * s, t.current.x));
    t.current.y = Math.min(0, Math.max(r.height - r.height * s, t.current.y));
    bild.current!.style.transform = `translate(${t.current.x}px, ${t.current.y}px) scale(${s})`;
    ram.current!.style.cursor = s > 1 ? "grab" : "zoom-in";
  };

  const zooma = (ny: number, cx: number, cy: number) => {
    const s0 = t.current.s;
    const s1 = Math.min(5, Math.max(1, ny));
    t.current.x = cx - ((cx - t.current.x) * s1) / s0;
    t.current.y = cy - ((cy - t.current.y) * s1) / s0;
    t.current.s = s1;
    tillamp();
  };

  // En bild som redan låg i webbläsarens cache hinner bli klar före hydreringen
  useEffect(() => { if (bild.current?.complete && bild.current.naturalWidth) setLaddad(true); }, []);

  useEffect(() => {
    const el = ram.current!;
    const hjul = (e: WheelEvent) => {
      if (!e.ctrlKey && t.current.s === 1 && Math.abs(e.deltaY) < 40) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zooma(t.current.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", hjul, { passive: false });
    return () => el.removeEventListener("wheel", hjul);
  }, []);

  const ned = (e: React.PointerEvent) => {
    ram.current!.setPointerCapture(e.pointerId);
    pekare.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const r = ram.current!.getBoundingClientRect();
    const p = [...pekare.current.values()];
    if (p.length === 2) {
      start.current = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), s: t.current.s, mx: (p[0].x + p[1].x) / 2 - r.left, my: (p[0].y + p[1].y) / 2 - r.top, x: t.current.x, y: t.current.y };
    } else {
      start.current = { d: 0, s: t.current.s, mx: e.clientX, my: e.clientY, x: t.current.x, y: t.current.y };
    }
  };
  const flytta = (e: React.PointerEvent) => {
    const r = ram.current!.getBoundingClientRect();
    if (luppPa && e.pointerType === "mouse" && lupp.current) {
      const lx = e.clientX - r.left, ly = e.clientY - r.top;
      lupp.current.style.left = `${lx - 90}px`;
      lupp.current.style.top = `${ly - 90}px`;
      lupp.current.style.backgroundSize = `${r.width * 3}px ${r.height * 3}px`;
      lupp.current.style.backgroundPosition = `${-lx * 3 + 90}px ${-ly * 3 + 90}px`;
    }
    if (!pekare.current.has(e.pointerId) || !start.current) return;
    pekare.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pekare.current.values()];
    if (p.length === 2 && start.current.d) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      t.current = { s: start.current.s, x: start.current.x, y: start.current.y };
      zooma((start.current.s * d) / start.current.d, start.current.mx, start.current.my);
    } else if (p.length === 1 && t.current.s > 1) {
      t.current.x = start.current.x + (e.clientX - start.current.mx);
      t.current.y = start.current.y + (e.clientY - start.current.my);
      tillamp();
    }
  };
  const upp = (e: React.PointerEvent) => {
    pekare.current.delete(e.pointerId);
    start.current = null;
  };
  const dubbel = (e: React.MouseEvent) => {
    const r = ram.current!.getBoundingClientRect();
    if (t.current.s > 1) { t.current = { s: 1, x: 0, y: 0 }; tillamp(); }
    else zooma(2.5, e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <figure style={{ margin: 0 }}>
      <div ref={ram} className="zoom"
        style={info ? { aspectRatio: `${info.w} / ${info.h}`, backgroundImage: `url(${info.lqip})`, backgroundSize: "cover" } : undefined}
        onPointerDown={ned} onPointerMove={flytta} onPointerUp={upp} onPointerCancel={upp} onDoubleClick={dubbel}>
        <img
          ref={bild}
          src={bildUrl(namn, 960)}
          srcSet={`${bildUrl(namn, 640)} 640w, ${bildUrl(namn, 960)} 960w, ${bildUrl(namn, 1200)} 1200w, ${bildUrl(namn, 1600)} 1600w`}
          sizes="(max-width: 760px) 100vw, 760px"
          alt={alt}
          loading={prioritet ? "eager" : "lazy"}
          fetchPriority={prioritet ? "high" : undefined}
          decoding="async"
          width={info?.w}
          height={info?.h}
          onLoad={() => setLaddad(true)}
          draggable={false}
          className={info && !laddad ? "laddar" : undefined}
          style={{ width: "100%", height: "auto" }}
        />
        <div ref={lupp} className={`lupp${luppPa ? " pa" : ""}`} style={{ backgroundImage: `url(${bildUrl(namn, 1600)})` }} />
        <div className="zoom-kontroller">
          <button type="button" aria-label="Förstoringsglas" title="Förstoringsglas" aria-pressed={luppPa} onClick={() => setLuppPa((v) => !v)} className="bara-dator">🔍</button>
          <button type="button" aria-label="Zooma in" onClick={() => { const r = ram.current!.getBoundingClientRect(); zooma(t.current.s * 1.5, r.width / 2, r.height / 2); }}>+</button>
          <button type="button" aria-label="Zooma ut" onClick={() => { const r = ram.current!.getBoundingClientRect(); zooma(t.current.s / 1.5, r.width / 2, r.height / 2); }}>−</button>
        </div>
      </div>
      <figcaption className="bildtext">Nyp eller dubbeltryck för att zooma.</figcaption>
    </figure>
  );
}
