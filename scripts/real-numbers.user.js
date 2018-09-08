// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.1.1
// @author      Domenic Denicola
// @description Shows the real number of lessons and reviews, instead of 42+
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
    return;
  }

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
})();
