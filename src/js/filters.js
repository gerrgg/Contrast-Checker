const setVisible = (el, on) => {
  if (!el) return;
  el.classList.toggle("show", !!on);
};

const hasResults = (section) => !!section && !!section.querySelector(".result");

const safeShow = (section, on) =>
  setVisible(section, !!on && hasResults(section));

export const updateFilterAvailability = () => {
  const sectionAAA = document.querySelector(".results-group--aaa");
  const sectionAA = document.querySelector(".results-group--aa");
  const sectionFAIL = document.querySelector(".results-group--fail");

  const controlAAA = document.querySelector(".filter--aaa");
  const controlAA = document.querySelector(".filter--aa");
  const expandControl = document.querySelector(".filter--all");
  const switchGroup = document.querySelector(".filters--left");

  const aaaToggle = document.getElementById("aaaToggle");
  const aaToggle = document.getElementById("aaToggle");
  const expandToggle = document.getElementById("expandToggle");

  const aaaValid = hasResults(sectionAAA);
  const aaValid = hasResults(sectionAA);
  const failValid = hasResults(sectionFAIL);

  // Count how many result groups exist
  const groupCount = [aaaValid, aaValid, failValid].filter(Boolean).length;

  console.log("groupCount:", groupCount);

  // Always hide empty sections
  safeShow(sectionAAA, aaaValid);
  safeShow(sectionAA, aaValid);
  safeShow(sectionFAIL, failValid);

  // If fewer than 2 groups → hide ALL filters
  if (groupCount < 2) {
    if (switchGroup) switchGroup.classList.remove("show");

    if (aaaToggle) aaaToggle.checked = false;
    if (aaToggle) aaToggle.checked = false;
    if (expandToggle) expandToggle.checked = false;
    return;
  }

  // Otherwise show filter UI
  if (switchGroup) switchGroup.classList.add("show");

  if (controlAAA) controlAAA.classList.toggle("show", aaaValid);
  if (controlAA) controlAA.classList.toggle("show", aaValid);
  if (expandControl) expandControl.classList.add("show");
};

export const applyResultFilters = () => {
  const expandToggle = document.getElementById("expandToggle");
  const aaaToggle = document.getElementById("aaaToggle");
  const aaToggle = document.getElementById("aaToggle");

  const sectionAAA = document.querySelector(".results-group--aaa");
  const sectionAA = document.querySelector(".results-group--aa");
  const sectionFAIL = document.querySelector(".results-group--fail");

  const aaaOn = !!aaaToggle?.checked;
  const aaOn = !!aaToggle?.checked;

  // Expand All ON => show all, force AA/AAA OFF
  if (expandToggle?.checked) {
    if (aaaToggle) aaaToggle.checked = false;
    if (aaToggle) aaToggle.checked = false;

    safeShow(sectionAAA, true);
    safeShow(sectionAA, true);
    safeShow(sectionFAIL, true);
    return;
  }

  // Default (none checked) => show all
  if (!aaaOn && !aaOn) {
    safeShow(sectionAAA, true);
    safeShow(sectionAA, true);
    safeShow(sectionFAIL, true);
    return;
  }

  // Only show selected pass groups; hide FAIL when filtering
  safeShow(sectionAAA, aaaOn);
  safeShow(sectionAA, aaOn);
  safeShow(sectionFAIL, false);
};

const initResultFilterControls = () => {
  const expandToggle = document.getElementById("expandToggle");
  const aaaToggle = document.getElementById("aaaToggle");
  const aaToggle = document.getElementById("aaToggle");

  if (!expandToggle || !aaaToggle || !aaToggle) return;

  // prevent double-binding
  if (expandToggle.dataset.bound === "1") return;
  expandToggle.dataset.bound = "1";

  expandToggle.addEventListener("change", () => {
    applyResultFilters();
  });

  const onFilterChange = () => {
    expandToggle.checked = false; // AA/AAA disables Expand All
    applyResultFilters();
  };

  aaaToggle.addEventListener("change", onFilterChange);
  aaToggle.addEventListener("change", onFilterChange);
};

initResultFilterControls();
