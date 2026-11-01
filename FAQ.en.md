# DP Daoji Table FAQ

> Table version **V0.3** (data snapshot 2026-05-29).

## In one sentence

This is an Insane DP difficulty table inferred from LR2IR records, split into EASY and HARD. It is not an official table and not a personal ranking; use it to see the approximate difficulty range, not to settle comparisons between adjacent tiers.

V0.3 tiers are computed statistically, with no chart-by-chart manual adjustment; realms are anchored to the community rating where available and fall back to source-table levels otherwise. An individual chart may therefore still land in the wrong tier.

---

## I. Scope

### 1. What is in the table?

- Two tables: **EASY** (♂◇ Guyuan Daotu, EASY CLEAR pass line) and **HARD** (♂◆ Fengsha Jiantu, HARD CLEAR pass line).
- Each table has **{{CHART_TOTAL}} charts**, 7 realms × 7 tiers = **49 tiers**; each realm also has one pending tier, not counted in the 49.
- Both tables use the same {{CHART_TOTAL}} charts; because the pass lines differ, the same chart can sit in different tiers.
- Realms from low to high: Qi Refining, Foundation, Golden Core, Nascent Soul, Spirit Form, Void Refining, Mahayana.
- The final tier of each realm, "Pending" (EASY, code `EBn-?`) / "Obscure" (HARD, code `HBn-?`), is a **pending tier**, not "harder than tiers 1–7".

### 2. Which source tables and levels are covered?

V0.3 covers:

| Source table | Levels |
|---|---|
| δ Difficulty Table (δ難易度表) | δ11 |
| DPBMS and Shokan (DPBMSと諸感) | ☆11弱, ☆11中, ☆11強, ☆12 |
| DP Satellite | DPsl1–DPsl8 |
| Insane DP Difficulty Table (発狂DP難易度表) | ★1–★7 |
| DP Insane Yaminabe (発狂14keyBMS闇鍋難易度表) | ★1–★7 |

The table is positioned around **IIDX DP 8th dan to just below IIDX DP Kaiden**. Charts above that range have fewer plays and cannot be estimated reliably, so they are not included for now. An ascension table may follow later.

Composition of the {{CHART_TOTAL}} charts:

- **`{{GRM_DIRECT}}`** estimated directly by the five-level GRM;
- **`{{SATELLITE_FILL}}`** DP Satellite charts that failed the new GRM inclusion filters (low sample, or extreme pass rate / poor fit), filled by a linear mapping from the previous 1PL model;
- **`{{EXTERNAL_PREDICTED}}`** charts with only mocha star/review data, outside the LR2IR target set, filled by external regression.

Not every chart in those source tables is included. Charts with too few plays, extreme pass rates, or poor fit are excluded rather than forced into the table.

## II. Data

### 3. Where does the score data come from?

- **[Full public LR2IR archive v3](https://cdn.lr2ir.com/lr2ir-archive-v3.db.gz)**, snapshot **2026-05-29**.
- LR2IR closed on **2026-05-31**; new scores after that cannot enter this dataset.
- The compressed archive is about 3.27 GiB; the unpacked database is about 8.6 GB.
- Source repository: `zkldi/lr2ir-dataset` (Unlicense).

### 4. How is the data cleaned?

- Only **14-key (DP)** charts; `is_cheated` and `suspended` rows are removed.
- One best record per player × chart, so repeated plays are not counted as independent observations.
- Only **non-random charts**: 乱 (random) and SR are excluded; 正 (normal), 鏡 (mirror), and 換 (flip) are kept.
- Dan rank (`dan`) is not used in the model; it is only an external validity check.

### 5. How is difficulty estimated?

Difficulty is estimated with a **five-level graded response model (GRM: FAILED / EASY / NORMAL / HARD / FC)** fitted on the public LR2IR archive; the EASY table uses the FAILED→EASY threshold and the HARD table the NORMAL→HARD threshold. Realms follow the community rating where available and source-table levels otherwise; tiers within a realm are ordered by the estimated difficulty.

### 6. Is player data published?

No. The public fields are only `md5`, `sha256` (when available), title, tier, and `comment`; no player names, individual scores, `b` / `θ`, or sample sizes.

---

## III. Errors and how to use it

### 7. Why are there errors?

- **The DP BMS player pool is small.** Many charts have few plays, so difficulty estimates have large variance.
- With a small or unusual player pool, a chart can move between adjacent tiers or drift noticeably.
- Some charts only have random-mode scores, or have scores removed, leaving even fewer observations.
- Charts filled from external data did not enter the LR2IR model, so they are less reliable; predictions for unpopular charts can have larger errors.
- The model cannot fit every chart; a poorly fitting chart may simply be noise rather than a real "individual difference".

### 8. Can I still use it?

Yes, as a rough reference:

- Charts in the same realm and nearby tiers are usually close, and the overall trend across realms is reliable.
- **Do not treat adjacent tiers as an absolute conclusion.** The order within 1–2 tiers is easily affected by sample size and player pool; do not use it for skill certification, gatekeeping, or attacking others.
- Treat "Pending / Obscure" as "the data is not enough to place this chart stably in tiers 1–7", not as "the hardest".

### 9. What is "Pending / Obscure"?

"Pending / Obscure" is the final pending tier of each realm. It means the current data is not enough to place the chart stably in tiers 1–7; **it does not mean the chart is the hardest**. Low sample size, random-only scores, external filling, or an unusual player pool can all cause this uncertainty.

It is an uncertainty hint, but it is not a complete low-sample flag: some low-sample charts remain in tiers 1–7, and some pending-tier charts are not there because of low sample size. So even if a chart is in tiers 1–7, its tier is not guaranteed to be stable. This is the biggest limitation of the table.

### 10. Will the table be updated?

- The data snapshot is fixed at 2026-05-29; LR2IR is closed, so the same data source will not receive new scores.
- If the data source, model, or criteria change, a new version number will be released.

### 11. What do EB / HB mean?

- `EB` = EASY table, `HB` = HARD table.
- The first digit is the realm (1–7), the second is the tier (1–7); `?` means the pending tier ("Pending" for EASY / "Obscure" for HARD).
- Example: `EB4-?` = pending tier of realm IV (Nascent Soul) in the EASY table; `HB2-3` = tier 3 of realm II (Foundation) in the HARD table.

---

## IV. Site and import

### 12. How do I import it into beatoraja?

Add the raw `header.json` URLs in the difficulty table manager:

```
https://raw.githubusercontent.com/krrcream/dp-daoji/main/DP_dao_easy/header.json
https://raw.githubusercontent.com/krrcream/dp-daoji/main/DP_dao_hard/header.json
```

### Results are indicative only

### Results are indicative only

### Results are indicative only
