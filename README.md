# Contrast Checker

A small web tool for checking color contrast to meet accessibility standards (WCAG). It uses the project's HTML/CSS/JS to calculate contrast ratios and display pass/fail results.

## Features

- Calculates WCAG contrast ratios for foreground/background color pairs
- Shows AAA/AA conformance results
- Lightweight, client-side implementation

## Requirements

- Node.js (for development/build tasks)
- A modern web browser to open `index.html`

## Install

1. Clone the repository

   git clone <repo-url>
   cd contrast-checker

2. Install dependencies

   npm install

## Usage

- During development, open `src/index.html` in a browser or run a local dev server.
- To build (if project configured with a bundler):

  npm run build

- Open the built `index.html` (or `dist` output) in a browser to use the tool.

## Development

- Source files live in `src/`.
  - `src/js/` contains JavaScript logic (checker, app, filters, share).
  - `src/scss/` contains styles.
  - `src/index.html` is the entry HTML.
- Run your preferred dev server (e.g., `npx http-server src`) to serve the files locally.

## File Structure (important files)

- `src/index.html` — entry HTML
- `src/js/aaa-checker.js` — core contrast checking logic
- `src/js/app.js` — application bootstrapping
- `src/scss/` — styling

## Contributing

Contributions welcome. Please open issues or submit pull requests for bugs and improvements.

## License

Specify a license (e.g., MIT) in a `LICENSE` file if you intend to open-source this project.
