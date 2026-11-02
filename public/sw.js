// Service worker: bara för push-notiser. Ingen offline-cache – luckorna ska alltid komma färska från servern.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = { titel: "Mordet på Klovskär", text: "En ny lucka är öppen.", url: "/lag" };
  try { d = { ...d, ...e.data.json() }; } catch {}
  e.waitUntil(self.registration.showNotification(d.titel, {
    body: d.text, icon: "/apple-touch-icon.png", badge: "/badge.png", data: { url: d.url }, tag: d.url,
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/lag";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lista) => {
    for (const c of lista) if ("focus" in c) { c.navigate(url); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
