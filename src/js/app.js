import { bucketPairs, whiteOrBlack } from "./aaa-checker";
import { formatPalette } from "./share";
import { applyResultFilters, updateFilterAvailability } from "./filters.js";

import {
  CHECK_SVG,
  CHECK_SVG_FAIL,
  defaultNumberOfInputs,
  localStorageKey,
  activeColorScheme,
  Labels,
  ResultsLabels,
} from "./config.js";

const setupColoris = () => {
  if (!window.Coloris) return;

  Coloris({
    el: "#color-picker-grid input[data-coloris]",
    theme: "default",
    themeMode: "auto",
    alpha: false,
    format: "hex",
    swatches: [
      "#ffffff",
      "#111010",
      "#5E9AD1",
      "#EDA124",
      "#50ED24",
      "#ED24C8",
    ],
    focusInput: false,

    onChange: (color, inputEl) => {
      const allColors = Array.from(
        document.querySelectorAll("#color-picker-grid input[data-coloris]"),
      ).map((input) => input.value);

      localStorage.setItem(localStorageKey, JSON.stringify(allColors));
    },
  });
};

const ContrastChecker = () => {
  // DOM elements
  const rootEl = document.getElementById("contrast-checker-app");
  const colorInputGrid = document.getElementById("color-picker-grid");
  const clearButton = document.getElementById("reset-colors-button");
  const submitButton = document.getElementById("check-contrast-button");
  const backToPaletteButton = document.getElementById("back-to-palette-button");
  const sharePaletteButton = document.getElementById("share-pallette-button");
  const selectedColorsList = document.getElementById("selected-colors-list");
  const toggleSelectedColorsButton = document.getElementById(
    "toggle-selected-colors-button",
  );

  const body = document.body;

  const updateSelectedColorsDisplay = (colors) => {
    selectedColorsList.innerHTML = "";

    colors.forEach((color) => {
      const swatch = document.createElement("button");

      swatch.classList.add("swatch");
      swatch.style.setProperty("--bg", color);
      swatch.style.setProperty("--fg", whiteOrBlack(color));

      swatch.textContent = color;

      swatch.addEventListener("click", () => {
        const updatedColors = colors.filter((c) => c !== color);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedColors));
        updateSelectedColorsDisplay(updatedColors);
        populateResults();
        populateColorInputs();
      });

      selectedColorsList.appendChild(swatch);
    });
  };

  const loadSavedColors = () => {
    const savedColors = localStorage.getItem(localStorageKey);
    const uniqueSavedColors = [...new Set(JSON.parse(savedColors) || [])];

    updateSelectedColorsDisplay(uniqueSavedColors);

    return uniqueSavedColors;
  };

  // Create color input field group
  const createColorInput = (index) => {
    const fieldGroup = document.createElement("div");
    fieldGroup.classList.add("field-group");

    const label = document.createElement("label");
    label.setAttribute("for", `color-${index + 1}`);
    label.textContent = Labels[index] || `Color ${index + 1}`;

    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("data-coloris", "");
    input.id = `color-${index + 1}`;

    const savedColors = loadSavedColors();
    input.value = savedColors[index] || "#ffffff";

    fieldGroup.appendChild(label);
    fieldGroup.appendChild(input);

    return fieldGroup;
  };

  // Populate color inputs
  const populateColorInputs = (numInputs) => {
    for (let i = 0; i < numInputs; i++) {
      const fieldGroup = createColorInput(i);
      const input = fieldGroup.querySelector("input");

      input.addEventListener("focus", (e) => {
        e.target.select();
      });

      // Coloris({ el: input });
      colorInputGrid.appendChild(fieldGroup);
    }
  };

  // Reset colors
  const resetColors = () => {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem(activeColorScheme);

    colorInputGrid.innerHTML = "";
    populateColorInputs(defaultNumberOfInputs);
    setupColoris();

    document.body.style.setProperty("--bg", "#ffffff");
    document.body.style.setProperty("--fg", "#000000");
    document.body.style.setProperty("--color-blue", "#5e9ad1");
    document.body.style.setProperty("--color-black", "#000000");
    document.body.style.setProperty("--color-white", "#ffffff");
    document.body.style.setProperty("--color-gray", "#666666");
    document.body.style.setProperty("--color-gray-light", "#cccccc");

    rootEl.classList.remove("show-results");
    populateResults();
  };

  // Create pass/fail cell
  const makePassCell = (passed, label) => {
    const td = document.createElement("td");
    td.innerHTML = passed
      ? `${CHECK_SVG}${label}`
      : `${CHECK_SVG_FAIL}${label}`;
    if (!passed) td.classList.add("fail");
    return td;
  };

  const setActiveColorScheme = (pair) => {
    body.style.setProperty("--bg", pair.b);
    body.style.setProperty("--fg", pair.a);
    body.style.setProperty("--color-blue", pair.a);
    body.style.setProperty("--color-black", pair.a);
    body.style.setProperty("--color-white", pair.b);
    body.style.setProperty("--color-gray", pair.a);
    body.style.setProperty("--color-gray-light", pair.a);

    const activeScheme = [
      { name: "fg", color: pair.a },
      { name: "bg", color: pair.b },
    ];

    localStorage.setItem(activeColorScheme, JSON.stringify(activeScheme));
  };

  // Populate results
  const populateResults = () => {
    // load saved colors
    const savedColors = loadSavedColors();
    const buckets = bucketPairs(savedColors);

    if (
      buckets.AAA.length === 0 &&
      buckets.AA.length === 0 &&
      buckets.FAIL.length === 0
    ) {
      rootEl.classList.remove("show-results");
      return;
    } else {
      rootEl.classList.add("show-results");
    }

    const resultsGrid = document.getElementById("contrast-results-grid");
    resultsGrid.innerHTML = "";

    Object.keys(buckets).forEach((key) => {
      const bucket = buckets[key];

      if (bucket.length === 0) return;

      const sectionGroup = document.createElement("div");
      sectionGroup.classList.add(
        "results-group",
        "results-group--" + key.toLowerCase(),
      );

      const heading = document.createElement("h4");
      heading.textContent = ResultsLabels?.[key] ?? key;
      sectionGroup.appendChild(heading);

      const section = document.createElement("div");
      section.classList.add("results", "results--" + key.toLowerCase());

      bucket.forEach((pair) => {
        const pairDiv = document.createElement("div");
        pairDiv.classList.add("result");

        if (key === "FAIL" && (pair.a === "#ffffff" || pair.b === "#ffffff")) {
          pairDiv.classList.add("result--white-fg");
        }

        pairDiv.style.setProperty("--bg", pair.b);
        pairDiv.style.setProperty("--fg", pair.a);

        // top bits
        const spanLabel = document.createElement("span");
        spanLabel.classList.add("result-label");
        spanLabel.textContent = "Aa";

        const spanBorder = document.createElement("span");
        spanBorder.classList.add("result-border");
        spanBorder.innerHTML = "&nbsp;";

        // details
        const details = document.createElement("div");
        details.classList.add("result-details");

        const ratioSpan = document.createElement("span");
        ratioSpan.classList.add("result-ratio");
        ratioSpan.textContent = pair.ratio.toFixed(2);

        const colors = document.createElement("div");
        colors.classList.add("colors");

        const fg = document.createElement("div");
        fg.classList.add("color");
        fg.innerHTML = `
        <span class="swatch fg"></span>
        <label>Foreground <span>${pair.a}</span></label>
      `;

        const bg = document.createElement("div");
        bg.classList.add("color");
        bg.innerHTML = `
        <span class="swatch bg"></span>
        <label>Background <span>${pair.b}</span></label>
      `;

        colors.appendChild(fg);
        colors.appendChild(bg);

        const table = document.createElement("table");
        table.innerHTML = `
        <tr>
          <td>Normal Text</td>
        </tr>
        <tr>
          <td>Large Text</td>
        </tr>
        <tr>
          <td>Graphics</td>
        </tr>
      `;

        // fill rows with AA/AAA cells
        const rows = table.querySelectorAll("tr");

        // Normal Text: AA (>=4.5), AAA (>=7.0)
        rows[0].appendChild(makePassCell(!!pair.normalTextAA, "AA"));
        rows[0].appendChild(makePassCell(!!pair.normalTextAAA, "AAA"));

        // Large Text: AA (>=3.0), AAA (>=4.5)
        rows[1].appendChild(makePassCell(!!pair.largeTextAA, "AA"));
        rows[1].appendChild(makePassCell(!!pair.largeTextAAA, "AAA"));

        // Graphics: AA (>=3.0), AAA (>=4.5)
        rows[2].appendChild(makePassCell(!!pair.graphicsAA, "AA"));
        rows[2].appendChild(makePassCell(!!pair.graphicsAAA, "AAA"));

        // assemble
        details.appendChild(ratioSpan);
        details.appendChild(colors);
        details.appendChild(table);
        pairDiv.appendChild(spanLabel);
        pairDiv.appendChild(spanBorder);
        pairDiv.appendChild(details);

        pairDiv.addEventListener("click", () => {
          setActiveColorScheme(pair);
        });

        section.appendChild(pairDiv);
      });

      sectionGroup.appendChild(section);
      resultsGrid.appendChild(sectionGroup);
    });

    updateFilterAvailability();
    applyResultFilters();
  };

  // Initial population
  populateColorInputs(defaultNumberOfInputs);
  setupColoris();

  // events
  clearButton.addEventListener("click", resetColors);
  submitButton.addEventListener("click", populateResults);

  backToPaletteButton.addEventListener("click", () => {
    rootEl.classList.remove("show-results");
  });

  toggleSelectedColorsButton.addEventListener("click", () => {
    rootEl.classList.remove("show-results");
  });

  sharePaletteButton.addEventListener("click", () => {
    const savedColors = loadSavedColors();
    const savedColorsFormatted = formatPalette(savedColors, { format: "css" });

    navigator.clipboard.writeText(savedColorsFormatted);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  ContrastChecker();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".clr-field button");
  if (!btn) return;

  const input = btn.parentElement.querySelector("input[data-coloris]");
  if (!input) return;

  input.dispatchEvent(new Event("focus", { bubbles: true }));
});

const isColorInput = (t) =>
  t instanceof HTMLInputElement && t.matches("input[data-coloris]");

const isValidCssColor = (val) => {
  if (!val) return false;
  if (window.CSS && CSS.supports) {
    return CSS.supports("color", val);
  }
  const s = document.createElement("span").style;
  s.color = "";
  s.color = val;
  return s.color !== "";
};

document.addEventListener(
  "focusout",
  (e) => {
    const input = e.target;
    if (!isColorInput(input)) return;

    const val = input.value.trim();
    input.classList.remove("color-error");

    if (!val) return;

    if (isValidCssColor(val)) {
      input.value = val;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      input.classList.add("color-error");
    }
  },
  true,
);

document.addEventListener("input", (e) => {
  if (!e.target.matches("[data-coloris]")) return;

  const field = e.target.closest(".clr-field");
  field.style.color = e.target.value; // updates the little swatch
});
