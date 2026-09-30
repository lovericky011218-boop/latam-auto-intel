"""Download identified official assets; never overwrite previous car assets."""
import concurrent.futures
import subprocess
from pathlib import Path

ASSETS = {
    "ora-5.png": "https://assets.gwmanz.com/f/256395/2048x2048/1eea328d23/ora-5-lux-pepper-white-01-zoomed.png/m/700x0",
    "icar-03.jpg": "https://www.chery.com.co/wp-content/uploads/2026/02/icar_hero_day-1024x576.jpg",
    "icar-03t.png": "https://www.chery.com.co/wp-content/uploads/2026/08/03T_Plata-estelar_Frontal_v2.png",
    "nevo-q05.webp": "https://changan.com.co/wp-content/uploads/2026/08/nevo-blanco-polar-1.webp",
    "jetour-g700.jpg": "https://jetour.com.uy/wp-content/uploads/2026/05/g700-hero-2.jpg",
    "eq7.png": "https://www.chery.com.ec/hubfs/CHERY/2026/Modelos/EQ7/eq7.png",
    "wey-g9.png": "https://www.gwm.com.my/content/dam/gwm/pages/my/en/models/wey-g9/360/white.png",
    "nio-et7.jpg": "https://www-cdn.eu.nio.com/officialsite/editor/upload/prod/a347dae0-c302-44f1-ac31-c06756a3eafb/et7-hero-design-desktop.jpg",
    "nio-el7.jpeg": "https://www-cdn.eu.nio.com/officialsite/images/el7/el7_hero_desktop.jpeg",
}
ROOT = Path(__file__).resolve().parents[1] / "public/cars"

def download(item):
    name, url = item
    target = ROOT / name
    if target.exists():
        print(f"Retained {name}", flush=True)
        return
    subprocess.run(["curl", "-fL", "--max-time", "45", "--retry", "1", "-sS", url, "-o", str(target)], check=True)
    from PIL import Image
    with Image.open(target) as image:
        image.verify()
    print(f"Verified {name}: {target.stat().st_size} bytes", flush=True)

if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        list(pool.map(download, ASSETS.items()))
