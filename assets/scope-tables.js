(async function () {
  var script = document.currentScript;
  var base = (script && script.src ? script.src : location.href).replace(/assets\/scope-tables\.js.*$/, "");
  var bandHost = document.getElementById("scope-band-table");
  var levelHost = document.getElementById("scope-level-table");
  if (!bandHost || !levelHost) return;

  var CATS = ["☆", "δ", "発狂★", "暗鍋★", "暗鍋★★", "dpsl", "dpst"];
  var LEVELS = [
    ["☆", ["11弱", "11中", "11強", "12"]],
    ["δ", ["11"]],
    ["発狂★", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "？"]],
    ["暗鍋★", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?", "無理"]],
    ["暗鍋★★", ["★1", "★2", "★3", "★4", "★5", "★6", "★7", "★8", "★9", "★10", "★11", "★12", "★13", "★14", "★15", "★16", "★17"]],
    ["dpsl", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]],
    ["dpst", ["0", "1", "2", "3", "4", "5", "6"]]
  ];

  function collect(bs, ls, scale) {
    var keys = scale === "easy" ? ["lower_easy", "upper_easy"] : ["lower_hard", "upper_hard"];
    var out = { realm: {}, src: {}, cell: {} };
    keys.forEach(function (k) {
      var t = (bs.tables || {})[k];
      if (t) {
        (t.bands || []).forEach(function (b) {
          out.realm[b.band] = b.realm;
          var o = out.src[b.band] || (out.src[b.band] = {});
          CATS.forEach(function (c) { o[c] = (o[c] || 0) + ((b.sources || {})[c] || 0); });
        });
      }
      var u = (ls.tables || {})[k];
      if (u) {
        (u.bands || []).forEach(function (b) {
          (b.cells || []).forEach(function (c) {
            var key = c.source + "\u0000" + c.level;
            (out.cell[key] || (out.cell[key] = {}))[b.band] = c.charts;
          });
        });
      }
    });
    return out;
  }

  function dc(e, h) {
    return '<td class="dc' + (e || h ? "" : " empty") + '">' +
      (e ? '<span class="e">' + e + '</span>' : '') +
      (h ? '<span class="h">' + h + '</span>' : '') +
      '</td>';
  }

  function bandList(easy, hard) {
    var set = {};
    Object.keys(easy.realm).forEach(function (k) { set[k] = 1; });
    Object.keys(hard.realm).forEach(function (k) { set[k] = 1; });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  function buildBand(easy, hard) {
    var bands = bandList(easy, hard);
    var bandH = bandHost.getAttribute("data-h") || "大境";
    var html = '<table class="xt bt"><colgroup><col style="width:88px">';
    for (var i = 0; i < CATS.length; i++) html += '<col style="width:78px">';
    html += '</colgroup><thead><tr><th class="rh">' + bandH + '</th>';
    CATS.forEach(function (c) { html += "<th>" + c + "</th>"; });
    html += "</tr></thead><tbody>";
    bands.forEach(function (b) {
      html += '<tr' + (b === 8 ? ' class="upper"' : '') + '><th class="rh">' +
        (easy.realm[b] || hard.realm[b] || "") + "<em>E" + b + "</em></th>";
      CATS.forEach(function (c) {
        html += dc((easy.src[b] || {})[c] || 0, (hard.src[b] || {})[c] || 0);
      });
      html += "</tr>";
    });
    return html + "</tbody></table>";
  }

  function buildLevel(easy, hard) {
    var bands = bandList(easy, hard);
    var h1 = levelHost.getAttribute("data-h1") || "来源";
    var h2 = levelHost.getAttribute("data-h2") || "等级";
    var html = '<table class="xt lv"><colgroup><col style="width:58px"><col style="width:54px">';
    for (var i = 0; i < bands.length; i++) html += '<col style="width:52px">';
    html += '</colgroup><thead><tr><th class="rh">' + h1 + '</th><th class="rh">' + h2 + '</th>';
    bands.forEach(function (b) { html += "<th>E" + b + "</th>"; });
    html += "</tr></thead><tbody>";
    LEVELS.forEach(function (pair) {
      pair[1].forEach(function (lv) {
        html += '<tr><td class="src">' + pair[0] + '</td><td class="lv">' + lv + "</td>";
        var key = pair[0] + "\u0000" + lv;
        bands.forEach(function (b) {
          html += dc((easy.cell[key] || {})[b] || 0, (hard.cell[key] || {})[b] || 0);
        });
        html += "</tr>";
      });
    });
    return html + "</tbody></table>";
  }

  try {
    var res = await Promise.all([
      fetch(base + "data/band_stats.json", { cache: "no-cache" }).then(function (r) { return r.json(); }),
      fetch(base + "data/level_stats.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
    ]);
    var easy = collect(res[0], res[1], "easy");
    var hard = collect(res[0], res[1], "hard");
    bandHost.innerHTML = buildBand(easy, hard);
    levelHost.innerHTML = buildLevel(easy, hard);
  } catch (err) {
    console.warn("[scope-tables]", err);
  }
})();
