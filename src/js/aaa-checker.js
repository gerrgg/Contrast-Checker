function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(lum1, lum2) {
  const L1 = Math.max(lum1, lum2);
  const L2 = Math.min(lum1, lum2);
  return (L1 + 0.05) / (L2 + 0.05);
}

// thresholds: "normal" or "large"
function classify(ratio, mode = "normal") {
  const AA = mode === "large" ? 3.0 : 4.5;
  const AAA = mode === "large" ? 4.5 : 7.0;

  if (ratio >= AAA) return "AAA";
  if (ratio >= AA) return "AA";
  return "FAIL";
}

function bucketPairs(colors, mode = "normal") {
  // colors: array of hex strings (or adapt to your format)
  const items = colors.map((c) => ({
    color: c,
    lum: relativeLuminance(hexToRgb(c)),
  }));

  const buckets = { AAA: [], AA: [], FAIL: [] };

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      const ratio = contrastRatio(a.lum, b.lum);
      const key = classify(ratio, mode);

      const obj = {
        a,
        b,
        ratio,
        normalTextAAA: ratio >= 7.0,
        normalTextAA: ratio >= 4.5,
        largeTextAAA: ratio >= 4.5,
        largeTextAA: ratio >= 3.0,
        graphicsAAA: ratio >= 4.5,
        graphicsAA: ratio >= 3.0,
      };

      // fg/bg and bg/fg
      buckets[key].push({ ...obj, a: b.color, b: a.color });
      buckets[key].push({ ...obj, a: a.color, b: b.color });
    }
  }

  // optional: best first
  for (const k of Object.keys(buckets)) {
    buckets[k].sort((x, y) => y.ratio - x.ratio);
  }

  return buckets;
}
export { bucketPairs, classify };
