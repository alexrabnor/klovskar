# Drift på Hetzner

Guide för att flytta Klovskär (och senare andra publika appar) från hemservern
till en egen server hos Hetzner Cloud. Appen körs precis som förut: Docker +
SQLite på en volym, ut mot internet via Cloudflare Tunnel. Ingen kodändring behövs.

## 1. Vilken server?

Hetzner Cloud, **delad vCPU, x86 (Intel/AMD)**, plats **Helsingfors (hel1)** –
närmast Sverige och inom EU (bra för köparnas e-post enligt GDPR).

| Behov | Specifikation | Ungefärligt pris |
| --- | --- | --- |
| Klovskär + 1–2 små appar | 2 vCPU, 4 GB RAM, 40 GB disk | ca 4–5 €/mån |
| **Rekommenderat:** Klovskär + 3–6 appar | **4 vCPU, 8 GB RAM, 80 GB disk** | ca 7–9 €/mån |
| Backup (rekommenderas) | +20 % av serverpriset | ca 1–2 €/mån |

Hetzner byter ibland namn på planerna (CX22/CX32, CX23/CX33 …) och justerar
priserna – välj efter specifikationen ovan och kontrollera priset på hetzner.com.
Priserna är exklusive moms.

**Därför räcker det:**
- Klovskär använder ca 150–300 MB RAM i drift. En typisk Next.js-/Node-app likaså.
- Den tunga stunden är `docker compose up --build`: `next build` tar 1–2 GB RAM
  medan den pågår. Med 8 GB kan du bygga en app medan de andra kör vidare.
- Disk: varje Docker-image är några hundra MB, Klovskärs bilder ca 110 MB,
  databasen några MB. Byggcachen växer med tiden – rensa med `docker system prune`
  ibland. 80 GB ger gott om marginal; 40 GB räcker för ett fåtal appar.
- Börja gärna med den mindre – en server kan uppgraderas i Hetzners panel på
  någon minut (disken kan bara växa, inte krympa, så välj "bara CPU/RAM" om du
  vill kunna gå tillbaka).

**Undvik ARM (CAX-serien)** om du inte vet att alla dina appar fungerar på arm64.
Klovskär gör det, men det är en onödig felkälla när fler appar ska in.

**Vilka appar ska dit?** Bara det som ska nås utifrån av andra (sådant som säljs
eller används av kunder/allmänheten). Interna verktyg, dashboards och experiment
kan ligga kvar hemma – går hemservern ner drabbas bara du.

## 2. Skapa servern

1. Skapa ett projekt i Hetzner Cloud Console → **Add Server**.
2. Plats: Helsinki. Image: **Ubuntu 24.04**. Typ enligt tabellen ovan.
3. **SSH-nyckel:** lägg in din publika nyckel (`~/.ssh/id_ed25519.pub`). Inget lösenord.
4. Bocka i **Backups**.
5. **Firewall:** skapa en brandvägg som bara släpper in **SSH (22)** – inget annat.
   Cloudflare Tunnel ringer ut från servern, så inga portar behöver vara öppna.
   (Docker kringgår `ufw` på servern, men Hetzners brandvägg sitter utanför och
   gäller alltid.)

## 3. Grundinstallation (en gång)

```bash
ssh root@<serverns-ip>
```

```bash
apt update && apt -y upgrade
apt -y install unattended-upgrades git sqlite3
dpkg-reconfigure -plow unattended-upgrades   # automatiska säkerhetsuppdateringar
timedatectl set-timezone Europe/Stockholm
```

Swap (skyddar mot att ett bygge tar slut på minne):

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Docker:

```bash
curl -fsSL https://get.docker.com | sh
```

Nätverket som `docker-compose.yml` förväntar sig:

```bash
docker network create caddy_net
```

## 4. Lägg upp Klovskär

Mappen **måste heta `klovskar`** – då får volymen samma namn som hemma
(`klovskar_klovskar_data`).

```bash
mkdir -p /opt/apps && cd /opt/apps
git clone https://github.com/alexrabnor/klovskar.git
cd klovskar
```

Kopiera `.env` från hemservern (kör på hemservern):

