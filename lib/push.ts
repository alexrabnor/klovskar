import "server-only";
import webpush from "web-push";
import { db } from "./db";

let konfigurerad: boolean | null = null;

export function pushKonfigurerad(): boolean {
  if (konfigurerad !== null) return konfigurerad;
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return (konfigurerad = false);
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:klovskar@alexcloud.se", pub, priv);
  return (konfigurerad = true);
}

export function sparaPrenumeration(spelareId: number, sub: { endpoint: string }) {
  db().prepare(`INSERT INTO klov_push (spelare_id, endpoint, data) VALUES (?, ?, ?)
    ON CONFLICT(endpoint) DO UPDATE SET spelare_id = excluded.spelare_id, data = excluded.data`)
    .run(spelareId, sub.endpoint, JSON.stringify(sub));
}

export function taBortPrenumeration(endpoint: string) {
  db().prepare("DELETE FROM klov_push WHERE endpoint = ?").run(endpoint);
}

export async function pushaTillSpelare(spelareIds: number[], meddelande: { titel: string; text: string; url: string }) {
  if (!pushKonfigurerad() || spelareIds.length === 0) return 0;
  const rader = db().prepare(`SELECT endpoint, data FROM klov_push WHERE spelare_id IN (${spelareIds.map(() => "?").join(",")})`)
    .all(...spelareIds) as { endpoint: string; data: string }[];
  let skickade = 0;
  await Promise.all(rader.map(async (r) => {
    try {
      await webpush.sendNotification(JSON.parse(r.data), JSON.stringify(meddelande), { TTL: 60 * 60 * 12, urgency: "normal" });
      skickade++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) taBortPrenumeration(r.endpoint);
      else console.warn("[push]", status, (e as Error).message);
    }
  }));
  return skickade;
}
