"use strict";
const API_KEY_LENGTH = 36;

async function makeAPIRequest(path) {
  const apiKey = await getAPIKey();

  const res = await fetch(`https://api.wanikani.com/v2/${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!res.ok) {
    localStorage.removeItem("apiKey2");
    throw new Error(`API call resulted in ${res.status} status`);
  }
  const json = await res.json();

  return json;
}

async function getAPIKey() {
  const apiKeyFromStorage = localStorage.getItem("apiKey2");
  if (apiKeyFromStorage) {
    return apiKeyFromStorage;
  }

  console.debug("[WK Helpers] API key not stored; fetching it.");
  const accountRes = await fetch("/settings/personal_access_tokens");
  if (!accountRes.ok) {
    throw new Error(`Fetching the personal access tokens page gave a ${accountRes.status} status`);
  }
  const accountDocument = parseDocument(await accountRes.text());
  const apiKey = accountDocument.querySelector(".personal-access-token-token > code").textContent;

  if (apiKey.length !== API_KEY_LENGTH) {
    throw new Error("Failed to get API key from the account page");
  }

  localStorage.setItem("apiKey2", apiKey);
  return apiKey;
}

function parseDocument(string) {
  return (new DOMParser()).parseFromString(string, "text/html");
}
