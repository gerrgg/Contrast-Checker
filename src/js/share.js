const hexToRgb = (hex) => {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
};

const smartName = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl({ r, g, b });

  // near white/black/grays
  if (l >= 0.97) return "snow";
  if (l <= 0.06) return "ink";
  if (s <= 0.1) return l > 0.5 ? "mist" : "slate";

  // hue buckets
  if (h >= 190 && h < 235) return "sky";
  if (h >= 35 && h < 60) return "marigold";
  if (h >= 95 && h < 150) return "lime";
  if (h >= 285 && h < 335) return "fuchsia";

  // fallback
  if (h < 35) return "red";
  if (h < 95) return "orange";
  if (h < 190) return "green";
  if (h < 285) return "blue";
  return "magenta";
};

const uniqName = (name, used) => {
  let n = name;
  let i = 2;
  while (used.has(n)) {
    n = `${name}-${i}`;
    i += 1;
  }
  used.add(n);
  return n;
};

export const formatPalette = (hexes, { format = "css" } = {}) => {
  const used = new Set();
  const items = hexes.map((hex) => {
    const key = uniqName(smartName(hex), used);
    return { key, hex: hex.toLowerCase() };
  });

  if (format === "list") {
    return items.map(({ key, hex }) => `${key} — ${hex}`).join("\n");
  }

  if (format === "json") {
    const obj = Object.fromEntries(items.map(({ key, hex }) => [key, hex]));
    return JSON.stringify(obj, null, 2);
  }

  // css default
  return [
    ":root{",
    ...items.map(({ key, hex }) => `  --${key}: ${hex};`),
    "}",
  ].join("\n");
};
