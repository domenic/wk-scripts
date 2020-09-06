// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     2.0.7
// @author      Domenic Denicola
// @description Shows the always-updated number of lessons and reviews
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/real-numbers.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @require     https://raw.githubusercontent.com/domenic/wk-scripts/master/helpers/api.js#v3
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
    await applyUpdate();
    applyUpdatesForever();
  }, timeFromNow);
}

async function applyUpdate() {
  try {
    const [lessons, reviews] = await Promise.all([
      makeAPIRequest("assignments?immediately_available_for_lessons"),
      makeAPIRequest("assignments?immediately_available_for_review")
    ]);

    lessonsEl.className = getClassName("lessons", lessons.total_count);
    lessonsEl.dataset.count = lessonsEl.querySelector("span").textContent = lessons.total_count;

    reviewsEl.className = getClassName("reviews", reviews.total_count);
    reviewsEl.dataset.count = reviewsEl.querySelector("span").textContent = reviews.total_count;
  } catch (e) {
    console.error("[WK real numbers] " + e.message);
  }
}

function getClassName(type, number) {
  let theIntervalClassSuffix = 0;
  for (const intervalClassSuffix of intervals[type]) {
    if (number >= intervalClassSuffix) {
      theIntervalClassSuffix = intervalClassSuffix;
    } else {
      break;
    }
  }

  return `lessons-and-reviews__button lessons-and-reviews__${type}-button ` +
         `lessons-and-reviews__${type}-button--${theIntervalClassSuffix}`;
}
