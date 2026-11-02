import type { ReactNode } from "react";

// Liten markdown-tolk för våra egna texter: **fet**, *kursiv*, ~~struken~~,
// stycken, radbrytningar och enkla listor. Bygger React-element, aldrig rå HTML.

function inline(s: string, nyckel: string): ReactNode[] {
  const ut: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*)/g;
  let senast = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > senast) ut.push(s.slice(senast, m.index));
    const t = m[0];
    const k = `${nyckel}-${i++}`;
    if (t.startsWith("**")) ut.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("~~")) ut.push(<s key={k}>{t.slice(2, -2)}</s>);
    else ut.push(<em key={k}>{t.slice(1, -1)}</em>);
    senast = m.index + t.length;
  }
  if (senast < s.length) ut.push(s.slice(senast));
  return ut;
}

function medRadbrytningar(s: string, nyckel: string): ReactNode[] {
  const rader = s.split("\n");
  return rader.flatMap((r, i) => (i === 0 ? inline(r, `${nyckel}-${i}`) : [<br key={`${nyckel}-br${i}`} />, ...inline(r, `${nyckel}-${i}`)]));
}

export function Text({ text }: { text: string }) {
  const block = text.trim().split(/\n\s*\n/);
  return (
    <>
      {block.map((b, i) => {
        const rader = b.split("\n");
        if (rader.every((r) => /^- /.test(r))) {
          return <ul key={i}>{rader.map((r, j) => <li key={j}>{inline(r.slice(2), `${i}-${j}`)}</li>)}</ul>;
        }
        if (rader.every((r) => /^\d+\. /.test(r))) {
          return <ol key={i}>{rader.map((r, j) => <li key={j}>{inline(r.replace(/^\d+\. /, ""), `${i}-${j}`)}</li>)}</ol>;
        }
        if (rader.length === 1 && /^\*\*[^*]+\*\*$/.test(rader[0])) {
          return <h4 key={i}>{rader[0].slice(2, -2)}</h4>;
        }
        if (rader[0].startsWith("**") && rader[0].endsWith("**") && rader.length > 1) {
          return (
            <div key={i}>
              <h4>{rader[0].slice(2, -2)}</h4>
              {rader.slice(1).every((r) => /^- /.test(r))
                ? <ul>{rader.slice(1).map((r, j) => <li key={j}>{inline(r.slice(2), `${i}-${j}`)}</li>)}</ul>
                : rader.slice(1).every((r) => /^\d+\. /.test(r))
                  ? <ol>{rader.slice(1).map((r, j) => <li key={j}>{inline(r.replace(/^\d+\. /, ""), `${i}-${j}`)}</li>)}</ol>
                  : <p>{medRadbrytningar(rader.slice(1).join("\n"), `${i}`)}</p>}
            </div>
          );
        }
        return <p key={i}>{medRadbrytningar(b, `${i}`)}</p>;
      })}
    </>
  );
}

/** Förhörsutskrift: "NAMN: replik" och (scenanvisningar). */
export function Forhor({ text }: { text: string }) {
  const rader = text.trim().split("\n").filter((r) => r.trim());
  return (
    <div className="forhor-rader">
      {rader.map((r, i) => {
        const m = /^([A-ZÅÄÖ .]+):\s*(.*)$/.exec(r);
        if (m) {
          return (
            <p key={i} className={m[1] === "SANDAHL" ? "replik replik-sandahl" : "replik"}>
              <span className="talare">{m[1]}</span>
              <span>{inline(m[2], String(i))}</span>
            </p>
          );
        }
        return <p key={i} className="anvisning">{inline(r, String(i))}</p>;
      })}
    </div>
  );
}
