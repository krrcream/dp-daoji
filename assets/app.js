(() => {
  "use strict";

  const LANG = document.body.dataset.lang === "zh" ? "zh" : "en";
  const DATA_ROOT = document.body.dataset.root || ".";

  const MAJORS = [
    {
      id: 1,
      name: { en: "Qi Refining", zh: "錬気" },
      numeral: { en: "I", zh: "一" },
      desc: { en: "First Steps", zh: "初窥门径" }
    },
    {
      id: 2,
      name: { en: "Foundation", zh: "築基" },
      numeral: { en: "II", zh: "二" },
      desc: { en: "Foundations Laid", zh: "根基初成" }
    },
    {
      id: 3,
      name: { en: "Golden Core", zh: "結丹" },
      numeral: { en: "III", zh: "三" },
      desc: { en: "Core Formed", zh: "凝练中坚" }
    },
    {
      id: 4,
      name: { en: "Nascent Soul", zh: "元嬰" },
      numeral: { en: "IV", zh: "四" },
      desc: { en: "Inner Sanctum", zh: "登堂入室" }
    },
    {
      id: 5,
      name: { en: "Spirit Form", zh: "化神" },
      numeral: { en: "V", zh: "五" },
      desc: { en: "High Realm", zh: "高阶之境" }
    },
    {
      id: 6,
      name: { en: "Void Refining", zh: "錬虚" },
      numeral: { en: "VI", zh: "六" },
      desc: { en: "Trial of Extremes", zh: "极境试炼" }
    },
    {
      id: 7,
      name: { en: "Mahayana", zh: "大乗" },
      numeral: { en: "VII", zh: "七" },
      desc: { en: "Summit", zh: "登顶之阶" }
    }
  ];

  const MAJOR_BY_ID = new Map(MAJORS.map(major => [major.id, major]));

  const TABLES = {
    easy: {
      folder: "DP_dao_easy",
      name: { en: "Guyuan Daotu", zh: "固元道途" },
      full: {
        en: "DP♂◇ Daoji Table — Guyuan Daotu (EASY CLEAR)",
        zh: "DP♂◇道階表 固元道途 (EASY CLEAR)"
      },
      mode: "EASY CLEAR",
      symbol: "♂◇"
    },
    hard: {
      folder: "DP_dao_hard",
      name: { en: "Fengsha Jiantu", zh: "鋒殺剣途" },
      full: {
        en: "DP♂◆ Daoji Table — Fengsha Jiantu (HARD CLEAR)",
        zh: "DP♂◆道階表 鋒殺剣途 (HARD CLEAR)"
      },
      mode: "HARD CLEAR",
      symbol: "♂◆"
    }
  };

  const SUB_JP = {
    easy: ["微", "浅", "承", "盈", "鋭", "極", "満"],
    hard: ["蔵", "馳", "突", "撃", "摧", "断", "滅"]
  };

  const SUB_EN = {
    easy: ["Faint", "Shallow", "Sustain", "Full", "Sharp", "Extreme", "Perfect"],
    hard: ["Conceal", "Gallop", "Charge", "Strike", "Crush", "Sever", "Annihilate"]
  };

  const BUCKET_JP = { easy: "疑", hard: "晦" };
  const BUCKET_EN = { easy: "Pending", hard: "Obscure" };

  const TEXT = {
    en: {
      tableTitle: name => `${name} · DP Daoji Table`,
      copied: label => `Copied ${label}`.trim(),
      errorTitle: "Failed to load chart data.",
      errorBefore: "Please make sure ",
      errorAfter: " exists, the site is served over HTTP, and the repository is public.",
      errorDetail: "Technical details: ",
      homeFileHint: "This page was opened as a local file, so the browser blocks data loading. Serve it over HTTP or use GitHub Pages.",
      homeHttpHint: "Some table data failed to load. Make sure DP_dao_easy / DP_dao_hard exist and the repository is public.",
      bucketTitle: "Pending tier: low-confidence charts with sparse data or an unusual player pool."
    },
    zh: {
      tableTitle: name => `${name} · DP 道阶表`,
      copied: label => `已复制 ${label}`.trim(),
      errorTitle: "谱面数据载入失败。",
      errorBefore: "请确认 ",
      errorAfter: " 存在，并且通过本地服务器或 GitHub Pages 访问；仓库还需要设为 Public。",
      errorDetail: "技术信息：",
      homeFileHint: "当前是直接以文件方式打开的页面，浏览器会拦截数据读取。请通过本地服务器或 GitHub Pages 访问。",
      homeHttpHint: "部分表数据载入失败，请确认 DP_dao_easy / DP_dao_hard 目录与 JSON 文件已上传，且仓库为 Public。",
      bucketTitle: "待考阶：样本不足或玩家池异常，低可信归入"
    }
  };

  const T = TEXT[LANG];

  const LEVEL_RE = /^\s*(.*?)\s*[（(]\s*([EH])B([1-7])-([1-7?])\s*[)）]\s*$/;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const formatter = new Intl.NumberFormat(LANG === "zh" ? "zh-CN" : "en-US");

  function formatNumber(value) {
    return formatter.format(Number(value) || 0);
  }

  function subLabel(kind, sub) {
    if (sub === "?") return LANG === "zh" ? BUCKET_JP[kind] : BUCKET_EN[kind];
    const index = Number(sub) - 1;
    return LANG === "zh" ? SUB_JP[kind][index] : SUB_EN[kind][index];
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function norm(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  function parseLevel(level) {
    const match = LEVEL_RE.exec(level || "");
    if (!match) return null;
    const kind = match[2] === "H" ? "hard" : "easy";
    const majorId = Number(match[3]);
    const major = MAJOR_BY_ID.get(majorId);
    return {
      level,
      kind,
      major: majorId,
      majorName: major ? major.name[LANG] : "",
      sub: match[4],
      code: `${match[2]}B${majorId}-${match[4]}`,
      bucket: match[4] === "?"
    };
  }

  function shortHash(hash) {
    if (!hash) return "—";
    return hash.length > 14 ? `${hash.slice(0, 12)}…` : hash;
  }

  async function fetchJSON(url) {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`${url} returned HTTP ${response.status}`);
    }
    return response.json();
  }

  let toastTimer = 0;
  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("show"), 1600);
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-2000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      console.warn("execCommand copy failed", error);
    }
    area.remove();
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    fallbackCopy(text);
  }

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const text = button.getAttribute("data-copy");
    if (!text) return;
    try {
      await copyText(text);
      toast(T.copied(button.dataset.label || ""));
    } catch (error) {
      fallbackCopy(text);
      toast(T.copied(button.dataset.label || ""));
    }
  });

  /* ------------------------------------------------------------
     Table browser
     ------------------------------------------------------------ */

  async function initTablePage() {
    const params = new URLSearchParams(window.location.search);
    const tableKey = params.get("t") === "hard" ? "hard" : "easy";
    const meta = TABLES[tableKey];

    document.body.classList.add(`theme-${tableKey}`);
    document.title = T.tableTitle(meta.name[LANG]);

    $("#table-symbol").textContent = meta.symbol;
    $("#table-name").textContent = meta.name[LANG];
    $("#table-fullname").textContent = meta.full[LANG];

    $$("[data-nav]").forEach(link => {
      link.classList.toggle("active", link.dataset.nav === tableKey);
    });
    $("#switch-easy").classList.toggle("active", tableKey === "easy");
    $("#switch-hard").classList.toggle("active", tableKey === "hard");

    let header;
    let data;
    try {
      [header, data] = await Promise.all([
        fetchJSON(`${DATA_ROOT}/${meta.folder}/header.json`),
        fetchJSON(`${DATA_ROOT}/${meta.folder}/data.json`)
      ]);
    } catch (error) {
      showTableError(error, meta);
      return;
    }

    if (LANG === "zh" && header && header.name) {
      $("#table-fullname").textContent = header.name;
    }

    $("#stat-total").textContent = formatNumber(data.length);
    $("#stat-sha").textContent = formatNumber(data.filter(chart => chart.sha256).length);
    $("#stat-levels").textContent = formatNumber((header.level_order || []).length);
    $("#total-count").textContent = formatNumber(data.length);

    const levelMeta = new Map();
    (header.level_order || []).forEach((level, index) => {
      const parsed = parseLevel(level);
      if (parsed) {
        parsed.order = index;
        levelMeta.set(level, parsed);
      }
    });

    const byLevel = new Map();
    data.forEach(chart => {
      const level = chart.level;
      if (!levelMeta.has(level)) {
        const parsed = parseLevel(level);
        if (!parsed) return;
        parsed.order = 10000 + levelMeta.size;
        levelMeta.set(level, parsed);
      }
      if (!byLevel.has(level)) byLevel.set(level, []);
      byLevel.get(level).push(chart);
    });

    const collator = new Intl.Collator(["ja", "zh", "en"], {
      numeric: true,
      sensitivity: "base"
    });

    const groups = Array.from(levelMeta.entries())
      .map(([level, parsed]) => {
        const charts = (byLevel.get(level) || []).slice();
        charts.sort((a, b) => collator.compare(a.title || "", b.title || ""));
        return { level, meta: parsed, charts };
      })
      .filter(group => group.charts.length > 0)
      .sort((a, b) => a.meta.order - b.meta.order);

    const availableLevels = new Set(groups.map(group => group.level));

    renderBands(groups);
    renderLevelOptions(groups);
    bindFilters({ tableKey, levelMeta, availableLevels, params });

    const loading = $("#loading");
    if (loading) loading.hidden = true;
  }

  function renderBands(groups) {
    const root = $("#bands");
    root.innerHTML = "";
    const fragment = document.createDocumentFragment();

    MAJORS.forEach(major => {
      const majorGroups = groups.filter(group => group.meta.major === major.id);
      if (!majorGroups.length) return;

      const total = majorGroups.reduce((sum, group) => sum + group.charts.length, 0);
      const details = el("details", "band");
      details.open = true;
      details.dataset.major = String(major.id);

      const summary = el("summary");
      summary.append(
        el("span", "no", major.numeral[LANG]),
        el("span", "name", major.name[LANG]),
        el("span", "desc", major.desc[LANG]),
        el("span", "count", formatNumber(total)),
        el("span", "chev", "+")
      );

      const body = el("div", "band-body");

      majorGroups.forEach(group => {
        body.appendChild(renderLevelGroup(group));
      });

      details.append(summary, body);
      fragment.appendChild(details);
    });

    root.appendChild(fragment);
  }

  function renderLevelGroup(group) {
    const wrap = el("section", "level-group");
    wrap.dataset.level = group.level;

    const head = el("div", "level-head");
    const isBucket = group.meta.bucket;
    const subText = subLabel(group.meta.kind, group.meta.sub);
    const chipText = LANG === "zh" ? `${group.meta.majorName}${subText}` : subText;
    const chip = el("span", `level-chip${isBucket ? " bucket" : ""}`, chipText);
    if (isBucket) chip.title = T.bucketTitle;
    head.append(
      chip,
      el("span", "code", group.meta.code),
      el("span", "lv-count", `${formatNumber(group.charts.length)} ${LANG === "zh" ? "谱" : "charts"}`)
    );

    const list = el("ul", "chart-list");

    group.charts.forEach((chart, index) => {
      const row = el("li", "chart");
      row.dataset.search = norm(`${chart.title || ""} ${chart.md5 || ""} ${chart.sha256 || ""}`);

      const idx = el("span", "idx", String(index + 1).padStart(2, "0"));
      const title = el("span", "title", chart.title || (LANG === "zh" ? "(无标题)" : "(untitled)"));

      const hash = el("button", "hash", shortHash(chart.md5));
      hash.type = "button";
      hash.dataset.copy = chart.md5 || "";
      hash.dataset.label = "md5";
      if (chart.md5) {
        hash.title = LANG === "zh" ? `复制 md5：${chart.md5}` : `Copy md5: ${chart.md5}`;
      } else {
        hash.disabled = true;
        hash.title = LANG === "zh" ? "没有 md5" : "No md5";
      }

      let sha;
      if (chart.sha256) {
        sha = el("button", "sha", "SHA");
        sha.type = "button";
        sha.dataset.copy = chart.sha256;
        sha.dataset.label = "sha256";
        sha.title = LANG === "zh" ? `复制 sha256：${chart.sha256}` : `Copy sha256: ${chart.sha256}`;
      } else {
        sha = el("span", "sha none", "—");
        sha.title = LANG === "zh" ? "没有 sha256" : "No sha256";
      }

      row.append(idx, title, hash, sha);
      list.appendChild(row);
    });

    wrap.append(head, list);
    return wrap;
  }

  function renderLevelOptions(groups) {
    const select = $("#level");
    const fragment = document.createDocumentFragment();

    MAJORS.forEach(major => {
      const majorGroups = groups.filter(group => group.meta.major === major.id);
      if (!majorGroups.length) return;

      const optgroup = document.createElement("optgroup");
      optgroup.label = `${major.numeral[LANG]} · ${major.name[LANG]}`;
      majorGroups.forEach(group => {
        const option = document.createElement("option");
        option.value = group.level;
        option.textContent = LANG === "zh"
          ? group.level
          : `${subLabel(group.meta.kind, group.meta.sub)} (${group.meta.code})`;
        optgroup.appendChild(option);
      });
      fragment.appendChild(optgroup);
    });

    select.appendChild(fragment);
  }

  function syncLanguageLink(tableKey) {
    const link = $("[data-lang-link]");
    if (!link) return;
    const target = new URL(link.getAttribute("href"), window.location.href);
    const params = new URLSearchParams(window.location.search);
    params.set("t", tableKey);
    target.search = params.toString();
    link.href = target.pathname + target.search;
  }

  function bindFilters({ tableKey, levelMeta, availableLevels, params }) {
    const root = $("#bands");
    const search = $("#q");
    const bandSelect = $("#band");
    const levelSelect = $("#level");

    const state = { q: "", band: "", level: "" };
    let urlTimer = 0;

    function applyFilters() {
      const query = norm(state.q);
      let shown = 0;
      const filtering = Boolean(query || state.band || state.level);

      $$(".band", root).forEach(details => {
        let bandShown = 0;

        $$(".level-group", details).forEach(group => {
          const parsed = levelMeta.get(group.dataset.level);
          const matchLevel = (!state.level || group.dataset.level === state.level) &&
            (!state.band || (parsed && String(parsed.major) === state.band));
          let levelShown = 0;

          $$(".chart", group).forEach(row => {
            const visible = matchLevel && (!query || row.dataset.search.includes(query));
            row.hidden = !visible;
            if (visible) levelShown += 1;
          });

          group.hidden = levelShown === 0;
          const count = $(".lv-count", group);
          if (count) {
            count.textContent = `${formatNumber(levelShown)} ${LANG === "zh" ? "谱" : "charts"}`;
          }
          bandShown += levelShown;
        });

        details.hidden = bandShown === 0;
        if (filtering && bandShown > 0) details.open = true;

        const count = $(".count", details);
        if (count) count.textContent = formatNumber(bandShown);
        shown += bandShown;
      });

      $("#shown-count").textContent = formatNumber(shown);
      $("#empty").hidden = shown !== 0;
    }

    function syncURL() {
      const next = new URLSearchParams();
      next.set("t", tableKey);
      if (state.band) next.set("band", state.band);
      if (state.level) next.set("lv", state.level);
      if (state.q.trim()) next.set("q", state.q.trim());
      window.history.replaceState(null, "", `?${next.toString()}`);
      syncLanguageLink(tableKey);
    }

    function scheduleApply() {
      applyFilters();
      window.clearTimeout(urlTimer);
      urlTimer = window.setTimeout(syncURL, 180);
    }

    function resetFilters() {
      state.q = "";
      state.band = "";
      state.level = "";
      search.value = "";
      bandSelect.value = "";
      levelSelect.value = "";
      applyFilters();
      syncURL();
    }

    search.addEventListener("input", event => {
      state.q = event.target.value;
      scheduleApply();
    });

    bandSelect.addEventListener("change", event => {
      state.band = event.target.value;
      if (state.level) {
        const parsed = levelMeta.get(state.level);
        if (!parsed || String(parsed.major) !== state.band) {
          state.level = "";
          levelSelect.value = "";
        }
      }
      scheduleApply();
    });

    levelSelect.addEventListener("change", event => {
      state.level = event.target.value;
      if (state.level) {
        const parsed = levelMeta.get(state.level);
        if (parsed) {
          state.band = String(parsed.major);
          bandSelect.value = state.band;
        }
      }
      scheduleApply();
    });

    $("#reset").addEventListener("click", resetFilters);
    $("#empty-reset").addEventListener("click", resetFilters);

    document.addEventListener("keydown", event => {
      const tag = (event.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "select" || tag === "textarea";
      if (event.key === "/" && !typing) {
        event.preventDefault();
        search.focus();
      }
      if (event.key === "Escape" && event.target === search) {
        search.value = "";
        state.q = "";
        scheduleApply();
        search.blur();
      }
    });

    const query0 = params.get("q") || "";
    const level0 = params.get("lv") || "";
    const band0 = params.get("band") || "";

    state.q = query0;
    search.value = query0;

    if (level0 && availableLevels.has(level0)) {
      state.level = level0;
      state.band = String(levelMeta.get(level0).major);
    } else if (band0 && MAJOR_BY_ID.has(Number(band0))) {
      state.band = band0;
    }

    bandSelect.value = state.band;
    levelSelect.value = state.level;
    applyFilters();
    syncLanguageLink(tableKey);
  }

  function showTableError(error, meta) {
    const loading = $("#loading");
    if (loading) loading.hidden = true;

    const bands = $("#bands");
    if (bands) bands.hidden = true;

    const box = $("#error");
    if (!box) return;
    box.hidden = false;
    box.innerHTML = "";

    const title = el("p", null, T.errorTitle);
    const body = el("p");
    body.append(
      document.createTextNode(T.errorBefore),
      el("code", null, `${meta.folder}/data.json`),
      document.createTextNode(T.errorAfter)
    );
    const detail = el("p", null, `${T.errorDetail}${error && error.message ? error.message : error}`);
    box.append(title, body, detail);
    console.error(error);
  }

  /* ------------------------------------------------------------
     Home
     ------------------------------------------------------------ */

  async function initHomePage() {
    const results = await Promise.allSettled([
      loadHomeTable("easy"),
      loadHomeTable("hard")
    ]);

    const failed = results.filter(result => result.status === "rejected");
    if (!failed.length) return;

    const hint = $("#load-hint");
    if (!hint) return;
    hint.hidden = false;
    hint.textContent = window.location.protocol === "file:" ? T.homeFileHint : T.homeHttpHint;
    failed.forEach(result => console.error(result.reason));
  }

  async function loadHomeTable(key) {
    const meta = TABLES[key];
    const data = await fetchJSON(`${DATA_ROOT}/${meta.folder}/data.json`);

    $$(`[data-total="${key}"]`).forEach(node => {
      node.textContent = formatNumber(data.length);
    });

    const counts = new Map();
    data.forEach(chart => {
      const parsed = parseLevel(chart.level || "");
      if (!parsed) return;
      counts.set(parsed.major, (counts.get(parsed.major) || 0) + 1);
    });

    for (let id = 1; id <= 7; id += 1) {
      $$(`[data-band="${key}-${id}"]`).forEach(node => {
        node.textContent = formatNumber(counts.get(id) || 0);
      });
    }
  }

  /* ------------------------------------------------------------
     Start
     ------------------------------------------------------------ */

  const page = document.body.dataset.page;

  if (page === "table") {
    initTablePage().catch(error => {
      console.error(error);
      const loading = $("#loading");
      if (loading) loading.hidden = true;
      const box = $("#error");
      if (box) {
        box.hidden = false;
        box.textContent = `${T.errorTitle} ${error && error.message ? error.message : error}`;
      }
    });
  } else if (page === "home") {
    initHomePage().catch(error => console.error(error));
  }
})();