```bash
scp ~/klovskar/.env root@<serverns-ip>:/opt/apps/klovskar/.env
```

Om `bilder/` på hemservern innehåller filer som inte är incheckade, kopiera dem också:

```bash
rsync -av ~/klovskar/bilder/ root@<serverns-ip>:/opt/apps/klovskar/bilder/
```

## 5. Flytta databasen

Behövs bara om det finns köp, presentkort eller lag som ska följa med.
Gör flytten när ingen spelar (t.ex. en natt) och **stoppa appen hemma först**,
så att inget nytt köp hamnar i den gamla databasen.

På hemservern:

```bash
cd ~/klovskar && docker compose stop
docker run --rm -v klovskar_klovskar_data:/data -v "$PWD":/ut alpine \
  sh -c "cp /data/klovskar.db /ut/klovskar.db"
scp klovskar.db root@<serverns-ip>:/opt/apps/klovskar/
```

På Hetzner-servern:

```bash
cd /opt/apps/klovskar
docker volume create klovskar_klovskar_data
docker run --rm -v klovskar_klovskar_data:/data -v "$PWD":/in alpine \
  sh -c "cp /in/klovskar.db /data/klovskar.db"
rm klovskar.db
```

## 6. Starta

```bash
cd /opt/apps/klovskar
docker compose up -d --build
docker compose logs -f     # avsluta med Ctrl+C
curl -I http://localhost:3131
```

## 7. Cloudflare Tunnel

Enklast är **en tunnel per server** med en publik hostname per app.

1. Cloudflare → Zero Trust → Networks → Tunnels → **Create a tunnel** (Cloudflared),
   döp den t.ex. till `hetzner`.
2. Välj Debian/Ubuntu och kör installationskommandot som visas (`cloudflared service install <token>`) på servern.
3. **Public hostnames:**
   - `adventdeckare.se` → `http://localhost:3131`
   - `adventdeckare.alexcloud.se` → `http://localhost:3131` (aliaset, tills webhooken är bytt)
4. Ta bort samma hostnames från den gamla tunneln hemma. DNS pekas om direkt –
   domänen, Stripe-webhooken och Brevo behöver inte ändras.

Kontrollera i Stripe → Utvecklare → Webhooks att nästa händelse levereras med 200.

## 8. Backup av databasen

Hetzners backup tar en bild av hela servern en gång per dygn (sju sparas).
Lägg dessutom en egen nattlig kopia av databasen – den är det enda som inte går
att återskapa från git:

```bash
mkdir -p /opt/backup
cat > /opt/backup/klovskar.sh <<'EOF'
#!/bin/sh
set -e
D=$(date +%F)
docker run --rm -v klovskar_klovskar_data:/data -v /opt/backup:/ut alpine \
  sh -c "apk add -q sqlite && sqlite3 /data/klovskar.db \".backup /ut/klovskar-$D.db\""
find /opt/backup -name 'klovskar-*.db' -mtime +30 -delete
EOF
chmod +x /opt/backup/klovskar.sh
(crontab -l 2>/dev/null; echo "15 3 * * * /opt/backup/klovskar.sh") | crontab -
```

`.backup` ger en konsekvent kopia även medan appen kör. Hämta hem en kopia
ibland (`scp root@<ip>:/opt/backup/klovskar-*.db .`) så att den inte bara finns
på samma server.

## 9. Uppdatera appen

```bash
cd /opt/apps/klovskar
git pull
docker compose up -d --build
docker image prune -f
```

Byta en bild: lägg filen i `/opt/apps/klovskar/bilder/` – ingen ombyggnad behövs.

## 10. Fler appar

Samma mönster för varje app:

1. `git clone` till `/opt/apps/<app>`, lägg in dess `.env`.
2. Ge den en **egen port** (Klovskär har 3131) och en egen namngiven volym för data.
3. `docker compose up -d --build`.
4. Lägg till en public hostname i tunneln `hetzner` → `http://localhost:<port>`.
5. Lägg in dess databas/volym i backup-skriptet.

Håll koll på minnet med `docker stats` och disken med `df -h`. Ligger RAM-användningen
i drift stadigt över ca 70 % är det dags att uppgradera servern.
