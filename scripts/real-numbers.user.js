// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     2.0.4
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

// From WaniKani's CSS, these are the intervals for which CSS classes exist.
const intervals = {
  lessons: [0, 1, 25, 50, 100, 250, 500],
  reviews: [0, 1, 50, 100, 250, 500, 1000]
};

const lessonsEl = document.querySelector(`[class*="lessons-and-reviews__lessons-button--"]`);
const reviewsEl = document.querySelector(`[class*="lessons-and-reviews__reviews-button--"]`);

(() => {
  if (!lessonsEl || !reviewsEl) {
    console.debug("[WK real numbers] Not on a page that displays lesson/review numbers.");
    return;
  }

  applyUpdatesForever();

  // Also apply updates immediately if someone switches back to this tab, just in case the in-the-background
  // updating was throttled or ignored by the browser.
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible") {
      await applyUpdate();
      console.debug("[WK real numbers] Numbers updated because the tab became foreground.");
    }
  });
})();

function applyUpdatesForever() {
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

async function applyUpdate() {
  try {
    const studyQueue = await getAPIData("study-queue");

    lessonsEl.className = getClassName("lessons", studyQueue.lessons_available);
    lessonsEl.dataset.count = lessonsEl.querySelector("span").textContent = studyQueue.lessons_available;

    reviewsEl.className = getClassName("reviews", studyQueue.reviews_available);
    reviewsEl.dataset.count = reviewsEl.querySelector("span").textContent = studyQueue.reviews_available;
  } catch (e) {
    console.error("[WK real numbers] " + e.message);
  }
}

function getClassName(type, number) {
  let theIntervalClassSuffix = 0;
  for (const intervalClassSuffix of intervals[type]) {
    if (number > intervalClassSuffix) {
      theIntervalClassSuffix = intervalClassSuffix;
    } else {
      break;
    }
  }

  return `lessons-and-reviews__button lessons-and-reviews__${type}-button ` +
         `lessons-and-reviews__${type}-button--${theIntervalClassSuffix}`;
}
