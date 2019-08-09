"use strict";
const API_KEY_LENGTH = 32;

async function getAPIData(path) {
  const apiKey = await getAPIKey();

  const res = await fetch(`/api/user/${apiKey}/${path}`);
  if (!res.ok) {
    localStorage.removeItem("apiKey");
    throw new Error(`API call resulted in ${res.status} status`);
  }
  const json = await res.json();

  if (json.error) {
    throw new Error("API error: " + json.error.message);
  }

  return json.requested_information;
}

async function getAPIKey() {
  const apiKeyFromStorage = localStorage.getItem("apiKey");
  if (apiKeyFromStorage) {
    return apiKeyFromStorage;
  }

  console.debug("[WK real numbers] API key not stored; fetching it.");
  const accountRes = await fetch("/settings/personal_access_tokens");
  if (!accountRes.ok) {
    throw new Error(`Fetching the personal access tokens page gave a ${accountRes.status} status`);
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
