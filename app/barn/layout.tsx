import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { barnPa } from "@/lib/spel";

const BAS = process.env.BAS_URL || "https://adventdeckare.se";
const BESKRIVNING = "En adventsdeckare för barn 6–10 år. Julstjärnan i fyren är borta, och fyrkatten Sotis behöver hjälp. 24 luckor med en kort berättelse, en fråga och ett frivilligt uppdrag att göra på riktigt.";

export const metadata: Metadata = {
  title: { default: "Stjärnan som försvann", template: "%s · Stjärnan som försvann" },
  description: BESKRIVNING,
  openGraph: {
    type: "website",
    url: `${BAS}/barn`,
    siteName: "Stjärnan som försvann",
    title: "Stjärnan som försvann",
    description: BESKRIVNING,
    locale: "sv_SE",
    images: [{ url: `${BAS}/api/bild/barn-omslag?w=1200` }],
  },
  appleWebApp: { capable: true, title: "Måsholmen", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#0f1f45", width: "device-width", initialScale: 1, viewportFit: "cover" };

export const dynamic = "force-dynamic";

export default function BarnLayout({ children }: { children: React.ReactNode }) {
  // Barndeckaren syns bara där den är påslagen (BARN=1). Annars finns sidorna inte.
  if (!barnPa()) notFound();
  return <div className="barn">{children}</div>;
}
