"""
get_demo_images.py
------------------
Creates 5 realistic-looking synthetic histopathology demo images per class
(25 images total) for testing the Cancer AI app at http://localhost:5173

Each image simulates H&E (Hematoxylin & Eosin) stained tissue with:
- Randomly placed cell nuclei (dark purple circles)
- Cytoplasm regions (pink tones)
- Tissue-type-specific appearance differences

Run:  python get_demo_images.py
"""

import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import os, random, math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

OUTPUT_DIR = Path(__file__).parent / "Model_training" / "Data" / "samples"
SAMPLES    = 5   # images per class
SIZE       = 256  # pixels

# ── H&E Tissue Appearance Configs per Class ────────────────────────────────────
CONFIGS = {
    "lung_n": {
        "label":      "Lung Benign",
        "bg_color":   (245, 218, 225),   # pale pink (eosin background)
        "nucleus":    (120,  60, 140),   # deep purple (hematoxylin)
        "cytoplasm":  (230, 180, 195),   # light pink
        "cell_size":  (6, 14),           # radius range
        "cell_count": (70, 90),
        "regularity": 0.8,              # 1.0 = very regular (benign)
    },
    "lung_aca": {
        "label":      "Lung Adenocarcinoma",
        "bg_color":   (230, 195, 210),
        "nucleus":    (90,  30, 110),
        "cytoplasm":  (210, 155, 175),
        "cell_size":  (8, 20),
        "cell_count": (90, 120),
        "regularity": 0.4,              # irregular = cancerous
    },
    "lung_scc": {
        "label":      "Lung Squamous Cell Carcinoma",
        "bg_color":   (235, 205, 175),
        "nucleus":    (100,  50,  40),
        "cytoplasm":  (215, 170, 130),
        "cell_size":  (10, 24),
        "cell_count": (60, 80),
        "regularity": 0.3,
    },
    "colon_n": {
        "label":      "Colon Benign",
        "bg_color":   (240, 220, 235),
        "nucleus":    (100,  60, 130),
        "cytoplasm":  (220, 195, 215),
        "cell_size":  (5, 12),
        "cell_count": (80, 100),
        "regularity": 0.9,
    },
    "colon_aca": {
        "label":      "Colon Adenocarcinoma",
        "bg_color":   (215, 170, 185),
        "nucleus":    (80,  20, 100),
        "cytoplasm":  (190, 130, 155),
        "cell_size":  (9, 22),
        "cell_count": (100, 140),
        "regularity": 0.25,
    },
}


def blend(c1, c2, t):
    return tuple(int(c1[i] * (1-t) + c2[i] * t) for i in range(3))


def draw_tissue(config: dict, seed: int) -> Image.Image:
    rng = random.Random(seed)
    img = Image.new("RGB", (SIZE, SIZE), config["bg_color"])
    draw = ImageDraw.Draw(img)

    # ── Background texture: gradient patches ──
    for _ in range(25):
        x, y = rng.randint(0, SIZE), rng.randint(0, SIZE)
        r = rng.randint(20, 60)
        alpha = rng.uniform(0.05, 0.2)
        patch_col = blend(config["bg_color"], config["cytoplasm"], alpha)
        draw.ellipse([x-r, y-r, x+r, y+r], fill=patch_col)

    # ── Cytoplasm blobs ──
    n_cells = rng.randint(*config["cell_count"])
    for _ in range(n_cells):
        if config["regularity"] > 0.6:
            # Regular grid pattern (benign)
            gx = rng.randint(0, SIZE // 20) * 20 + rng.randint(-5, 5)
            gy = rng.randint(0, SIZE // 20) * 20 + rng.randint(-5, 5)
        else:
            gx, gy = rng.randint(0, SIZE), rng.randint(0, SIZE)

        cr_min, cr_max = config["cell_size"]
        cr = rng.randint(cr_min, cr_max)
        # elongate slightly for realism
        crx = int(cr * rng.uniform(0.8, 1.4))
        cry = int(cr * rng.uniform(0.8, 1.4))
        col = blend(config["cytoplasm"], config["bg_color"], rng.uniform(0, 0.3))
        draw.ellipse([gx-crx, gy-cry, gx+crx, gy+cry], fill=col, outline=config["cytoplasm"])

    # ── Nuclei (dark purple dots) ──
    for _ in range(n_cells):
        if config["regularity"] > 0.6:
            nx = rng.randint(0, SIZE // 20) * 20 + rng.randint(-4, 4)
            ny = rng.randint(0, SIZE // 20) * 20 + rng.randint(-4, 4)
        else:
            nx, ny = rng.randint(0, SIZE), rng.randint(0, SIZE)

        nr = rng.randint(3, 8) if config["regularity"] > 0.5 else rng.randint(4, 12)
        # Cancerous: irregular nucleus shapes
        if config["regularity"] < 0.4:
            # Irregular polygon nucleus
            pts = []
            for angle_i in range(8):
                angle = angle_i * math.pi * 2 / 8 + rng.uniform(-0.3, 0.3)
                r_pt  = nr * rng.uniform(0.6, 1.4)
                pts.append((nx + r_pt * math.cos(angle), ny + r_pt * math.sin(angle)))
            try:
                draw.polygon(pts, fill=config["nucleus"])
            except Exception:
                draw.ellipse([nx-nr, ny-nr, nx+nr, ny+nr], fill=config["nucleus"])
        else:
            draw.ellipse([nx-nr, ny-nr, nx+nr, ny+nr], fill=config["nucleus"])

    # ── Post-processing ──
    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))

    # Slight H&E color variation
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(rng.uniform(0.9, 1.2))
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(rng.uniform(0.92, 1.08))

    return img


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("🧬 Demo Image Generator — H&E Histopathology Simulation")
    print("=" * 60)

    total = 0
    for cls, cfg in CONFIGS.items():
        cls_dir = OUTPUT_DIR / cls
        cls_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n🔬 {cfg['label']} ({cls})")
        for i in range(SAMPLES):
            img = draw_tissue(cfg, seed=cls.count('_') * 100 + i * 13 + 7)
            fname = cls_dir / f"{cls}_demo_{i+1:02d}.jpg"
            img.save(fname, "JPEG", quality=92)
            print(f"   ✔  Saved: {fname.name}  ({SIZE}x{SIZE}px)")
            total += 1

    print("\n" + "=" * 60)
    print(f"✅ {total} demo images created in:")
    print(f"   {OUTPUT_DIR}")
    print()
    print("🗂  Folder structure:")
    for cls in CONFIGS:
        cls_dir = OUTPUT_DIR / cls
        files = list(cls_dir.glob("*.jpg"))
        print(f"   samples/{cls}/  →  {len(files)} images")
    print()
    print("🚀 Open the app and test:")
    print("   http://localhost:5173  →  🔬 Model Testing tab")
    print("   Drag any image from the samples/ folder to test!")
    print("=" * 60)


if __name__ == "__main__":
    main()
