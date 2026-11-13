import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Baloo_2, Caveat, DM_Serif_Display, Source_Serif_4, Special_Elite } from "next/font/google";
import "./globals.css";
import "./barn.css";
import { TestBanderoll } from "@/components/TestBanderoll";

const rubrik = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-rubrik", display: "swap" });
const brod = Source_Serif_4({ subsets: ["latin"], variable: "--f-brod", display: "swap" });
const maskin = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--f-maskin", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--f-hand", display: "swap" });

// Barndeckarens typsnitt. Förladdas inte, så att Klovskärs sidor inte hämtar dem i onödan.
const barnRubrik = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--f-barn-rubrik", display: "swap", preload: false });
const barnBrod = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-barn-brod", display: "swap", preload: false });

const BAS = process.env.BAS_URL || "https://adventdeckare.se";
const BESKRIVNING = "Adventsmysteriet 2026. En adventskalender där ni löser ett mord tillsammans: en ny lucka varje morgon, ett lag där hela fem personer kan vara med, och svaret på julafton.";

export const metadata: Metadata = {
  metadataBase: new URL(BAS),
  title: { default: "Mordet på Klovskär", template: "%s · Mordet på Klovskär" },
  description: BESKRIVNING,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: `${BAS}/`,
    siteName: "Mordet på Klovskär",
    title: "Mordet på Klovskär",
    description: BESKRIVNING,
    locale: "sv_SE",
    images: [{ url: `${BAS}/og.jpg`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Mordet på Klovskär", description: BESKRIVNING, images: [`${BAS}/og.jpg`] },
  appleWebApp: { capable: true, title: "Klovskär", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0e1a1f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${rubrik.variable} ${brod.variable} ${maskin.variable} ${hand.variable} ${barnRubrik.variable} ${barnBrod.variable}`}>
      <body>
        <TestBanderoll />
        <div className="korn" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
