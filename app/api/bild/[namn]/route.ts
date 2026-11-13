import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { BREDDER, hittaBildfil, platshallareSvg, skaladBild, bildensAtkomst } from "@/lib/bilder";
import { farSeBild } from "@/lib/innehall";
import { arAdmin, inloggad } from "@/lib/session";
import { serverNu } from "@/lib/tid";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ namn: string }> }) {
  const { namn } = await params;
  const atkomst = bildensAtkomst(namn);
  const publik = atkomst.slag === "publik";

  if (!publik) {
    await cookies();
    const i = await inloggad(atkomst.slag === "barnlucka" ? "barn" : "klovskar");
    const admin = await arAdmin();
    if (!farSeBild(namn, i?.lag ?? null, i?.nu ?? serverNu(), admin)) {
      // Samma svar oavsett om bilden finns – avslöja inget om låsta luckor
      return new Response("Inte öppen än", { status: 404, headers: { "Cache-Control": "no-store" } });
    }
  }

  // Låsta bilder får aldrig hamna i Cloudflares delade cache
  const cache = publik ? "public, max-age=86400" : "private, max-age=3600";
  const fil = hittaBildfil(namn);
  if (!fil) {
    console.warn(`[bild] saknas: ${namn}`);
    return new Response(platshallareSvg(namn), { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-cache" } });
  }
  const onskad = Number(req.nextUrl.searchParams.get("w")) || 960;
  const bredd = BREDDER.reduce((b, x) => (Math.abs(x - onskad) < Math.abs(b - onskad) ? x : b), 960);
  const buf = await skaladBild(fil, namn, bredd);
  return new Response(new Uint8Array(buf), { headers: { "Content-Type": "image/webp", "Cache-Control": cache } });
}
