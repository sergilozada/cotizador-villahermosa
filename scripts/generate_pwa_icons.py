from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "assets" / "LOGOVILLAHERMOSA.jpeg"
OUTPUT = ROOT / "pwa" / "icons"

LIGHT = "#fffefa"
NAVY = "#07182d"
TEAL = "#0d6f78"


def crop_logo(source: Image.Image) -> Image.Image:
    rgb = source.convert("RGB")
    white = Image.new("RGB", rgb.size, "white")
    difference = ImageChops.difference(rgb, white).convert("L")
    difference = difference.point(lambda value: 255 if value > 18 else 0)
    bounds = difference.getbbox()

    if not bounds:
        raise RuntimeError("No se encontró el contenido del logo.")

    left, top, right, bottom = bounds
    margin = max(8, round(min(rgb.size) * 0.025))
    box = (
        max(0, left - margin),
        max(0, top - margin),
        min(rgb.width, right + margin),
        min(rgb.height, bottom + margin),
    )
    return rgb.crop(box)


def fit_logo(canvas: Image.Image, logo: Image.Image, max_width: int, max_height: int) -> None:
    copy = logo.copy()
    copy.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    x = (canvas.width - copy.width) // 2
    y = (canvas.height - copy.height) // 2
    canvas.paste(copy, (x, y))


def create_regular(logo: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGB", (size, size), LIGHT)
    draw = ImageDraw.Draw(canvas)
    inset = max(2, round(size * 0.025))
    radius = round(size * 0.16)
    border = max(2, round(size * 0.012))
    draw.rounded_rectangle(
        (inset, inset, size - inset - 1, size - inset - 1),
        radius=radius,
        outline=TEAL,
        width=border,
    )
    fit_logo(canvas, logo, round(size * 0.78), round(size * 0.5))
    return canvas


def create_maskable(logo: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGB", (size, size), NAVY)
    draw = ImageDraw.Draw(canvas)
    left = round(size * 0.15)
    top = round(size * 0.25)
    right = round(size * 0.85)
    bottom = round(size * 0.75)
    draw.rounded_rectangle(
        (left, top, right, bottom),
        radius=round(size * 0.08),
        fill=LIGHT,
        outline=TEAL,
        width=max(2, round(size * 0.01)),
    )
    fit_logo(canvas, logo, round(size * 0.6), round(size * 0.38))
    return canvas


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    logo = crop_logo(Image.open(SOURCE))

    for size in (192, 512):
        create_regular(logo, size).save(OUTPUT / f"icon-{size}.png", optimize=True)
        create_maskable(logo, size).save(OUTPUT / f"maskable-{size}.png", optimize=True)

    create_regular(logo, 180).save(OUTPUT / "apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    main()
