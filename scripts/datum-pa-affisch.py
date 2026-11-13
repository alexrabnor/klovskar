#!/usr/bin/env python3
"""Byter underraden i prisrutan på affischerna till att visa slutdatum för introduktionspriset.

Ett jämförpris ("ord. 199 kr") måste ha ett slutdatum. Körs en gång; affischerna
i public/ skrivs över (originalen finns i git-historiken). Kör sedan citat-pa-affisch.py.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROT = Path(__file__).resolve().parent.parent / "public"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
TEXT = "t.o.m. 15 december · ord. 199 kr för hela laget"
ROD = (150, 35, 30)

# fil: (rutans vänster, höger, underradens topp, botten, teckenstorlek)
AFFISCHER = {
    "affisch-feed.jpg": (232, 848, 785, 806, 22),
    "affisch-story.jpg": (172, 908, 1474, 1499, 27),
}

for fil, (x0, x1, y0, y1, storlek) in AFFISCHER.items():
    bild = Image.open(ROT / fil).convert("RGB")
    rita = ImageDraw.Draw(bild)
    rita.rectangle([x0 + 14, y0 - 5, x1 - 14, y1 + 5], fill=ROD)
    font = ImageFont.truetype(SANS, storlek)
    b = rita.textlength(TEXT, font=font)
    mitt = (y0 + y1) / 2
    rita.text(((x0 + x1) / 2 - b / 2, mitt), TEXT, font=font, fill=(240, 214, 208), anchor="lm")
    bild.save(ROT / fil, quality=92)
