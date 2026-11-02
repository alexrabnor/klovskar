/** Kort spelinstruktion – på välkomstsidan och överst i lucka 1. */
export function SaSpelarNi() {
  return (
    <section className="panel stack sa-spelar-ni" aria-labelledby="sa-spelar-ni">
      <h2 id="sa-spelar-ni" style={{ fontSize: 22 }}>Så spelar ni</h2>
      <ul>
        <li>Varje morgon kl. 06 öppnas en lucka med kommissarie Sandahls material. Läs, diskutera och fäst det ni tror på på anslagstavlan.</li>
        <li>Frågan längst ner i varje lucka är en hjälp för diskussionen. Ni behöver inte svara på den.</li>
        <li>Under <i>Sandahls tanke</i> står hennes egna slutsatser. Försök gärna själva först.</li>
        <li>Chiffren är frivilliga. De ger extra material och poäng, men fallet går att lösa utan dem.</li>
        <li>På julafton lämnar lagledaren in er anklagelse: <b>vem, varför, hur och vilken tid Harald dog</b>. Allt ni behöver finns i lucka 1–23.</li>
      </ul>
    </section>
  );
}
