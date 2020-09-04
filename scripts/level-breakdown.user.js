// ==UserScript==
// @name        WaniKani Level Breakdown
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.0.3
// @author      Domenic Denicola
// @description Displays the breakdown within Apprentice and Guru levels on the dashboard
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/level-breakdown.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/level-breakdown.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/level-breakdown.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @require     https://raw.githubusercontent.com/domenic/wk-scripts/master/helpers/api.js#v3
// @match       https://www.wanikani.com/
// @match       https://www.wanikani.com/dashboard
// @run-at      document-end
// @grant       GM_addStyle
// @noframes
// ==/UserScript==
"use strict";

(async () => {
  GM_addStyle(`.dashboard section.srs-progress span.level-breakdown {
    font-size: 15px;
    font-weight: normal;
    margin: -0.5em 0 0 0;
    text-shadow: none;
  }`);

  // Create the containers for all levels, for layout purposes, even if we don't fill them.
  for (const level of ["apprentice", "guru", "master", "enlightened", "burned"]) {
    const container = document.createElement("span");
    container.className = "level-breakdown";
    container.textContent = "\xA0"; // nonbreaking space, to ensure it doesn't collapse

    document.querySelector(`#${level} > span`).after(container);
  }

  const counts = await getCounts();
  for (const [level, levelCounts] of Object.entries(counts)) {
    const container = document.querySelector(`#${level} > .level-breakdown`);
    container.textContent = levelCounts.join(" / ");
  }
})();

async function getCounts() {
  const results = await Promise.all([
    makeAPIRequest("assignments?srs_stages=1"),
    makeAPIRequest("assignments?srs_stages=2"),
    makeAPIRequest("assignments?srs_stages=3"),
    makeAPIRequest("assignments?srs_stages=4"),
    makeAPIRequest("assignments?srs_stages=5"),
    makeAPIRequest("assignments?srs_stages=6")
  ]);

  const counts = results.map(result => result.total_count);
  const apprentice = counts.slice(0, 4);
  const guru = counts.slice(4, 6);

  return { apprentice, guru };
}
