<?php
/**
 * Plugin Name: Contrast Checker
 * Description: A color contrast checker tool for WordPress.
 * Author: Greg Bastianelli (Floodlight Design)
 * Version: 1.0.1
 * License: GPL2+
 * Text Domain: contrast-checker
 */

if (!defined('ABSPATH')) exit;

class Contrast_Checker_Plugin {
  private $needs_assets = false;

  public function __construct() {
    add_shortcode('contrast_checker', [$this, 'shortcode']);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
  }

  public function shortcode($atts = []) {
    $this->needs_assets = true;

    return <<<HTML
<div id="contrast-checker-app">
  <div class="introduction wrap"><h1>Happy Eyes</h1></div>

  <div id="initial-view" class="initial-view wrap">
    <div class="context">
      <h2>Let’s see if your colors play nice.</h2>
      <p>Drop in up to eight of your favorite hues and we’ll do the hard part — mixing, matching, and testing every possible combo for accessibility. In seconds, you’ll see which pairings pass AA and AAA contrast standards, and which ones need a little extra glow-up.</p>
    </div>

    <div id="color-picker-grid"></div>

    <div class="actions button-group">
      <button id="check-contrast-button" class="button button--default">Show Me The Contrast</button>
      <button id="reset-colors-button" class="button button--default--inverse">Reset Colors</button>
    </div>
  </div>

  <div id="submitted-view" class="submitted-view wrap">
    <h3><strong>CONGRATS!</strong> You’re a full blown designer.</h3>

    <div class="filters">
      <div class="filters--left">
        <label for="filter-contrast-level">Show Me</label>

        <div class="switch-group">
          <div class="button-switch filter--all">
            <span class="switch-label">Expand All</span>
            <label class="switch">
              <input type="checkbox" id="expandToggle"/>
              <span class="slider">
                <i>
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5L5.72 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M5.72 0.5L0.5 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                  </svg>
                </i>
              </span>
            </label>
          </div>

          <div class="button-switch filter--aa">
            <span class="switch-label">AA</span>
            <label class="switch">
              <input type="checkbox" id="aaToggle"/>
              <span class="slider">
                <i>
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5L5.72 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M5.72 0.5L0.5 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                  </svg>
                </i>
              </span>
            </label>
          </div>

          <div class="button-switch filter--aaa">
            <span class="switch-label">AAA</span>
            <label class="switch">
              <input type="checkbox" id="aaaToggle"/>
              <span class="slider">
                <i>
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.5L5.72 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M5.72 0.5L0.5 5.37" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
                  </svg>
                </i>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div id="contrast-results-grid"></div>

    <div class="footer">
      <button id="back-to-palette-button" class="button button--primary">Back to Palette</button>
      <button id="share-pallette-button" class="button button--text">Share The Palette</button>
    </div>

    <div id="selected-colors" class="selected-colors">
      <button id="toggle-selected-colors-button" class="button--icon">
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3201 5.45L0.500069 5.44999" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
          <path d="M5.72021 10.32L0.500216 5.45" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
          <path d="M0.500216 5.37L5.72022 0.500003" stroke="currentcolor" stroke-miterlimit="10" stroke-linecap="round"/>
        </svg>
      </button>

      <h4>Adjust Your Colors</h4>

      <div id="selected-colors-list">
        <button class="swatch swatch--remove" style="--bg: #000; --fg: #fff">#000000</button>
        <button class="swatch swatch--remove" style="--bg: #fff; --fg: #000">#ffffff</button>
      </div>
    </div>
  </div>
</div>
HTML;
  }

  public function enqueue_assets() {
    // if (!$this->needs_assets) return;

    $base_dir = plugin_dir_path(__FILE__) . 'dist/';
    $base_url = plugin_dir_url(__FILE__) . 'dist/';

    // External Coloris (as in your index.html)
    wp_enqueue_style('coloris', 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css', [], null);
    wp_enqueue_script('coloris', 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js', [], null, true);

    // App CSS
    $css_rel = 'assets/app.51d53be5.css';
    if (file_exists($base_dir . $css_rel)) {
      wp_enqueue_style('contrast-checker', $base_url . $css_rel, ['coloris'], filemtime($base_dir . $css_rel));
    }

    // App JS (must match index.html order)
    $js1_rel = 'assets/app.8c83b581.js';
    $js2_rel = 'assets/app.97b8792f.js';

    if (file_exists($base_dir . $js1_rel)) {
      wp_enqueue_script('contrast-checker-app-1', $base_url . $js1_rel, ['coloris'], filemtime($base_dir . $js1_rel), true);
    }

    if (file_exists($base_dir . $js2_rel)) {
      wp_enqueue_script('contrast-checker-app-2', $base_url . $js2_rel, ['contrast-checker-app-1'], filemtime($base_dir . $js2_rel), true);
    }

    // Body style variables from your <body style="...">
    wp_add_inline_script('contrast-checker-app-2', <<<JS
(function(){
  document.body.style.setProperty("--bg", "#ffffff");
  document.body.style.setProperty("--fg", "#000000");
  document.body.style.setProperty("--color-blue", "#5e9ad1");
})();
JS, 'before');

    // Your inline localStorage scheme script
    wp_add_inline_script('contrast-checker-app-2', <<<JS
(function(){
  const activeColorScheme = "contrast-checker-active-scheme";
  const activePage = document.querySelector(
      "body.page-template-template-contrast-checker",
    );
  const savedScheme = localStorage.getItem(activeColorScheme);
  if (!savedScheme || !activePage) return;

  try {
    const scheme = JSON.parse(savedScheme);
    document.body.style.setProperty("--fg", scheme[0].color);
    document.body.style.setProperty("--bg", scheme[1].color);

    document.body.style.setProperty("--color-blue", scheme[0].color);
    document.body.style.setProperty("--color-black", scheme[0].color);
    document.body.style.setProperty("--color-white", scheme[1].color);
    document.body.style.setProperty("--color-gray", scheme[0].color);
    document.body.style.setProperty("--color-gray-light", scheme[0].color);
  } catch (e) {}
})();
JS, 'after');
  }
}

new Contrast_Checker_Plugin();
