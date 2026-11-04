import "server-only";
import type { Lag } from "./db";

const BAS = () => process.env.BAS_URL || "https://adventdeckare.alexcloud.se";
export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export function mejlKonfigurerat() {
  return !!process.env.BREVO_API_KEY;
}

async function skicka(till: string, amne: string, html: string) {
  if (!process.env.BREVO_API_KEY) {
    console.warn(`[mejl] BREVO_API_KEY saknas – skickar inte "${amne}" till ${till}`);
    return false;
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Mordet på Klovskär", email: process.env.MAIL_FROM || "adventdeckare@alexcloud.se" },
      replyTo: process.env.SALJARE_EPOST ? { email: process.env.SALJARE_EPOST } : undefined,
      to: [{ email: till }],
      subject: amne,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    console.error(`[mejl] Brevo ${res.status}: ${await res.text()}`);
    return false;
  }
  return true;
}

function ram(innehall: string) {
  return `<!doctype html><html lang="sv"><body style="margin:0;background:#0e1a1f;padding:24px 12px;font-family:Georgia,serif;color:#e9e1d2">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#142329;border:1px solid #284049">
<tr><td><img src="${BAS()}/api/bild/hotellet-dag?w=960" width="560" alt="Hotell Fyrbåken och fyrtornet på Klovskär i vinterljus" style="display:block;width:100%;height:auto"></td></tr>
<tr><td style="padding:28px 28px 32px;font-size:17px;line-height:1.6">${innehall}</td></tr>
</table>
<p style="color:#9fb2b5;font-size:13px;margin-top:16px">Mordet på Klovskär · Adventsmysteriet 2026 · ${esc(process.env.SALJARE_NAMN || "")} · ${esc(process.env.SALJARE_EPOST || "")}</p>
</td></tr></table></body></html>`;
}

const kodruta = (kod: string) =>
  `<p style="font-family:'Courier New',monospace;font-size:28px;letter-spacing:4px;color:#e2a24a;background:#0b171c;border:1px dashed #b9772a;padding:14px;text-align:center;margin:18px 0">${esc(kod)}</p>`;

const knapp = (url: string, text: string) =>
  `<p style="margin:22px 0"><a href="${url}" style="background:#e2a24a;color:#1c1306;padding:14px 22px;text-decoration:none;font-weight:bold;border-radius:4px;display:inline-block">${esc(text)}</a></p>`;

export async function mejlaKop(epost: string, kod: string, typ: "kop" | "present") {
  const lank = `${BAS()}/aktivera?kod=${encodeURIComponent(kod)}`;
  if (typ === "present") {
    return skicka(epost, "Ditt presentkort – Mordet på Klovskär", ram(`
<h1 style="font-weight:normal;font-size:28px;margin:0 0 12px">Tack för ditt köp!</h1>
<p>Här är presentkortet. Skicka vidare länken nedan, eller skriv ut presentkortet och lägg det under granen.</p>
${knapp(`${BAS()}/presentkort/${encodeURIComponent(kod)}`, "Öppna presentkortet")}
<p>Koden på kortet:</p>${kodruta(kod)}
<p>Den som får kortet går till <b>${BAS().replace(/^https?:\/\//, "")}/aktivera</b>, skriver in koden och skapar sitt lag. Koden kan bara användas en gång.</p>
<p style="color:#9fb2b5;font-size:14px">Kvittot kommer i ett separat mejl från Stripe.</p>`));
  }
  return skicka(epost, "Er aktiveringskod – Mordet på Klovskär", ram(`
<h1 style="font-weight:normal;font-size:28px;margin:0 0 12px">Välkomna till Klovskär</h1>
<p>Tack för ert köp. Här är er aktiveringskod:</p>${kodruta(kod)}
${knapp(lank, "Skapa ert lag")}
<p>När laget är skapat får ni en lagkod att dela – hela fem personer kan vara med i samma lag. Ni väljer själva om luckorna ska följa adventskalendern eller börja ett eget datum.</p>
<p style="color:#9fb2b5;font-size:14px">Spara det här mejlet. Kvittot kommer i ett separat mejl från Stripe.</p>`));
}

export async function mejlaLedarlank(lag: Lag) {
  if (!lag.ledare_epost) return false;
  return skicka(lag.ledare_epost, `Lagledarlänk för ${lag.namn} – Mordet på Klovskär`, ram(`
<h1 style="font-weight:normal;font-size:28px;margin:0 0 12px">${esc(lag.namn)} är på plats</h1>
<p>Du är lagledare. Med länken nedan kan du alltid komma tillbaka som lagledare – på vilken enhet som helst. Dela den inte.</p>
${knapp(`${BAS()}/ledare/${lag.ledare_token}`, "Öppna som lagledare")}
<p>Lagkoden att dela med laget:</p>${kodruta(lag.kod)}
<p>Vännerna går med på <b>${BAS().replace(/^https?:\/\//, "")}/g/${esc(lag.kod)}</b>.</p>`));
}

export async function mejlaMorgon(lag: Lag, nr: number, teaser: string) {
  if (!lag.ledare_epost || !lag.morgonmejl) return false;
  return skicka(lag.ledare_epost, `Lucka ${nr} är öppen – ${lag.namn}`, ram(`
<p style="font-family:'Courier New',monospace;color:#e2a24a;letter-spacing:2px;font-size:13px;text-transform:uppercase;margin:0 0 6px">${nr} december 1962</p>
<h1 style="font-weight:normal;font-size:26px;margin:0 0 14px">${esc(teaser)}</h1>
${knapp(`${BAS()}/lag/lucka/${nr}`, `Öppna lucka ${nr}`)}
<p style="color:#9fb2b5;font-size:14px">Du får det här mejlet för att du slog på morgonmejl som lagledare. Stäng av under Laget.</p>`));
}
