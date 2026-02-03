export const CHECK_SVG = `
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M7.81413 0.193663C7.56662 -0.0646356 7.16473 -0.0644728 6.91675 0.193663L2.87832 4.40314L1.0834 2.53235C0.83558 2.27406 0.433845 2.27406 0.185867 2.53235C-0.0619555 2.79065 -0.0619555 3.20937 0.185867 3.46783L2.42955 5.8062C2.55346 5.93534 2.71581 6 2.87816 6C3.04051 6 3.20317 5.93551 3.32693 5.8062L7.81413 1.12914C8.06196 0.871004 8.06196 0.452124 7.81413 0.193826V0.193663Z" fill="currentColor"/>
    </svg>
    `;

export const CHECK_SVG_FAIL = `
    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 0.5L6.5 6.0977" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
      <path d="M6.5 0.5L0.5 6.0977" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg>
    `;

// constants
export const defaultNumberOfInputs = 8;
export const localStorageKey = "contrast-checker-colors";

// labels
export const Labels = [
  "Color One",
  "Color Two",
  "Color Three",
  "Color Four",
  "Color Five",
  "Color Six",
  "Color Seven",
  "Color Eight",
];

export const ResultsLabels = {
  AAA: "Where Accessibility Shines",
  AA: "Technically Fine",
  FAIL: "Fails with Flair",
};
