#!/usr/bin/env python3
"""Lägger Fredriks citat på affischerna och delningsbilden.

Originalen ligger kvar orörda; resultatet sparas som *-citat.jpg (affischer) och
public/og.jpg (delningsbilden, original i public/og-utan-citat.jpg).

Kör: python3 scripts/citat-pa-affisch.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROT = Path(__file__).resolve().parent.parent / "public"
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
CITAT = "”Först vid lucka 21 förstod jag vem det var.”"
# Handbrutna rader för smala ytor – så att inget ord hamnar ensamt
CITAT_SMAL = ["”Först vid lucka 21", "förstod jag", "vem det var.”"]
AVSANDARE = "– FREDRIK"
ANNA = {
    "anna-snyggt": ["”Så snyggt, spännande", "och sagolikt berättad", "deckargåta.”"],
    "anna-vastkusten": ["”Stämningsfull deckare", "i min absoluta", "favoritmiljö,", "västkusten!”"],
}
ANNA_BRED = {
    "anna-snyggt": ["”Så snyggt, spännande och sagolikt", "berättad deckargåta.”"],
    "anna-vastkusten": ["”Stämningsfull deckare i min absoluta", "favoritmiljö, västkusten!”"],
}
GULD = (226, 162, 74)
PAPPER = (246, 238, 222)


def radbryt(text, font, bredd, rita):
    rader, rad = [], ""
    for ord_ in text.split():
        prov = f"{rad} {ord_}".strip()
        if rita.textlength(prov, font=font) <= bredd:
            rad = prov
        else:
            rader.append(rad)
            rad = ord_
    return rader + [rad]


def lagg_citat(bild, x, y, bredd, storlek, centrera=False, rader=None, citat=CITAT, avsandare=AVSANDARE):
    """Citat med guldstreck ovanför, mjuk skugga så det läses mot snöhimlen."""
    bild = bild.convert("RGBA")
    f_citat = ImageFont.truetype(SERIF, storlek)
    f_namn = ImageFont.truetype(SANS, round(storlek * 0.42))
    rita = ImageDraw.Draw(bild)
    rader = rader or radbryt(citat, f_citat, bredd, rita)
    radhojd = round(storlek * 1.18)

    text = Image.new("RGBA", bild.size, (0, 0, 0, 0))
    t = ImageDraw.Draw(text)
    streck_y = y
    streck_b = round(storlek * 1.4)
    sx = x + (bredd - streck_b) // 2 if centrera else x
    t.rectangle([sx, streck_y, sx + streck_b, streck_y + max(3, storlek // 18)], fill=GULD + (255,))
    ty = y + round(storlek * 0.55)
    for r in rader:
        rx = x + (bredd - t.textlength(r, font=f_citat)) / 2 if centrera else x
        t.text((rx, ty), r, font=f_citat, fill=PAPPER + (255,))
        ty += radhojd
    ty += round(storlek * 0.2)
    nx = x + (bredd - t.textlength(avsandare, font=f_namn)) / 2 if centrera else x
    t.text((nx, ty), avsandare, font=f_namn, fill=GULD + (255,))

    # Skugga: textens alfa, suddad och mörk
    alfa = text.split()[3]
    skugga = Image.new("RGBA", bild.size, (5, 12, 20, 0))
    skugga.putalpha(alfa.filter(ImageFilter.GaussianBlur(storlek / 5)).point(lambda v: min(255, v * 2)))
    bild = Image.alpha_composite(bild, skugga)
    bild = Image.alpha_composite(bild, text)
    return bild.convert("RGB")


def main():
    # Fyrkantig flödesbild 1080×1080: himlen till vänster om fyren, mellan underrubriken och berättelseraden
    feed = Image.open(ROT / "affisch-feed.jpg")
    lagg_citat(feed, 70, 230, 560, 52, rader=CITAT_SMAL).save(ROT / "affisch-feed-citat.jpg", quality=90)

    # Story 1080×1920: himlen till vänster om fyren
    story = Image.open(ROT / "affisch-story.jpg")
    lagg_citat(story, 80, 420, 560, 72, rader=CITAT_SMAL).save(ROT / "affisch-story-citat.jpg", quality=90)

    # Delningsbilden 1200×630: nere till vänster, bredvid fyrlyktan
    orig = ROT / "og-utan-citat.jpg"
    if not orig.exists():
        (ROT / "og.jpg").rename(orig)
    og = Image.open(orig)
    lagg_citat(og, 90, 420, 640, 46).save(ROT / "og.jpg", quality=88)

    # Annas citat – egna filer, delningsbilden ovan behåller Fredriks
    for namn, rader in ANNA.items():
        sm = 52 if len(rader) <= 3 else 46
        ss = 72 if len(rader) <= 3 else 60
        lagg_citat(Image.open(ROT / "affisch-feed.jpg"), 70, 230, 560, sm, rader=rader, avsandare="– ANNA").save(ROT / f"affisch-feed-{namn}.jpg", quality=90)
        lagg_citat(Image.open(ROT / "affisch-story.jpg"), 80, 420, 560, ss, rader=rader, avsandare="– ANNA").save(ROT / f"affisch-story-{namn}.jpg", quality=90)
        lagg_citat(Image.open(orig), 90, 400, 700, 44, rader=ANNA_BRED[namn], avsandare="– ANNA").save(ROT / f"og-{namn}.jpg", quality=88)


TVA = [
    (["”Så snyggt, spännande och", "sagolikt berättad deckargåta.”"], "– ANNA"),
    (["”Först vid lucka 21 förstod", "jag vem det var.”"], "– FREDRIK"),
]


def tva_citat(bild, x, y, bredd, storlek, mellan):
    """Annas och Fredriks citat under varandra, mindre än ett ensamt citat."""
    hojd = round(storlek * (0.55 + 2 * 1.18 + 0.2 + 0.42 * 1.2))
    for i, (rader, namn) in enumerate(TVA):
        bild = lagg_citat(bild, x, y + i * (hojd + mellan), bredd, storlek, rader=rader, avsandare=namn)
    return bild


def main_tva():
    tva_citat(Image.open(ROT / "affisch-feed.jpg"), 70, 225, 600, 34, 26).save(ROT / "affisch-feed-tva-citat.jpg", quality=90)
    tva_citat(Image.open(ROT / "affisch-story.jpg"), 80, 420, 600, 46, 36).save(ROT / "affisch-story-tva-citat.jpg", quality=90)
    tva_citat(Image.open(ROT / "og-utan-citat.jpg"), 90, 388, 640, 28, 12).save(ROT / "og-tva-citat.jpg", quality=88)


if __name__ == "__main__":
    main_tva()
    main()
