#!/usr/bin/env bash
# Bearbetar råljud från Freesound (CC0) till public/ljud/.
# Stämningsloopar: jämn nivå (-30 LUFS), skarvfri loop via 3 s övertoning. Källor: public/ljud/KALLOR.md
# Körs: scripts/bygg-ljud.sh <mapp med råfiler: vind.mp3 inne.mp3 ...>
set -euo pipefail
RAA="$1"; UT="$(dirname "$0")/../public/ljud"
loop() { # namn extrafilter
  local tmp; tmp=$(mktemp --suffix=.wav)
  ffmpeg -v error -y -i "$RAA/$1.mp3" -af "${2:+$2,}loudnorm=I=-30:TP=-4:LRA=7,aresample=44100" -ac 2 "$tmp"
  ffmpeg -v error -y -i "$tmp" -filter_complex \
    "[0]atrim=0:3,asetpts=N/SR/TB[huvud];[0]atrim=3,asetpts=N/SR/TB[kropp];[kropp][huvud]acrossfade=d=3:c1=qsin:c2=qsin" \
    -c:a libmp3lame -b:a 96k "$UT/$1.mp3"
  rm -f "$tmp"
}
DAMPA="acompressor=threshold=-30dB:ratio=4:attack=50:release=800:makeup=2"
loop vind
loop inne "$DAMPA"
loop brasa
loop kok
loop klocka
loop hav
loop is "$DAMPA"
ffmpeg -v error -y -i "$RAA/oppna.mp3" -af "loudnorm=I=-24:TP=-3,afade=t=out:st=1.2:d=0.26" -ac 2 -c:a libmp3lame -b:a 96k "$UT/oppna.mp3"
ls -la "$UT"
