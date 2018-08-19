// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.0.0
// @author      Domenic Denicola
// @description Shows the real number of lessons and reviews, instead of 42+
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/real-numbers.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/real-numbers.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @match       https://www.wanikani.com/*
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
"use strict";

const FAKE_NUMBER = "42+";
const REDIRECT_SIGNAL_SUFFIX = "?redirected-by-wk-real-numbers";

(async () => {
  const lessonsEl = document.querySelector(".lessons span");
  const reviewsEl = document.querySelector(".reviews span");

  if (!lessonsEl || !reviewsEl) {
    // Not on a page that displays these.
    console.debug("[WK real numbers] Not on a page that displays lesson/review numbers.");
    return;
  }

  if (lessonsEl.textContent !== FAKE_NUMBER && reviewsEl.textContent !== FAKE_NUMBER) {
    // Numbers are real, so no need to do anything.
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
    const apiKey = getAPIKey();
    console.debug(`[WK real numbers] API key is ${apiKey}.`);

    const { lessons, reviews } = await getData(apiKey);
    lessonsEl.textContent = lessons;
    reviewsEl.textContent = reviews;
  } catch (e) {
    console.error("[WK real numbers] " + e.message);
    lessonsEl.textContent = lessonsBefore;
    reviewsEl.textContent = reviewsBefore;
  }
})();

async function getData(apiKey) {
  const json = await (await fetch(`/api/user/${apiKey}/study-queue`)).json();

  if (json.error) {
    throw new Error("API error: " + json.error.message);
  }

  return {
    lessons: json.requested_information.lessons_available,
    reviews: json.requested_information.reviews_available
  };
}

// Hmm. Could we use iframes?
// Original version did confirm() before redirecting you. Is that a good idea?
function getAPIKey() {
  const apiKeyFromStorage = localStorage.getItem("apiKey");
  if (apiKeyFromStorage) {
    return apiKeyFromStorage;
  }

  if (window.location.href.includes("/account")) {
    const apiKeyFromPage = document.getElementById("user_api_key").value;

    if (!apiKeyFromPage) {
      throw new Error("Could not find the API key on the account page. Be sure you have generated one!");
    }

    localStorage.setItem("apiKey", apiKeyFromPage);

    if (window.location.href.includes(REDIRECT_SIGNAL_SUFFIX)) {
      window.location = "/dashboard" + REDIRECT_SIGNAL_SUFFIX;
    }

    return apiKeyFromPage;
  } else if (!window.location.href.includes(REDIRECT_SIGNAL_SUFFIX)) { // Avoid infinite looping back and forth
    window.location = "/account" + REDIRECT_SIGNAL_SUFFIX;
  }

  return null;
}
