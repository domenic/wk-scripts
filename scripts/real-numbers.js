// ==UserScript==
// @name        WaniKani Real Numbers
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.1.0
// @author      Domenic Denicola
// @description Shows the real number of lessons and reviews, instead of 42+
// @license     MIT
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
const API_KEY_LENGTH = 32;

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
    const apiKey = await getAPIKey();
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
  const res = await fetch(`/api/user/${apiKey}/study-queue`);
  if (!res.ok) {
    localStorage.removeItem("apiKey");
    throw new Error(`API call resulted in ${res.status} status`);
  }
  const json = await res.json();

  if (json.error) {
    throw new Error("API error: " + json.error.message);
  }

  return {
    lessons: json.requested_information.lessons_available,
    reviews: json.requested_information.reviews_available
  };
}

async function getAPIKey() {
  const apiKeyFromStorage = localStorage.getItem("apiKey");
  if (apiKeyFromStorage) {
    return apiKeyFromStorage;
  }

  console.debug("[WK real numbers] API key not stored; fetching it.");
  const accountRes = await fetch("/settings/account");
  if (!accountRes.ok) {
    throw new Error(`Fetching the account page gave a ${accountRes.status} status`);
  }
  const accountDocument = parseDocument(await accountRes.text());
  const apiKey = accountDocument.querySelector("#user_api_key").value;

  if (typeof apiKey !== "string" || apiKey.length !== API_KEY_LENGTH) {
    throw new Error("Failed to get API key from the account page");
  }

  localStorage.setItem("apiKey", apiKey);
  return apiKey;
}

function parseDocument(string) {
  return (new DOMParser()).parseFromString(string, "text/html");
}
