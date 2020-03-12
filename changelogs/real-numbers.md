# WaniKani Real Numbers Changelog

## 2.0.3

* Fixed to work with the new WaniKani redesign, instead of always logging "Not on a page that displays lesson/review numbers." (Again.)

## 2.0.2

* Fixed the API key retrieval code, now that WaniKani moved the API key to a separate page from the main account page.

## 2.0.1

* Fixed to ensure that the updated review/lesson counts get styled correctly, with different styles for zero vs. nonzero.

## 2.0.0

* Fixed to work with the new WaniKani redesign, instead of always logging "Not on a page that displays lesson/review numbers."
* The new WaniKani redesign has gotten rid of the "42+" marker, so the original purpose of this script is obsolete, and that code was deleted. However, the always-up-to-date feature introduced in v1.2.0 remains useful. A more accurate name for the script would be something like "WaniKani Updated Numbers", but that could break auto-updates, so the name stays as-is for now.

## 1.2.0

* Ensured that the real numbers are always up to date, by refreshing them on the hour and whenever you switch back to the tab.

## 1.1.1

* Refactored API code into a separate helper script which is shared with other scripts.

## 1.1.0

* Revamped the method of retrieving the API key to not involve user-visible redirects.

## 1.0.2

* When an invalid (e.g. old) API key was stored, WaniKani Real Numbers now clears the API key so that future reloads get a new one.

## 1.0.1

* Fixed an error in the initial API key acquisition flow that would result in 404s.

## 1.0.0

Based on [WaniKani Real Numbers](https://greasyfork.org/en/scripts/11244-wanikani-real-numbers) by [Mempo](https://greasyfork.org/en/users/13665-mempo), which itself apparently has a longer lineage.

* Modernized the codebase.
* Removed over-complicated caching system, in favor of re-fetching each page load.
* Made the process for getting an API key more automatic, with no dialog boxes.
