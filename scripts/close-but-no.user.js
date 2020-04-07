// ==UserScript==
// @name        WaniKani Close But No
// @namespace   https://github.com/domenic/wk-scripts
// @version     1.0.1
// @author      Domenic Denicola
// @description Prevents WaniKani from accepting close answers, instead re-prompting you to try again until you get it exactly
// @license     MIT
// @homepageURL https://github.com/domenic/wk-scripts/blob/master/changelogs/close-but-no.md
// @downloadURL https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/close-but-no.user.js
// @updateURL   https://raw.githubusercontent.com/domenic/wk-scripts/master/scripts/close-but-no.user.js
// @supportURL  https://github.com/domenic/wk-scripts/issues
// @match       https://www.wanikani.com/review/session
// @match       https://www.wanikani.com/lesson/session
// @run-at      document-end
// @noframes
// ==/UserScript==
"use strict";

const MESSAGE = "Close, but not quite!";

const oldEvaluate = answerChecker.evaluate;
answerChecker.evaluate = function (type, ...otherArgs) {
  const result = oldEvaluate.call(this, type, ...otherArgs);

  if (type === "meaning" && result.passed && !result.accurate) {
    result.exception = true;
    changeExceptionMessageTextWhenItAppears();
  }

  return result;
};

function changeExceptionMessageTextWhenItAppears() {
  const mo = new MutationObserver(handleMutations);
  mo.observe(document.querySelector("#answer-form").firstElementChild, { childList: true });
}

function handleMutations(mutations, mo) {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (addedNode.id === "answer-exception") {
        addedNode.querySelector("span").textContent = MESSAGE;

        removeAllMessagesExcept(addedNode);

        mo.disconnect();
        return;
      }
    }
  }
}

function removeAllMessagesExcept(node) {
  for (const answerException of document.querySelectorAll("#answer-exception")) {
    if (answerException !== node) {
      answerException.remove();
    }
  }
}
