import type { Avsnitt } from "@/content/typer";
import { Forhor, Text } from "./Text";

// Varje format har sin egen papperskänsla: telegram på gult papper, förhör som
// maskinskriven utskrift, anteckningsbok i handstil osv.
export function Dokument({ a }: { a: Avsnitt }) {
  const klass = `dok dok-${a.format}`;
  return (
    <section className={klass}>
      {a.rubrik && <h3 className="dok-rubrik">{a.rubrik}</h3>}
      <div className="dok-text">
        {a.format === "forhor" ? <Forhor text={a.text} /> : a.format === "telegram" ? <TelegramText text={a.text} /> : <Text text={a.text} />}
      </div>
    </section>
  );
}

function TelegramText({ text }: { text: string }) {
  return (
    <div className="telegram-remsor">
      {text.trim().split("\n").map((r, i) => <span key={i} className="remsa">{r}</span>)}
    </div>
  );
}
