"use client";
import { useEffect, useRef } from "react";

// Diskret snöfall. Stängs av helt vid prefers-reduced-motion.
export function Snofall({ tathet = 70 }: { tathet?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const flingor = Array.from({ length: tathet }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, v: 0.15 + Math.random() * 0.45, s: Math.random() * Math.PI * 2 }));
    const storlek = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    storlek();
    window.addEventListener("resize", storlek);
    const rita = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(233, 240, 242, 0.75)";
      for (const f of flingor) {
        f.y += f.v / h * 2.2; f.s += 0.01;
        if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
        const x = f.x * w + Math.sin(f.s) * 12, y = f.y * h;
        ctx.globalAlpha = 0.35 + f.r / 4;
        ctx.beginPath(); ctx.arc(x, y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(rita);
    };
    rita();
    const synlig = () => { if (document.hidden) cancelAnimationFrame(raf); else rita(); };
    document.addEventListener("visibilitychange", synlig);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", storlek); document.removeEventListener("visibilitychange", synlig); };
  }, [tathet]);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}
