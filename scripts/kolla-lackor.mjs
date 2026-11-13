// Körs efter varje bygge. Söker i allt som skickas till webbläsaren efter strängar
// som bara får finnas på servern. Hittas något fallerar bygget.
import fs from "node:fs";
import path from "node:path";

const HEMLIGT = [
  "Margit Lund dödade",          // facit
  "Det var husfrun",             // facit
  "\"SVANHILD\"", "\"LYKTA\"", "\"LUCIA\"", "\"KRAKSKAR\"", "\"SAFFRAN\"", "\"2252\"", // bonussvar
  "Ljuset störde till",          // lucka 5
  "Blodgrupp: AB",               // lucka 20
  "vårt barn är fött",           // lucka 21
  "Kronan var",                  // lucka 23
  "Bok för värnpliktig",         // lucka 17
  "M.L. 25 kr",                  // lucka 21
  // Barndeckaren (Stjärnan som försvann)
  "Vi tog stjärnan",             // lucka 14
  "Avtuggat",                    // lucka 16
  "Mitt i halmen låg Mackan",    // lucka 22
  "släpade hem stjärnan",        // lucka 22
];

function filer(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? filer(p) : [p];
  });
}

const kandidater = [
  ...filer(".next/static"),
  ...filer(".next/server/app").filter((f) => /\.(html|rsc|body)$/.test(f)),
  ...filer("public"),
];

let fel = 0;
for (const f of kandidater) {
  const text = fs.readFileSync(f, "utf8");
  for (const s of HEMLIGT) {
    if (text.includes(s)) {
      console.error(`LÄCKA: "${s}" finns i ${f}`);
      fel++;
    }
  }
}
if (fel) {
  console.error(`\n${fel} läckor – bygget stoppas.`);
  process.exit(1);
}
console.log(`Läckkoll: ${kandidater.length} klientfiler genomsökta, inga hemligheter hittade.`);
