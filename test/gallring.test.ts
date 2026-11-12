import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { stockholm } from "@/lib/tid";

// Egen databasfil, så testet aldrig rör spelets riktiga data
const fil = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "klov-gallring-")), "test.db");
process.env.DB_PATH = fil;

const { db } = await import("@/lib/db");
const { gallra } = await import("@/lib/gallring");

function nyttLag(id: number, startdatum: string) {
  db().prepare("INSERT INTO klov_lag (id, namn, kod, startdatum, ledare_token, ledare_epost, morgonmejl) VALUES (?, ?, ?, ?, ?, ?, 1)")
    .run(id, `Lag ${id}`, `KOD${id}`, startdatum, `tok${id}`, `ledare${id}@exempel.se`);
  db().prepare("INSERT INTO klov_kod (kod, typ, epost, belopp_ore, lag_id) VALUES (?, 'kop', ?, 19900, ?)").run(`AKT${id}`, `kop${id}@exempel.se`, id);
  db().prepare("INSERT INTO klov_spelare (lag_id, namn, token) VALUES (?, 'Anna', ?)").run(id, `sp${id}`);
}

describe("gallringen", () => {
  beforeAll(() => {
    nyttLag(1, "2026-12-01"); // e-post sparas till 24 jan 2028 06.00
    nyttLag(2, "2027-12-01");
  });
  it("rör inget före 13 månader", () => {
    expect(gallra(stockholm(2028, 1, 24, 5, 59))).toBe(0);
  });
  it("tar bort e-post men behåller laget, spelarna och köpet", () => {
    expect(gallra(stockholm(2028, 1, 24, 6, 0))).toBe(1);
    expect(db().prepare("SELECT ledare_epost, morgonmejl FROM klov_lag WHERE id = 1").get()).toEqual({ ledare_epost: null, morgonmejl: 0 });
    expect(db().prepare("SELECT COUNT(*) n FROM klov_spelare WHERE lag_id = 1").get()).toEqual({ n: 1 });
    expect(db().prepare("SELECT epost, belopp_ore FROM klov_kod WHERE kod = 'AKT1'").get()).toEqual({ epost: null, belopp_ore: 19900 });
    expect(db().prepare("SELECT ledare_epost FROM klov_lag WHERE id = 2").get()).toEqual({ ledare_epost: "ledare2@exempel.se" });
  });
  it("gör inget andra gången", () => {
    expect(gallra(stockholm(2028, 1, 25, 6, 0))).toBe(0);
  });
});

describe("gallringen av koder som aldrig aktiverades", () => {
  beforeAll(() => {
    db().prepare("INSERT INTO klov_kod (kod, typ, epost, belopp_ore, skapad) VALUES ('OAKT1', 'present', 'julklapp@exempel.se', 9900, '2026-11-15 10:00:00')").run();
    db().prepare("INSERT INTO klov_kod (kod, typ, epost, belopp_ore, skapad) VALUES ('OAKT2', 'kop', 'senare@exempel.se', 9900, '2027-11-15 10:00:00')").run();
  });
  it("behåller e-posten fram till 13 månader efter köpet", () => {
    expect(gallra(Date.UTC(2027, 11, 15, 9, 59))).toBe(0);
    expect(db().prepare("SELECT epost FROM klov_kod WHERE kod = 'OAKT1'").get()).toEqual({ epost: "julklapp@exempel.se" });
  });
  it("tar bort e-posten efter 13 månader men behåller köpet", () => {
    expect(gallra(Date.UTC(2027, 11, 15, 10, 0))).toBe(1);
    expect(db().prepare("SELECT epost, belopp_ore FROM klov_kod WHERE kod = 'OAKT1'").get()).toEqual({ epost: null, belopp_ore: 9900 });
    expect(db().prepare("SELECT epost FROM klov_kod WHERE kod = 'OAKT2'").get()).toEqual({ epost: "senare@exempel.se" });
  });
});
