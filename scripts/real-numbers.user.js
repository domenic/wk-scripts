// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     2.0.2
// @author      Domenic Denicola
// @description Shows the always-updated number of lessons and reviews
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/real-numbers.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @require     https://raw.githubusercontent.com/domenic/wk-scripts/master/helpers/api.js#v2
// @match       https://www.wanikani.com/*
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
"use strict";

(() => {
  const lessonsEl = document.querySelector(".navigation-shortcut--lessons");
  const reviewsEl = document.querySelector(".navigation-shortcut--reviews");

  if (!lessonsEl || !reviewsEl) {
    console.debug("[WK real numbers] Not on a page that displays lesson/review numbers.");
    return;
  }

  applyUpdatesForever(lessonsEl, reviewsEl);

  // Also apply updates immediately if someone switches back to this tab, just in case the in-the-background
  // updating was throttled or ignored by the browser.
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      await applyUpdate(lessonsEl, reviewsEl);
      console.debug("[WK real numbers] Numbers updated because the tab became foreground.");
    }
  });
})();

function applyUpdatesForever(lessonsEl, reviewsEl) {
  const timeToUpdate = new Date();
  timeToUpdate.setUTCHours(timeToUpdate.getUTCHours() + 1, 0, 1, 0);

  console.debug(`[WK real numbers] Numbers updated at ${(new Date()).toISOString()}; ` +
                `next update scheduled for ${timeToUpdate.toISOString()}.`);

  const timeFromNow = timeToUpdate - Date.now();
  setTimeout(async () => {
    await applyUpdate(lessonsEl, reviewsEl);
    applyUpdatesForever(lessonsEl, reviewsEl);
  }, timeFromNow);
}

async function applyUpdate(lessonsEl, reviewsEl) {
  try {
    const studyQueue = await getAPIData("study-queue");
    lessonsEl.dataset.count = lessonsEl.querySelector("span").textContent = studyQueue.lessons_available;
    reviewsEl.dataset.count = reviewsEl.querySelector("span").textContent = studyQueue.reviews_available;
  } catch (e) {
    console.error("[WK real numbers] " + e.message);
  }
}
