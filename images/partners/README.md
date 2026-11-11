# 合作方 logo 放置目录

真实 logo 图片放在本目录即可被作品集自动引用（组件按 `src/content.js` 的 `logo` 字段读取）。

## 一键下载（推荐）
我已整理好各合作方**官方站点/logo 来源清单**：见同目录 `LOGOS.md`，以及一键下载脚本
`download-partner-logos.mjs`。在本机（有外网、已装 Node.js 18+）运行：

```bash
node public/images/partners/download-partner-logos.mjs
```

脚本会自动抓取每家官网的 `apple-touch-icon` / `favicon`，存入本目录，
文件名与 `content.js` 的 `logo` 字段一致。刷新页面即生效。

## 手动放置
若某家脚本未能下载（清单中标注「手动」的，如南京市潮汕商会、朗诵家协会、
惠茹大剧场、金坛汉服协会、汕头荣成饼家），可自行把图片放进本目录，
并在 `src/content.js` 的 `partners.items` 里对应项加上：

```js
{ name: '南京市潮汕商会', category: '商会组织', logo: '/images/partners/南京市潮汕商会.png' },
```

## 说明
- 图片建议透明背景 PNG 或 SVG，横版/方形均可，组件会自动按比例缩放。
- logo 缺失或扩展名（.png/.ico）不符时，卡片会自动回退为「字标占位」，不会出现裂图。
- 部分官方标识（如工商联会徽）注明「不得作商业用途」，竞标展示前请确认授权，
  或保留风格化字标占位。
