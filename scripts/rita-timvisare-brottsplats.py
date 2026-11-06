# Målar om timvisaren i brottsplats.jpg till 23.47 (Gemini klarar inte visare).
# Urtavlan ligger i perspektiv, så riktningarna tas från siffrornas lägen i bilden.
# Körs: python3 scripts/rita-timvisare-brottsplats.py <in.jpg> <ut.jpg>
import sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, ut = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
OX, OY, W, H = 1090, 1120, 340, 280
U = 3.0  # koordinaterna nedan är i det 3x förstorade utsnittet
def f(x, y): return (OX + x / U, OY + y / U)
C = (500, 255)
# 1. Ta bort gamla timvisaren och siffran 11 som den ligger över
band = np.zeros(img.shape[:2], np.uint8)
gamla = [(500, 255), (522, 190), (530, 143), (568, 85)]
for a, b, br in [(gamla[0], gamla[1], 16), (gamla[1], gamla[2], 22), (gamla[2], gamla[3], 13)]:
    pa, pb = f(*a), f(*b)
    cv2.line(band, (round(pa[0]), round(pa[1])), (round(pb[0]), round(pb[1])), 255, br)
cv2.ellipse(band, (round(f(532,104)[0]), round(f(532,104)[1])), (17, 7), 0, 0, 360, 255, -1)
nav = np.zeros_like(band); cv2.circle(nav, (round(f(*C)[0]), round(f(*C)[1])), 10, 255, -1)
band[nav > 0] = 0
ren = cv2.inpaint(img, band, 7, cv2.INPAINT_TELEA)
navbild = img.copy()
# 2. Rita ny visare och siffran 11 med 4x översampling
SS = 4
lager = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(lager)
def p(x, y): return (x / U * SS, y / U * SS)
# Siffran 11 i samma lutning som de andra ettorna
SVART = (26, 30, 38, 235)
for x0, y0, x1, y1 in [(506, 114, 530, 88), (540, 114, 564, 88)]:
    d.line([p(x0, y0), p(x1, y1)], fill=SVART, width=round(6.5 / U * SS))
# Riktning 11.78 tim: mellan siffrorna 11 och 12 i bildens perspektiv
D11, D12 = np.array((35.0, -155.0)), np.array((170.0, -150.0))
r = D11 + (D12 - D11) * (47 / 60)
r_enh = r / np.linalg.norm(r); n = np.array((-r_enh[1], r_enh[0]))
c = np.array(C, float); L = np.linalg.norm(r) * 0.84
BLA = (42, 84, 132, 255); MORK = (24, 44, 76, 255)
def q(t, s): v = c + r_enh * L * t + n * s; return p(v[0], v[1])
form = [q(0, 7), q(.45, 6), q(.56, 16), q(.72, 13), q(.80, 5), q(1, 0), q(.80, -5), q(.72, -13), q(.56, -16), q(.45, -6), q(0, -7)]
d.polygon(form, fill=MORK)
d.polygon([q(.03, 4), q(.46, 3.5), q(.57, 12), q(.71, 9), q(.80, 2.5), q(.95, 0), q(.80, -2.5), q(.71, -9), q(.57, -12), q(.46, -3.5), q(.03, -4)], fill=BLA)
lager = lager.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.55))
skugga = Image.new("RGBA", (W, H), (0, 0, 0, 0)); skugga.putalpha(lager.split()[3].point(lambda v: int(v * .3)))
skugga = skugga.filter(ImageFilter.GaussianBlur(1.5))
bas = Image.fromarray(cv2.cvtColor(ren, cv2.COLOR_BGR2RGB)).convert("RGBA")
ut_s = bas.crop((OX, OY, OX + W, OY + H))
ut_s.alpha_composite(skugga, (1, 2)); ut_s.alpha_composite(lager)
bas.paste(ut_s, (OX, OY))
# 3. Lägg tillbaka det ursprungliga navet och minutvisarens fäste överst
res = cv2.cvtColor(np.asarray(bas.convert("RGB"), dtype=np.uint8), cv2.COLOR_RGB2BGR)
m = cv2.GaussianBlur(nav.astype(np.float32) / 255, (0, 0), 1)[..., None]
res = (res * (1 - m) + navbild * m).astype(np.uint8)
cv2.imwrite(ut, res, [cv2.IMWRITE_JPEG_QUALITY, 94])
