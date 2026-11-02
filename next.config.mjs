/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 och sharp är native-moduler – låt Node ladda dem direkt
  serverExternalPackages: ["better-sqlite3", "sharp", "web-push"],
  poweredByHeader: false,
  turbopack: { root: import.meta.dirname },
  async headers() {
    return [
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: "no-cache" }] },
    ];
  },
};
export default nextConfig;
