import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// En fil på en egen docker-volym. Ingen nätverksyta: bara appens process når den.
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "klovskar.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS klov_kod (
  kod TEXT PRIMARY KEY,
  typ TEXT NOT NULL,                 -- kop | present | gratis
  stripe_session TEXT UNIQUE,
  epost TEXT,
  belopp_ore INTEGER NOT NULL DEFAULT 0,
  testlage INTEGER NOT NULL DEFAULT 0,
  notering TEXT,
  skapad TEXT NOT NULL DEFAULT (datetime('now')),
  aterbetald INTEGER NOT NULL DEFAULT 0,
  lag_id INTEGER
);
CREATE TABLE IF NOT EXISTS klov_lag (
  id INTEGER PRIMARY KEY,
  namn TEXT NOT NULL,
  kod TEXT NOT NULL UNIQUE,
  startdatum TEXT NOT NULL,
  forskjutning_min INTEGER NOT NULL DEFAULT 0,
  skapad TEXT NOT NULL DEFAULT (datetime('now')),
  synlig_i_topplista INTEGER NOT NULL DEFAULT 1,
  anklagelse_inlamnad INTEGER NOT NULL DEFAULT 0,
  poang INTEGER,
  ledare_token TEXT NOT NULL UNIQUE,
  ledare_epost TEXT,
  morgonmejl INTEGER NOT NULL DEFAULT 0,
  aktiveringskod TEXT,
  forsta_oppning TEXT
);
CREATE TABLE IF NOT EXISTS klov_spelare (
  id INTEGER PRIMARY KEY,
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  namn TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  far_lamna_in INTEGER NOT NULL DEFAULT 0,
  skapad TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS klov_spelare_namn ON klov_spelare(lag_id, namn COLLATE NOCASE);
CREATE TABLE IF NOT EXISTS klov_overtag (
  id INTEGER PRIMARY KEY,
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  spelare_id INTEGER NOT NULL REFERENCES klov_spelare(id) ON DELETE CASCADE,
  hemlighet TEXT NOT NULL UNIQUE,
  skapad TEXT NOT NULL DEFAULT (datetime('now')),
  godkand INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS klov_oppnad (
  spelare_id INTEGER NOT NULL REFERENCES klov_spelare(id) ON DELETE CASCADE,
  lucka_nr INTEGER NOT NULL,
  tid TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (spelare_id, lucka_nr)
);
CREATE TABLE IF NOT EXISTS klov_kommentar (
  id INTEGER PRIMARY KEY,
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  lucka_nr INTEGER NOT NULL,
  spelare_id INTEGER REFERENCES klov_spelare(id) ON DELETE SET NULL,
  namn TEXT NOT NULL,
  text TEXT NOT NULL,
  skapad TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS klov_kommentar_lucka ON klov_kommentar(lag_id, lucka_nr);
CREATE TABLE IF NOT EXISTS klov_tavla_kort (
  id INTEGER PRIMARY KEY,
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  typ TEXT NOT NULL,                 -- lucka | person | lapp
  referens TEXT,
  text TEXT,
  x REAL NOT NULL,
  y REAL NOT NULL,
  skapad_av TEXT,
  skapad TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS klov_tavla_trad (
  id INTEGER PRIMARY KEY,
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  fran_kort INTEGER NOT NULL REFERENCES klov_tavla_kort(id) ON DELETE CASCADE,
  till_kort INTEGER NOT NULL REFERENCES klov_tavla_kort(id) ON DELETE CASCADE,
  UNIQUE (lag_id, fran_kort, till_kort)
);
CREATE TABLE IF NOT EXISTS klov_rost (
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  spelare_id INTEGER NOT NULL REFERENCES klov_spelare(id) ON DELETE CASCADE,
  dag INTEGER NOT NULL,
  misstankt TEXT NOT NULL,
  PRIMARY KEY (spelare_id, dag)
);
CREATE TABLE IF NOT EXISTS klov_bonus (
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  bonus_nr INTEGER NOT NULL,
  upplast_tid TEXT NOT NULL DEFAULT (datetime('now')),
  upplast_av TEXT,
  PRIMARY KEY (lag_id, bonus_nr)
);
CREATE TABLE IF NOT EXISTS klov_anklagelse (
  lag_id INTEGER PRIMARY KEY REFERENCES klov_lag(id) ON DELETE CASCADE,
  utkast TEXT NOT NULL DEFAULT '{}',
  uppdaterad_av TEXT,
  uppdaterad TEXT,
  inlamnad INTEGER NOT NULL DEFAULT 0,
  inlamnad_tid TEXT,
  inlamnad_av TEXT,
  poang_detaljer TEXT
);
CREATE TABLE IF NOT EXISTS klov_push (
  id INTEGER PRIMARY KEY,
  spelare_id INTEGER NOT NULL REFERENCES klov_spelare(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  data TEXT NOT NULL,
  skapad TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS klov_utskick (
  lag_id INTEGER NOT NULL REFERENCES klov_lag(id) ON DELETE CASCADE,
  lucka_nr INTEGER NOT NULL,
  tid TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (lag_id, lucka_nr)
);
`;

let instans: Database.Database | null = null;

export function db(): Database.Database {
  if (instans) return instans;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const d = new Database(DB_PATH);
  d.pragma("journal_mode = WAL");
  d.pragma("foreign_keys = ON");
  d.pragma("busy_timeout = 3000");
  d.exec(SCHEMA);
  instans = d;
  return d;
}

// ------------------------------------------------------------------ typer

export interface Lag {
  id: number;
  namn: string;
  kod: string;
  startdatum: string;
  forskjutning_min: number;
  skapad: string;
  synlig_i_topplista: number;
  anklagelse_inlamnad: number;
  poang: number | null;
  ledare_token: string;
  ledare_epost: string | null;
  morgonmejl: number;
  aktiveringskod: string | null;
  forsta_oppning: string | null;
}

export interface Spelare {
  id: number;
  lag_id: number;
  namn: string;
  token: string;
  far_lamna_in: number;
  skapad: string;
}

export interface Kod {
  kod: string;
  typ: "kop" | "present" | "gratis";
  stripe_session: string | null;
  epost: string | null;
  belopp_ore: number;
  testlage: number;
  notering: string | null;
  skapad: string;
  aterbetald: number;
  lag_id: number | null;
}

export const lagMedId = (id: number) => db().prepare("SELECT * FROM klov_lag WHERE id = ?").get(id) as Lag | undefined;
export const lagMedKod = (kod: string) => db().prepare("SELECT * FROM klov_lag WHERE kod = ?").get(kod.toUpperCase()) as Lag | undefined;
export const lagMedLedarToken = (t: string) => db().prepare("SELECT * FROM klov_lag WHERE ledare_token = ?").get(t) as Lag | undefined;
export const spelareMedToken = (t: string) => db().prepare("SELECT * FROM klov_spelare WHERE token = ?").get(t) as Spelare | undefined;
export const spelareILag = (lagId: number) => db().prepare("SELECT * FROM klov_spelare WHERE lag_id = ? ORDER BY skapad, id").all(lagId) as Spelare[];
export const kodMedKod = (kod: string) => db().prepare("SELECT * FROM klov_kod WHERE kod = ?").get(normaliseraKod(kod)) as Kod | undefined;
export const kodMedSession = (s: string) => db().prepare("SELECT * FROM klov_kod WHERE stripe_session = ?").get(s) as Kod | undefined;

export function normaliseraKod(kod: string): string {
  return kod.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{4})(.{4})(.{4})$/, "$1-$2-$3");
}
