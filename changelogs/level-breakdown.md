# WaniKani Level Breakdown Changelog

## 1.0.1

* Made the script also run on `https://wanikani.com/`, not just `https://wanikani.com/dashboard`, since the pages are apparently the same.

## 1.0.0

Inspired by [WaniKani SRS Level Progress](https://greasyfork.org/en/scripts/32344-wanikani-srs-level-progress), which has stopped working recently due to its dependency on https://wanikanitools-golang.curiousattemptbunny.com/.

* Rewrote the code from scratch.
* Gets data directly from the WaniKani API, instead of a now-defunct third party site.
* Removed leech count displays and worst leeches list.
* Removed extra period at the end of the breakdown.
* Removed caching system; the data will always be fresh now.
