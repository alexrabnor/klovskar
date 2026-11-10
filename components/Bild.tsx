// Bilder går alltid via /api/bild så att datumlåset gäller även för filerna.
// Ingen next/image: dess optimerare cachar bilder per URL för alla besökare.

export function bildUrl(namn: string, w = 960) {
  return `/api/bild/${namn}?w=${w}`;
}

export function Bild({ namn, alt, sizes = "(max-width: 720px) 100vw, 720px", className, prioritet }: {
  namn: string; alt: string; sizes?: string; className?: string; prioritet?: boolean;
}) {
  return (
    <img
      src={bildUrl(namn, 960)}
      srcSet={`${bildUrl(namn, 640)} 640w, ${bildUrl(namn, 960)} 960w, ${bildUrl(namn, 1200)} 1200w, ${bildUrl(namn, 1600)} 1600w`}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={prioritet ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
