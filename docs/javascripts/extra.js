// Klik op een artikelnummer (of de #) kopieert de directe link naar dat artikel.
document.addEventListener("click", function (event) {
  var link = event.target.closest("a.headerlink");
  if (!link || !navigator.clipboard) return;
  navigator.clipboard.writeText(link.href).then(function () {
    var original = link.title;
    link.title = "Link gekopieerd!";
    link.classList.add("copied");
    setTimeout(function () { link.title = original; link.classList.remove("copied"); }, 1500);
  }).catch(function () {});
});

// Live zoeken in de APV; "/" zet de cursor in het zoekveld.
(function () {
  function init() {
    var input = document.getElementById("aven-filter");
    if (!input || input.dataset.ready) return;
    input.dataset.ready = "1";
    var rows = Array.prototype.slice.call(document.querySelectorAll(".regel"));
    var chapters = Array.prototype.slice.call(document.querySelectorAll(".hoofdstuk"));
    var count = document.getElementById("aven-count");
    var empty = document.getElementById("aven-empty");
    var texts = rows.map(function (row) { return row.textContent.toLowerCase(); });
    function run() {
      var query = input.value.trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (row, i) {
        var match = !query || texts[i].indexOf(query) !== -1;
        row.hidden = !match;
        if (match) shown++;
      });
      chapters.forEach(function (chapter) {
        chapter.hidden = !!query && !chapter.querySelector(".regel:not([hidden])");
      });
      count.textContent = query ? shown + " van " + rows.length + " regels" : rows.length + " regels";
      empty.hidden = !query || shown > 0;
    }
    input.addEventListener("input", run);
    document.addEventListener("keydown", function (event) {
      var tag = (event.target.tagName || "").toLowerCase();
      if (event.key === "/" && tag !== "input" && tag !== "textarea") { event.preventDefault(); input.focus(); }
      if (event.key === "Escape" && document.activeElement === input) { input.value = ""; run(); input.blur(); }
    });
    run();
  }
  if (window.document$) { window.document$.subscribe(init); } else { document.addEventListener("DOMContentLoaded", init); }
})();

// Zijbalk: markeert het hoofdstuk dat nu in beeld is. Een klik op een hoofdstuk markeert dat hoofdstuk meteen,
// ook als het onderaan de pagina staat en niet helemaal bovenaan past.
(function () {
  var links = [];
  var heads = [];
  var forced = null;
  var THRESHOLD = 140;

  function current() {
    var index = 0;
    heads.forEach(function (head, i) {
      if (head && head.offsetParent !== null && head.getBoundingClientRect().top <= THRESHOLD) index = i;
    });
    return index;
  }

  function paint(index) {
    links.forEach(function (link, i) {
      var on = i === index;
      link.classList.toggle("is-current", on);
      if (on) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
    });
    var active = links[index];
    var wrap = document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap");
    if (active && wrap) {
      var box = active.getBoundingClientRect();
      var area = wrap.getBoundingClientRect();
      if (box.top < area.top + 80 || box.bottom > area.bottom - 20) wrap.scrollTop += box.top - area.top - area.height / 3;
    }
  }

  function update() { paint(forced !== null ? forced : current()); }

  function init() {
    links = Array.prototype.slice.call(document.querySelectorAll('.md-nav--secondary a.md-nav__link[href^="#hoofdstuk-"]'));
    heads = links.map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); });
    if (!links.length || document.body.dataset.spy) return;
    document.body.dataset.spy = "1";
    links.forEach(function (link, i) {
      link.addEventListener("click", function () { forced = i; paint(i); });
    });
    ["wheel", "touchmove", "keydown"].forEach(function (name) {
      window.addEventListener(name, function () { forced = null; }, { passive: true });
    });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", function () {
      var i = heads.findIndex(function (head) { return head && "#" + head.id === location.hash; });
      if (i >= 0) forced = i;
      update();
    });
    update();
  }

  if (window.document$) { window.document$.subscribe(init); } else { document.addEventListener("DOMContentLoaded", init); }
})();
