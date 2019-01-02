// ==UserScript==
// @name        WaniKani Progress Colors
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.0.1
// @author      Domenic Denicola
// @description Changes the progress colors so that they are different from the kanji and vocab colors
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/progress-colors.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/progress-colors.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/progress-colors.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @match       https://www.wanikani.com/*
// @match       https://www.wkstats.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @noframes
// ==/UserScript==
"use strict";

const levels = [
  { level: "apprentice", short: "appr", color: "#D01916", gradientColor: "#CD1818" },
  { level: "guru", short: "guru", color: "#D07616", gradientColor: "#AD6818" },
  { level: "master", short: "mast", color: "#D0CA16", gradientColor: "#ADAD18" },
  { level: "enlighten", short: "enli", color: "#73D016", gradientColor: "#63AD18" }
];
// We leave "Burned" as-is.
// TODO: wkstats uses different burned color than WK itself; harmonize?

let rules = "";

let ordinal = 1;
for (const { level, short, color, gradientColor } of levels) {
  rules += `
    .dashboard section.srs-progress ul li:nth-child(${ordinal}),
    .${level}-lattice,
    .lattice-single-character .${level}-lattice,
    .lattice-multi-character .${level}-lattice
    {
      background: linear-gradient(-45deg, ${gradientColor}, ${color});
    }

    #timeline svg .${short}
    {
      fill: ${color} !important;
    }
    #timeline .review_info[data-mode="srs_stage"] .${short}
    {
      background: linear-gradient(-45deg, ${gradientColor}, ${color});
    }

    #pg_items.fast .${short} {
      background: linear-gradient(-45deg, ${gradientColor}, ${color});
    }
  `;
  ++ordinal;
}

GM_addStyle(rules);
