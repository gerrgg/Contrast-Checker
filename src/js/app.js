import { bucketPairs } from "./aaa-checker";
import { formatPalette } from "./share";

const ContrastChecker = () => {
  const CHECK_SVG = `
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M7.81413 0.193663C7.56662 -0.0646356 7.16473 -0.0644728 6.91675 0.193663L2.87832 4.40314L1.0834 2.53235C0.83558 2.27406 0.433845 2.27406 0.185867 2.53235C-0.0619555 2.79065 -0.0619555 3.20937 0.185867 3.46783L2.42955 5.8062C2.55346 5.93534 2.71581 6 2.87816 6C3.04051 6 3.20317 5.93551 3.32693 5.8062L7.81413 1.12914C8.06196 0.871004 8.06196 0.452124 7.81413 0.193826V0.193663Z" fill="currentColor"/>
  </svg>
  `;

  const CHECK_SVG_FAIL = `
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 0.5L6.5 6.0977" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
    <path d="M6.5 0.5L0.5 6.0977" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
  </svg>
  `;

  // constants
  const defaultNumberOfInputs = 8;
  const localStorageKey = "contrast-checker-colors";

  // DOM elements
  const rootEl = document.getElementById("contrast-checker-app");
  const colorInputGrid = document.getElementById("color-picker-grid");
  const clearButton = document.getElementById("reset-colors-button");
  const submitButton = document.getElementById("check-contrast-button");
  const backToPaletteButton = document.getElementById("back-to-palette-button");
  const sharePaletteButton = document.getElementById("share-pallette-button");

  // labels
  const Labels = [
    "Color One",
    "Color Two",
    "Color Three",
    "Color Four",
    "Color Five",
    "Color Six",
    "Color Seven",
    "Color Eight",
  ];

  const ResultsLabels = {
    AAA: "Where Accessibility Shines",
    AA: "Technically Fine",
    FAIL: "Fails with Flair",
  };

  const loadSavedColors = () => {
    const localStorageKey = "contrast-checker-colors";
    const savedColors = localStorage.getItem(localStorageKey);
    const uniqueSavedColors = [...new Set(JSON.parse(savedColors) || [])];
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

      Coloris({ el: input });
      colorInputGrid.appendChild(fieldGroup);
    }
  };

  // Reset colors
  const resetColors = () => {
    localStorage.removeItem(localStorageKey);
    colorInputGrid.innerHTML = "";
    populateColorInputs(defaultNumberOfInputs);
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
      const heading = document.createElement("h4");
      heading.textContent = ResultsLabels?.[key] ?? key;
      resultsGrid.appendChild(heading);

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

        rows[2].appendChild(makePassCell(!!pair.graphicsAA, "AA"));
        rows[2].appendChild(makePassCell(!!pair.graphicsAAA, "AAA"));

        details.appendChild(ratioSpan);
        details.appendChild(colors);
        details.appendChild(table);

        pairDiv.appendChild(spanLabel);
        pairDiv.appendChild(spanBorder);
        pairDiv.appendChild(details);

        section.appendChild(pairDiv);
      });

      resultsGrid.appendChild(section);
    });
  };

  // Coloris onChange event
  Coloris({
    onChange: (color, inputEl) => {
      const allColors = Array.from(
        document.querySelectorAll("#color-picker-grid input"),
      ).map((input) => input.value);
      localStorage.setItem(localStorageKey, JSON.stringify(allColors));
    },
  });

  // Initial population
  populateColorInputs(defaultNumberOfInputs);
  populateResults();

  // events
  clearButton.addEventListener("click", resetColors);
  submitButton.addEventListener("click", populateResults);

  backToPaletteButton.addEventListener("click", () => {
    rootEl.classList.remove("show-results");
  });

  sharePaletteButton.addEventListener("click", () => {
    const savedColors = loadSavedColors();
    const paletteString = savedColors.join(", ");
    const savedColorsFormatted = formatPalette(savedColors, { format: "css" });

    navigator.clipboard.writeText(savedColorsFormatted).then(() => {
      alert("Palette copied to clipboard: \n" + savedColorsFormatted);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  ContrastChecker();
});

Coloris({
  theme: "default",
  themeMode: "auto",
  alpha: false,
  format: "hex",
  swatches: ["#ffffff", "#111010", "#5E9AD1", "#EDA124", "#50ED24", "#ED24C8"],
  focusInput: false,
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
