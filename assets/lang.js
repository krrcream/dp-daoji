(function () {
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".lang-menu"), function (menu) {
      var links = Array.prototype.slice.call(menu.querySelectorAll("a[href]"));
      if (!links.length) return;

      var current = menu.getAttribute("data-lang");
      if (menu.hasAttribute("data-keep-query")) {
        var q = location.search || "";
        if (q) {
          links.forEach(function (a) {
            var href = a.getAttribute("href");
            if (href.indexOf("?") === -1) a.setAttribute("href", href + q);
          });
        }
      }

      var cur = null;
      links.forEach(function (a) {
        if (a.getAttribute("hreflang") === current) {
          cur = a;
          a.classList.add("on");
        }
      });
      if (!cur) cur = links[0];

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-btn";
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = (cur.textContent || "").trim();

      var list = document.createElement("div");
      list.className = "lang-list";
      links.forEach(function (a) { list.appendChild(a); });

      menu.appendChild(btn);
      menu.appendChild(list);

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
