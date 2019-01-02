// ==UserScript==
// @name        WaniKani Level Breakdown
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.0.1
// @author      Domenic Denicola
// @description Displays the breakdown within Apprentice and Guru levels on the dashboard
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/level-breakdown.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/level-breakdown.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/level-breakdown.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @require     https://raw.githubusercontent.com/domenic/wk-scripts/master/helpers/api.js
// @match       https://www.wanikani.com/
// @match       https://www.wanikani.com/dashboard
// @run-at      document-end
// @grant       GM_addStyle
// @noframes
// ==/UserScript==
"use strict";
const APPRENTICE_1 = 1;
const APPRENTICE_2 = 2;
const APPRENTICE_3 = 3;
const APPRENTICE_4 = 4;
const GURU_1 = 5;
const GURU_2 = 6;

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
  const allItems = await Promise.all([
    getAPIData("radicals"),
    getAPIData("kanji"),
    getAPIData("vocabulary").then(d => d.general) // no idea why this is necessary
  ]);

  const apprentice = [
    totalPerLevel(allItems, APPRENTICE_1),
    totalPerLevel(allItems, APPRENTICE_2),
    totalPerLevel(allItems, APPRENTICE_3),
    totalPerLevel(allItems, APPRENTICE_4)
  ];
  const guru = [
    totalPerLevel(allItems, GURU_1),
    totalPerLevel(allItems, GURU_2)
  ];

  return { apprentice, guru };
}

function totalPerLevel(allItems, level) {
  return allItems.reduce((soFar, items) => soFar + countLevel(items, level), 0);
}

function countLevel(items, level) {
  return items.filter(r => r.user_specific && r.user_specific.srs_numeric === level).length;
}
