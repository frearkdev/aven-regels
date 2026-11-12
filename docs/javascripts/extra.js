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
