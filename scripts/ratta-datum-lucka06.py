# Byter "Dec." mot "28 nov." i brevbiten i lucka-06: Harald dog 30 nov, och brevet skrevs den 28:e.
# Körs: python3 scripts/ratta-datum-lucka06.py <in.jpg> <ut.jpg>
import sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, ut = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
mask = np.zeros(img.shape[:2], np.uint8)
cv2.rectangle(mask, (1376, 812), (1520, 860), 255, -1)
ren = cv2.inpaint(img, mask, 9, cv2.INPAINT_TELEA)
brus = (np.random.default_rng(1962).normal(0, 2.2, img.shape)).astype(np.float32)
m = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 3)[..., None]
ren = np.clip(ren + brus * m, 0, 255).astype(np.uint8)
bas = Image.fromarray(cv2.cvtColor(ren, cv2.COLOR_BGR2RGB)).convert("RGBA")
W, H, SS = 300, 80, 4
lager = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(lager)
d.text((6 * SS, 10 * SS), "28 nov.", font=ImageFont.truetype("/home/rabnoralex/docker/nextcloud/custom_apps/richdocuments/fonts/Caveat-wght.ttf", 50 * SS), fill=(92, 76, 56, 225))
lager = lager.transform(lager.size, Image.AFFINE, (1, 0.28, 0, 0, 1, 0), resample=Image.BICUBIC).rotate(-1, resample=Image.BICUBIC).resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
bbox = lager.getbbox()
bas.alpha_composite(lager, (1510 - bbox[2], 836 - (bbox[1] + bbox[3]) // 2))
cv2.imwrite(ut, cv2.cvtColor(np.asarray(bas.convert("RGB"), dtype=np.uint8), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 94])
