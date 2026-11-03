(async function () {
  var script = document.currentScript;
  var base = (script && script.src ? script.src : location.href).replace(/assets\/site-data\.js.*$/, "");

  var versionNodes = document.querySelectorAll("[data-version]");
  var statNodes = document.querySelectorAll("[data-stat]");
  var sourceNodes = document.querySelectorAll("[data-sources]");

  var meta = null;
  try {
    meta = await fetch(base + "data/site.json", { cache: "no-cache" }).then(function (r) { return r.json(); });
    if (meta.version) versionNodes.forEach(function (el) { el.textContent = meta.version; });
    if (meta.build) document.querySelectorAll("[data-build]").forEach(function (el) { el.textContent = meta.build; });
  } catch (err) { console.warn("[site-data] site.json", err); }

  if (!statNodes.length && !sourceNodes.length) return;

  try {
    var doc = await fetch(base + "data/band_stats.json", { cache: "no-cache" }).then(function (r) { return r.json(); });
    var T = doc.tables || {};
    var fmt = function (n) { return Number(n).toLocaleString("en-US"); };

    statNodes.forEach(function (el) {
      var parts = el.dataset.stat.split(":");
      var kind = parts[0], table = parts[1], band = parts[2];
      var t = T[table];
      if (!t) return;
      var v = null;
      if (kind === "total") v = t.charts;
      else if (kind === "levels") v = t.levels;
      else if (kind === "bands") v = Array.isArray(t.bands) ? t.bands.length : null;
      else if (kind === "band") {
        var b = (t.bands || []).filter(function (x) { return String(x.band) === band; })[0];
        if (b) v = b.charts;
      }
      if (v != null) el.textContent = fmt(v);
    });

    if (sourceNodes.length && meta && meta.sources) {
      var present = {};
      Object.keys(T).forEach(function (k) {
        ((T[k] || {}).bands || []).forEach(function (b) {
          Object.keys(b.sources || {}).forEach(function (c) { if (b.sources[c] > 0) present[c] = 1; });
        });
      });
      var names = [];
      meta.sources.forEach(function (s) {
        if (!present[s.key]) return;
        if (names.indexOf(s.name) === -1) names.push(s.name);
      });
      sourceNodes.forEach(function (el) {
        var sep = el.getAttribute("data-sources") || "、";
        el.textContent = names.join(sep);
      });
    }
  } catch (err) { console.warn("[site-data] band_stats.json", err); }
})();
