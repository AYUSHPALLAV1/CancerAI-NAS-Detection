"""
download_samples.py
Downloads ~5 sample histopathology images per class from LC25000 dataset
using kagglehub, then copies them into the project's Data/samples/ folder.

If Kaggle download fails, falls back to creating synthetic test images using
PIL so you always have something to test the app with.
"""

import os
import sys
import shutil
import random
from pathlib import Path

# ── Target folder ──────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent.parent / "Model_training" / "Data" / "samples"
SAMPLES_PER_CLASS = 5

CLASS_NAMES = [
    "lung_n",     # Lung Benign
    "lung_aca",   # Lung Adenocarcinoma
    "lung_scc",   # Lung Squamous Cell Carcinoma
    "colon_n",    # Colon Benign
    "colon_aca",  # Colon Adenocarcinoma
]

# Kaggle dataset folder names → our internal class names
KAGGLE_FOLDER_MAP = {
    "lung_n":    ["lung_n",  "lung_normal", "lungn"],
    "lung_aca":  ["lung_aca", "lungaca"],
    "lung_scc":  ["lung_scc", "lungscc"],
    "colon_n":   ["colon_n",  "colon_normal", "colonn"],
    "colon_aca": ["colon_aca", "colonaca"],
}

def find_class_folder(search_root: Path, variants: list[str]) -> Path | None:
    """Recursively search for a folder matching any variant name (case-insensitive)."""
    for p in sorted(search_root.rglob("*")):
        if p.is_dir() and p.name.lower().replace("-", "_") in [v.lower() for v in variants]:
            return p
    return None

def copy_samples(src_dir: Path, dst_dir: Path, n: int) -> list[Path]:
    """Copy n random JPG/PNG images from src_dir into dst_dir. Returns list of copied paths."""
    dst_dir.mkdir(parents=True, exist_ok=True)
    images = [f for f in src_dir.iterdir() if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".tiff")]
    chosen = random.sample(images, min(n, len(images)))
    copied = []
    for img in chosen:
        dest = dst_dir / img.name
        shutil.copy2(img, dest)
        copied.append(dest)
    return copied

def create_synthetic_images(dst_dir: Path, class_name: str, n: int):
    """
    Fallback: create visually distinct synthetic histopathology-like images using PIL.
    Each class gets a unique color palette to simulate tissue staining.
    """
    try:
        from PIL import Image, ImageDraw, ImageFilter
        import random as rnd
    except ImportError:
        print("  ⚠  Pillow not available for synthetic image generation.")
        return

    # Hematoxylin & eosin (H&E) inspired palettes per class
    palettes = {
        "lung_n":    [(230, 200, 220), (180, 130, 170), (240, 220, 235)],  # light pink/purple
        "lung_aca":  [(200, 150, 180), (140, 80,  130), (220, 180, 200)],  # darker pink
        "lung_scc":  [(190, 140, 110), (130, 80,   60), (210, 170, 140)],  # brownish
        "colon_n":   [(220, 210, 230), (170, 150, 190), (235, 225, 240)],  # pale lavender
        "colon_aca": [(160, 90,  120), (110, 50,   80), (190, 130, 150)],  # deep pink/red
    }

    colors = palettes.get(class_name, [(200, 200, 200)])
    dst_dir.mkdir(parents=True, exist_ok=True)

    for i in range(n):
        img = Image.new("RGB", (256, 256), color=colors[0])
        draw = ImageDraw.Draw(img)

        # Draw random circles to simulate cells
        bg, fg, hi = colors[0], colors[1], colors[2]
        for _ in range(80):
            x, y = rnd.randint(0, 255), rnd.randint(0, 255)
            r = rnd.randint(4, 18)
            col = rnd.choice([bg, fg, hi])
            draw.ellipse([x-r, y-r, x+r, y+r], fill=col, outline=fg)

        # Add slight blur for realism
        img = img.filter(ImageFilter.GaussianBlur(radius=1))

        fname = dst_dir / f"{class_name}_synthetic_{i+1:02d}.jpg"
        img.save(fname, "JPEG", quality=90)
        print(f"    ✔  Created synthetic: {fname.name}")

# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("🧬 LC25000 Sample Downloader")
    print("=" * 60)

    kaggle_root = None
    use_kaggle  = False

    # ── Try kagglehub ──────────────────────────────────────────────────────────
    try:
        import kagglehub
        print("\n📡 Attempting Kaggle download (5 images/class from LC25000)…")
        print("   This may prompt for Kaggle credentials on first run.\n")
        kaggle_root = Path(kagglehub.dataset_download(
            "andrewmvd/lung-and-colon-cancer-histopathological-images"
        ))
        print(f"\n✅ Dataset downloaded/cached at: {kaggle_root}")
        use_kaggle = True
    except Exception as e:
        print(f"\n⚠  Kaggle download skipped: {e}")
        print("   → Falling back to synthetic demo images.\n")

    # ── Copy / generate samples ────────────────────────────────────────────────
    total_saved = 0
    summary = []

    for cls in CLASS_NAMES:
        cls_dst = BASE_DIR / cls
        print(f"\n🔬 Class: {cls}")

        if use_kaggle and kaggle_root:
            src = find_class_folder(kaggle_root, KAGGLE_FOLDER_MAP[cls])
            if src and src.is_dir():
                copied = copy_samples(src, cls_dst, SAMPLES_PER_CLASS)
                for c in copied:
                    print(f"    ✔  Copied: {c.name}")
                total_saved += len(copied)
                summary.append((cls, len(copied), "from Kaggle"))
                continue
            else:
                print(f"    ⚠  Folder not found in Kaggle download for {cls}. Using synthetic.")

        # Synthetic fallback
        create_synthetic_images(cls_dst, cls, SAMPLES_PER_CLASS)
        total_saved += SAMPLES_PER_CLASS
        summary.append((cls, SAMPLES_PER_CLASS, "synthetic"))

    # ── Summary ────────────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print(f"✅ Done!  {total_saved} sample images ready in:")
    print(f"   {BASE_DIR}")
    print()
    print(f"{'Class':<20} {'Count':>5}  {'Source'}")
    print("-" * 44)
    for cls, cnt, src in summary:
        print(f"{cls:<20} {cnt:>5}  {src}")
    print("=" * 60)
    print()
    print("🚀 You can now drag & drop any of these images into the app at:")
    print("   http://localhost:5173  →  Model Testing tab")
    print()
    print("📁 Image locations:")
    for cls in CLASS_NAMES:
        cls_dir = BASE_DIR / cls
        if cls_dir.exists():
            imgs = list(cls_dir.glob("*"))
            if imgs:
                print(f"   {cls}/  →  {imgs[0].name} … ({len(imgs)} files)")


if __name__ == "__main__":
    main()
