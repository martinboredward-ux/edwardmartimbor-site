/* Steady Under Pressure — course engine prototype.
   Progress is stored only in this browser (localStorage). No account, no server.
   PROGRESS_KEY holds which chapters have a passing quiz score. */
(function () {
  "use strict";
  var PROGRESS_KEY = "sup_progress_v1";
  var ANSWERS_KEY = "sup_worksheet_answers_v1";

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function setPassed(chapterId, score, total) {
    var p = getProgress();
    p[chapterId] = { passed: true, score: score, total: total, at: Date.now() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }
  function isPassed(chapterId) {
    var p = getProgress();
    return !!(p[chapterId] && p[chapterId].passed);
  }

  function getAnswers() {
    try { return JSON.parse(localStorage.getItem(ANSWERS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveAnswer(key, value) {
    var a = getAnswers();
    a[key] = value;
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(a));
  }

  /* ---- Chapter nav: lock/unlock + checkmarks, based on data-requires ---- */
  function initNav() {
    document.querySelectorAll(".chapter-nav [data-chapter]").forEach(function (el) {
      var id = el.getAttribute("data-chapter");
      var requires = el.getAttribute("data-requires");
      if (isPassed(id)) el.classList.add("done");
      if (requires && !isPassed(requires)) {
        var span = document.createElement("span");
        span.className = "locked";
        span.textContent = el.textContent + " 🔒";
        el.replaceWith(span);
      }
    });
  }

  /* ---- Worksheet autosave: any textarea[data-ws] ---- */
  function initWorksheet() {
    document.querySelectorAll("textarea[data-ws]").forEach(function (ta) {
      var key = ta.getAttribute("data-ws");
      var saved = getAnswers()[key];
      if (saved) ta.value = saved;
      ta.addEventListener("input", function () { saveAnswer(key, ta.value); });
    });
  }

  /* ---- Quiz engine ---- */
  function initQuiz() {
    var box = document.querySelector(".quiz-box[data-chapter]");
    if (!box) return;
    var chapterId = box.getAttribute("data-chapter");
    var passMark = parseInt(box.getAttribute("data-pass-mark"), 10) || 75;
    var nextUrl = box.getAttribute("data-next");
    var form = box.querySelector("form");
    var result = box.querySelector(".quiz-result");

    if (isPassed(chapterId)) {
      var prev = getProgress()[chapterId];
      showResult(true, prev.score, prev.total, true);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var questions = form.querySelectorAll(".quiz-q");
      var correctCount = 0;
      questions.forEach(function (q) {
        q.classList.remove("correct", "incorrect");
        var isMulti = q.hasAttribute("data-multi");
        var allInputs = q.querySelectorAll("input");
        allInputs.forEach(function (i) { i.closest("label").classList.remove("is-correct", "is-wrong-selected"); });
        var correctInputs = q.querySelectorAll("input[data-correct='true']");
        correctInputs.forEach(function (i) { i.closest("label").classList.add("is-correct"); });

        var ok;
        if (isMulti) {
          var checked = Array.prototype.slice.call(q.querySelectorAll("input:checked"));
          var correctSet = Array.prototype.slice.call(correctInputs);
          ok = checked.length === correctSet.length && checked.every(function (c) { return c.getAttribute("data-correct") === "true"; });
          checked.forEach(function (c) { if (c.getAttribute("data-correct") !== "true") c.closest("label").classList.add("is-wrong-selected"); });
        } else {
          var chosen = q.querySelector("input[type=radio]:checked");
          var correctInput = correctInputs[0];
          ok = !!(chosen && correctInput && chosen === correctInput);
          if (chosen && !ok) chosen.closest("label").classList.add("is-wrong-selected");
        }
        if (ok) { correctCount++; q.classList.add("correct"); } else { q.classList.add("incorrect"); }
      });
      var total = questions.length;
      var pct = total ? Math.round((correctCount / total) * 100) : 0;
      var passed = pct >= passMark;
      if (passed) setPassed(chapterId, correctCount, total);
      showResult(passed, correctCount, total, false);
    });

    function showResult(passed, score, total, alreadyDone) {
      result.hidden = false;
      result.className = "quiz-result " + (passed ? "pass" : "fail");
      var pct = total ? Math.round((score / total) * 100) : 0;
      result.textContent = passed
        ? "Passed — " + score + "/" + total + " (" + pct + "%)." + (alreadyDone ? " Already recorded in this browser." : " Next chapter unlocked.")
        : "Not yet — " + score + "/" + total + " (" + pct + "%). Needs " + passMark + "%. Review the lesson above and try again.";
      var nextBtn = document.querySelector(".next-chapter [data-next-link]");
      var lockedNote = document.querySelector(".next-chapter .locked-note");
      if (passed && nextBtn) {
        nextBtn.removeAttribute("aria-disabled");
        nextBtn.classList.remove("ghost-disabled");
        nextBtn.href = nextUrl || nextBtn.href;
        if (lockedNote) lockedNote.hidden = true;
        nextBtn.hidden = false;
      }
    }
  }

  function initResetLink() {
    var btn = document.querySelector("[data-reset-progress]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (confirm("Clear your saved quiz scores and worksheet answers on this device?")) {
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(ANSWERS_KEY);
        location.reload();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initWorksheet();
    initQuiz();
    initResetLink();
  });
})();
