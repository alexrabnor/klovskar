// Serverkomponent: ritar signalflaggor som SVG så att bokstäverna aldrig når webbläsaren.
export function Signalflaggor({ bokstaver }: { bokstaver: string[] }) {
  return (
    <div className="flaggor" role="img" aria-label={`${bokstaver.length} internationella signalflaggor i rad`}>
      {bokstaver.map((f, i) => <Flagga key={i} bokstav={f} />)}
    </div>
  );
}

// Internationella signalflaggor (de bokstäver som behövs här), ritade i SVG
function Flagga({ bokstav }: { bokstav: string }) {
  const R = "#c8102e", B = "#0b3d91", Y = "#f6c400", W = "#ffffff";
  const ram = <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="#0003" />;
  switch (bokstav) {
    case "A":
      return <svg viewBox="0 0 60 40" aria-hidden="true"><rect width="30" height="40" fill={W} /><path d="M30 0H60L48 20L60 40H30Z" fill={B} />{ram}</svg>;
    case "S":
      return <svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill={W} /><rect x="20" y="12" width="20" height="16" fill={B} />{ram}</svg>;
    case "F":
      return <svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill={W} /><path d="M30 0L60 20L30 40L0 20Z" fill={R} />{ram}</svg>;
    case "R":
      return <svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill={R} /><rect x="25" width="10" height="40" fill={Y} /><rect y="15" width="60" height="10" fill={Y} />{ram}</svg>;
    case "N":
      return (
        <svg viewBox="0 0 60 40" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => <rect key={i} x={(i % 4) * 15} y={Math.floor(i / 4) * 10} width="15" height="10" fill={(i % 4 + Math.floor(i / 4)) % 2 ? W : B} />)}
          {ram}
        </svg>
      );
    default:
      return <svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#999" /></svg>;
  }
}
