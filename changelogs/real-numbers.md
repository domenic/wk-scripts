# WaniKani Real Numbers Changelog

## 1.0.1

* Fixed an error in the initial API key acquisition flow that would result in 404s.

## 1.0.0

Based on [WaniKani Real Numbers](https://greasyfork.org/en/scripts/11244-wanikani-real-numbers) by [Mempo](https://greasyfork.org/en/users/13665-mempo), which itself apparently has a longer lineage.

* Modernized the codebase.
* Removed over-complicated caching system, in favor of re-fetching each page load.
* Made the process for getting an API key more automatic, with no dialog boxes.
