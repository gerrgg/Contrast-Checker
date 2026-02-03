const setVisible = (el, on) => {
  el.classList.toggle("show", on);
};

export const applyResultFilters = () => {
  const expandToggle = document.getElementById("expandToggle");
  const aaaToggle = document.getElementById("aaaToggle");
  const aaToggle = document.getElementById("aaToggle");

  const sectionAAA = document.querySelector(".results-group--aaa");
  const sectionAA = document.querySelector(".results-group--aa");
  const sectionFAIL = document.querySelector(".results-group--fail");

  console.log("applyResultFilters", {
    expand: expandToggle?.checked,
    aaa: aaaToggle?.checked,
    aa: aaToggle?.checked,
    sectionAAA,
    sectionAA,
    sectionFAIL,
  });

  // Expand All ON => show all, force AA/AAA OFF
  if (expandToggle?.checked) {
    if (aaaToggle) aaaToggle.checked = false;
    if (aaToggle) aaToggle.checked = false;

    setVisible(sectionAAA, true);
    setVisible(sectionAA, true);
    setVisible(sectionFAIL, true);
    return;
  }

  const aaaOn = !!aaaToggle?.checked;
  const aaOn = !!aaToggle?.checked;

  // Default (none checked) => show all
  if (!aaaOn && !aaOn) {
    setVisible(sectionAAA, true);
    setVisible(sectionAA, true);
    setVisible(sectionFAIL, true);
    return;
  }

  // Only show selected pass groups; hide FAIL when filtering
  setVisible(sectionAAA, aaaOn);
  setVisible(sectionAA, aaOn);
  setVisible(sectionFAIL, false);
};

const initResultFilterControls = () => {
  console.log("initResultFilterControls");
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
