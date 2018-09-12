// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.2.0
// @author      Domenic Denicola
// @description Shows the real, always-updated number of lessons and reviews, instead of 42+
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/real-numbers.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @require     https://raw.githubusercontent.com/domenic/wk-scripts/master/helpers/api.js
// @match       https://www.wanikani.com/*
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
"use strict";

const FAKE_NUMBER = "42+";

(async () => {
  const lessonsEl = document.querySelector(".lessons span");
  const reviewsEl = document.querySelector(".reviews span");

  if (!lessonsEl || !reviewsEl) {
    console.debug("[WK real numbers] Not on a page that displays lesson/review numbers.");
    return;
  }

  if (lessonsEl.textContent !== FAKE_NUMBER && reviewsEl.textContent !== FAKE_NUMBER) {
    console.debug("[WK real numbers] Numbers are real already so no need to do anything.");
  } else {
    await applyUpdate(lessonsEl, reviewsEl);
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
  // Set these to empty immediately, as the page loading empty then transitioning to real numbers
  // looks natural, whereas the page loading with FAKE_NUMBER then transitioning to real numbers
  // looks janky. (But, save the old values for error recovery.)
  const lessonsBefore = lessonsEl.textContent;
  const reviewsBefore = reviewsEl.textContent;
  lessonsEl.textContent = "";
  reviewsEl.textContent = "";

  try {
    const studyQueue = await getAPIData("study-queue");
    lessonsEl.textContent = studyQueue.lessons_available;
    reviewsEl.textContent = studyQueue.reviews_available;
  } catch (e) {
    console.error("[WK real numbers] " + e.message);
    lessonsEl.textContent = lessonsBefore;
    reviewsEl.textContent = reviewsBefore;
  }
}
