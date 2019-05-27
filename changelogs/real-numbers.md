# WaniKani Real Numbers Changelog

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
