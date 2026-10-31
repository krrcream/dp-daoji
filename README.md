# DP 道阶表

基于 LR2IR 全量存档（2026-05-29 快照）的発狂 DP 难度推定表，共两套。根目录默认英文，`/zh/` 是中文版；标题下方有 English / 中文 切换。当前版本：**V0.1**。

| 表 | 符号 | 通过线 | 名称 |
|---|---|---|---|
| EASY | ♂✧ | EASY CLEAR | DP♂✧道阶表 固元道途 |
| HARD | ♂✦ | HARD CLEAR | DP♂✦道阶表 锋杀剑途 |

每套 2,070 张谱面，7 大境 × 7 小阶，每境末尾另设「疑 / 晦」待考阶，共 56 个等级。

## 目录

```
.
├── index.html              English home (default)
├── table.html              English table browser
├── zh/
│   ├── index.html          中文主页
│   └── table.html          中文表浏览页
├── assets/
│   ├── style.css
│   ├── app.js
│   └── favicon.svg
├── DP_dao_easy/
│   ├── header.json         beatoraja 表头
│   └── data.json           谱面数据
├── DP_dao_hard/
│   ├── header.json
│   └── data.json
├── .nojekyll
└── README.md
```

## 部署到 GitHub Pages

1. 仓库必须是 **Public**。免费账户的 GitHub Pages 不支持私有仓库，私有仓库的 raw 地址也无法被 beatoraja 读取。
2. 把本目录的全部内容上传到仓库根目录（`main` 分支）。
3. 仓库 `Settings → Pages`：
   - Source 选 **Deploy from a branch**
   - Branch 选 `main`，文件夹选 `/ (root)`
   - Save
4. 等 1–2 分钟，访问 `https://<用户名>.github.io/dp-daoji/`（英文）或 `https://<用户名>.github.io/dp-daoji/zh/`（中文）。

## beatoraja 导入

在难度表管理里新增 URL，粘贴：

```
https://raw.githubusercontent.com/krrcream/dp-daoji/main/DP_dao_easy/header.json
https://raw.githubusercontent.com/krrcream/dp-daoji/main/DP_dao_hard/header.json
```

`header.json` 里的 `data_url` 已指向同目录的 `data.json`。

更新表之后，先在 beatoraja 里删除旧表，再重新添加；否则可能继续使用缓存的失败地址。

## 本地预览

```bash
python -m http.server 8766 --directory .
```

然后打开 <http://127.0.0.1:8766/>。

直接双击 `index.html` 会因浏览器限制无法读取 JSON，页面会提示改用本地服务器或 Pages。

## 口径

- 数据：LR2IR 全量存档，2026-05-29 快照。
- 仅使用非随机谱面（排除 乱 / SR，保留 正 / 鏡 / 換）。
- 模型：五级 GRM（FAILED / EASY / NORMAL / HARD / FC），MCMC 估计。
- 公开字段只有 `md5`、`sha256`、`title`、`level`、`comment`；不包含玩家昵称、逐人成绩、b / θ / 样本量。
- 「疑 / 晦」是每境末尾的待考阶，不代表该谱一定比同境 1–7 阶更难。

非官方难度表，结果仅供参考。
