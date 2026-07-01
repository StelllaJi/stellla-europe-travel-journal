"""Remove the warm paper background from generated item art and add a clean outline."""

from collections import deque
from pathlib import Path
from statistics import median
import sys

from PIL import Image, ImageChops, ImageFilter


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SHEET_LAYOUTS = {
    "pastry-madeleine": ("assets/generated/pastry-items-sheet-v1.png", (40, 80, 550, 500)),
    "pastry-canele": ("assets/generated/pastry-items-sheet-v1.png", (570, 65, 950, 500)),
    "pastry-paris-brest": ("assets/generated/pastry-items-sheet-v1.png", (990, 60, 1530, 505)),
    "pastry-lemon-tart": ("assets/generated/pastry-items-sheet-v1.png", (40, 520, 550, 950)),
    "pastry-opera": ("assets/generated/pastry-items-sheet-v1.png", (530, 500, 1010, 950)),
    "pastry-saint-honore": ("assets/generated/pastry-items-sheet-v1.png", (1030, 490, 1510, 955)),
    "cocktail-negroni": ("assets/generated/cocktail-cards-sheet-v1.png", (70, 70, 540, 480)),
    "cocktail-old-fashioned": ("assets/generated/cocktail-cards-sheet-v1.png", (580, 80, 990, 475)),
    "cocktail-french-75": ("assets/generated/cocktail-cards-sheet-v1.png", (1050, 70, 1470, 485)),
    "cocktail-aperol-spritz": ("assets/generated/cocktail-cards-sheet-v1.png", (90, 495, 530, 970)),
    "cocktail-manhattan": ("assets/generated/cocktail-cards-sheet-v1.png", (590, 490, 990, 970)),
    "cocktail-espresso-martini": ("assets/generated/cocktail-cards-sheet-v1.png", (1060, 490, 1480, 970)),
}


def border_color(image):
    pixels = image.load()
    width, height = image.size
    sample = []
    step = max(1, min(width, height) // 64)
    for x in range(0, width, step):
        sample.extend((pixels[x, 0][:3], pixels[x, height - 1][:3]))
    for y in range(0, height, step):
        sample.extend((pixels[0, y][:3], pixels[width - 1, y][:3]))
    return tuple(int(median(channel)) for channel in zip(*sample))


def distance(color, background):
    return sum((color[index] - background[index]) ** 2 for index in range(3)) ** 0.5


def connected_background(image, tolerance=60):
    image = image.convert("RGBA")
    width, height = image.size
    pixels = image.load()
    background = border_color(image)
    visited = bytearray(width * height)
    queue = deque()

    def add(x, y):
        position = y * width + x
        if visited[position] or distance(pixels[x, y][:3], background) > tolerance:
            return
        visited[position] = 1
        queue.append((x, y))

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x: add(x - 1, y)
        if x + 1 < width: add(x + 1, y)
        if y: add(x, y - 1)
        if y + 1 < height: add(x, y + 1)

    mask = Image.new("L", image.size, 255)
    mask_pixels = mask.load()
    for y in range(height):
        for x in range(width):
            if visited[y * width + x]:
                mask_pixels[x, y] = 0
    return mask.filter(ImageFilter.GaussianBlur(1.1))


def remove_small_islands(mask):
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    width, height = mask.size
    pixels = mask.load()
    visited = bytearray(width * height)
    components = []
    for start_y in range(height):
        for start_x in range(width):
            start = start_y * width + start_x
            if visited[start] or pixels[start_x, start_y] < 128:
                continue
            visited[start] = 1
            queue = deque([(start_x, start_y)])
            component = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if not (0 <= nx < width and 0 <= ny < height):
                        continue
                    position = ny * width + nx
                    if visited[position] or pixels[nx, ny] < 128:
                        continue
                    visited[position] = 1
                    queue.append((nx, ny))
            components.append(component)
    if components:
        largest = max(components, key=len)
        keep = {y * width + x for x, y in largest}
        for y in range(height):
            for x in range(width):
                if pixels[x, y] >= 128 and y * width + x not in keep:
                    pixels[x, y] = 0
    return mask.filter(ImageFilter.GaussianBlur(.35))


def load_framed_source(source):
    layout = SHEET_LAYOUTS.get(source.stem)
    if not layout:
        return Image.open(source).convert("RGBA")
    sheet_path, box = layout
    sheet = Image.open(PROJECT_ROOT / sheet_path).convert("RGBA")
    crop = sheet.crop(box)
    crop.thumbnail((460, 460), Image.Resampling.LANCZOS)
    background = border_color(sheet)
    canvas = Image.new("RGBA", (512, 512), (*background, 255))
    canvas.alpha_composite(crop, ((512 - crop.width) // 2, (512 - crop.height) // 2))
    return canvas


def make_cutout(source, destination):
    image = load_framed_source(source)
    alpha = remove_small_islands(connected_background(image, tolerance=60))
    subject = image.copy()
    subject.putalpha(alpha)

    outline_alpha = alpha.filter(ImageFilter.MaxFilter(15))
    outline_alpha = ImageChops.subtract(outline_alpha, alpha)
    outline = Image.new("RGBA", image.size, (255, 249, 235, 0))
    outline.putalpha(outline_alpha)

    shadow_alpha = alpha.filter(ImageFilter.GaussianBlur(10)).point(lambda value: int(value * 0.24))
    shadow = Image.new("RGBA", image.size, (47, 39, 27, 0))
    shadow.putalpha(shadow_alpha)
    shifted_shadow = Image.new("RGBA", image.size)
    shifted_shadow.alpha_composite(shadow, (0, 7))

    result = Image.new("RGBA", image.size)
    result.alpha_composite(shifted_shadow)
    result.alpha_composite(outline)
    result.alpha_composite(subject)
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination)


if __name__ == "__main__":
    for raw_path in sys.argv[1:]:
        source = Path(raw_path)
        make_cutout(source, source.with_name(f"{source.stem}-cutout-v2.png"))
