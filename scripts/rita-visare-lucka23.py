# Målar om fickurets visare i lucka-23 till 23.47 (Gemini klarar inte visare).
# Körs: python3 scripts/rita-visare-lucka23.py bilder/_original/lucka-23-gemini-fel-tid.jpg bilder/lucka-23.jpg
import cv2, numpy as np, math, sys
from PIL import Image, ImageDraw, ImageFilter
src, ut = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
OX, OY = 945, 840
C = (OX+255, OY+253)
# 1. Mask för gamla visare: band längs varje visare, bara mörka pixlar, sedan utvidgning
mask = np.zeros(img.shape[:2], np.uint8)
band = np.zeros_like(mask)
for tip in [(195,92), (243,120)]:
    cv2.line(band, C, (OX+tip[0], OY+tip[1]), 255, 30)
cv2.circle(band, C, 22, 255, -1)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
dial_ljus = np.median(gray[OY+300:OY+330, OX+120:OX+180])
mork = (gray < dial_ljus - 22).astype(np.uint8)*255
mask = cv2.bitwise_and(band, mork)
mask = cv2.dilate(mask, np.ones((7,7),np.uint8), iterations=3)
mask[OY+80:OY+135, OX+140:OX+193] = 0  # skydda siffran 11
cv2.imwrite(ut.replace('.jpg','-mask.png'), mask[OY:OY+500, OX:OX+500])
ren = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
# Lägg tillbaka papperets struktur: ta högfrekvent textur från en ren yta till höger och blanda in där masken var
DX = 75
kalla = np.roll(img, -DX, axis=1).astype(np.float32)
blur_k = cv2.GaussianBlur(kalla, (0,0), 6)
textur = kalla - blur_k
tmask = mask.copy(); tmask[:OY+112, :] = 0
mjuk = cv2.GaussianBlur(tmask.astype(np.float32)/255, (0,0), 3)[..., None]
ren = np.clip(ren.astype(np.float32) + textur*mjuk, 0, 255).astype(np.uint8)
# 2. Rita nya visare med 4x översampling
S = 4
W, H = 500, 500
lager = Image.new("RGBA", (W*S, H*S), (0,0,0,0))
d = ImageDraw.Draw(lager)
cx, cy = 255*S, 253*S
FARG = (22, 30, 58, 255)
def punkt(vinkel, r):
    a = math.radians(vinkel)
    return (cx + r*S*math.sin(a), cy - r*S*math.cos(a))
def visare(vinkel, langd, bredd, ring_r, ring_pos):
    # avsmalnande kropp
    a = math.radians(vinkel); nx, ny = math.cos(a), math.sin(a)
    bas = bredd*S/2; spets = punkt(vinkel, langd)
    svans = punkt(vinkel+180, 14)
    d.polygon([(svans[0]+nx*bas, svans[1]+ny*bas), (spets[0], spets[1]), (svans[0]-nx*bas, svans[1]-ny*bas)], fill=FARG)
    # Breguet-ring
    rx, ry = punkt(vinkel, ring_pos)
    d.ellipse([rx-ring_r*S, ry-ring_r*S, rx+ring_r*S, ry+ring_r*S], outline=FARG, width=int(3.2*S))
minut = 47*6
tim = (11 + 47/60)*30
visare(tim, 122, 9, 11, 82)
visare(minut, 182, 7, 10, 128)
d.ellipse([cx-13*S, cy-13*S, cx+13*S, cy+13*S], fill=FARG)
d.ellipse([cx-4*S, cy-4*S, cx+4*S, cy+4*S], fill=(70,80,105,255))
lager = lager.resize((W, H), Image.LANCZOS)
# skugga
alfa = lager.split()[3]
skugga = Image.new("RGBA", (W,H), (0,0,0,0)); skugga.putalpha(alfa.point(lambda v: int(v*0.35)))
skugga = skugga.filter(ImageFilter.GaussianBlur(2.5))
bas = Image.fromarray(cv2.cvtColor(ren, cv2.COLOR_BGR2RGB)).convert("RGBA")
utsnitt = bas.crop((OX, OY, OX+W, OY+H))
utsnitt.alpha_composite(skugga, (4, 5))
utsnitt.alpha_composite(lager)
bas.paste(utsnitt, (OX, OY))
bas.convert("RGB").save(ut, quality=93)
