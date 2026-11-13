/* Edward J. Martimbor — shared behaviour. Works without JS: buy/sample
   buttons simply stay hidden and the menu stays open on small screens. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  var cfg = window.SITE_CONFIG || {};
  var root = doc.getAttribute("data-root") || "";

  // ---- Mobile menu ----
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function isUrl(v) { return typeof v === "string" && /^https:\/\//.test(v); }
  function reveal(el) {
    el.hidden = false;
    var group = el.closest("[data-reveal-group]");
    if (group) group.hidden = false;
  }

  // ---- Retailer buttons: <a data-book="slug" data-store="amazon" hidden> ----
  document.querySelectorAll("a[data-store]").forEach(function (a) {
    var book = (cfg.books || {})[a.dataset.book];
    var url = book && book.retailers && book.retailers[a.dataset.store];
    if (isUrl(url)) {
      a.href = url;
      a.rel = "noopener";
      reveal(a);
    }
  });

  // ---- Sample PDF links: <a data-sample="slug" hidden> ----
  document.querySelectorAll("a[data-sample]").forEach(function (a) {
    var book = (cfg.books || {})[a.dataset.sample];
    var path = book && book.samplePdf;
    if (typeof path === "string" && path.length) {
      a.href = isUrl(path) ? path : root + path.replace(/^\//, "");
      reveal(a);
      var pending = document.querySelector('[data-sample-pending="' + a.dataset.sample + '"]');
      if (pending) pending.hidden = true;
    }
  });

  // ---- Course enrollment ----
  var course = cfg.course || {};
  document.querySelectorAll("a[data-enroll]").forEach(function (a) {
    if (course.status === "open" && isUrl(course.enrollUrl)) {
      a.href = course.enrollUrl;
      reveal(a);
    }
  });

  // ---- Readers page: show enroll or "opens soon" ----
  var isOpen = course.status === "open" && isUrl(course.enrollUrl);
  document.querySelectorAll("[data-enroll-open]").forEach(function (el) { el.hidden = !isOpen; });
  document.querySelectorAll("[data-enroll-pending]").forEach(function (el) { el.hidden = isOpen; });

  // ---- Copy-to-clipboard: <button data-copy="element-id"> ----
  document.querySelectorAll("button[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = document.getElementById(btn.dataset.copy);
      var status = document.querySelector("[data-copy-status]");
      if (!src) return;
      var text = src.textContent.trim();
      function done(ok) {
        if (status) status.textContent = ok ? "Copied: " + text : "Select the code and copy it: " + text;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  });

  // ---- Footer year ----
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
