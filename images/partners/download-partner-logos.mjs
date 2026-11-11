// ============================================================
//  合作方 logo 一键下载脚本
//  运行环境：本机（有外网）且已安装 Node.js 18+
//  用法（在项目根目录执行）：
//      node public/images/partners/download-partner-logos.mjs
//  说明：
//   · 逐个访问各合作方官网的 apple-touch-icon / favicon，下载为本地图片
//   · 保存到本目录（public/images/partners/），文件名与 src/content.js 中的 logo 字段一致
//   · 已存在的文件会跳过；下载失败的项会列出，可手动补（见 LOGOS.md）
//   · 若某站只提供 .ico，脚本会存成 .ico；组件已做 .png/.ico 自动兼容，无需改代码
// ============================================================
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = __dirname

// file 与 content.js 的 logo 字段保持一致；urls 按优先级尝试
const targets = [
  { file: 'yunting.png',     urls: ['https://www.radio.cn/apple-touch-icon.png', 'https://www.radio.cn/favicon.ico'] },
  { file: 'cnr.png',         urls: ['https://www.cnr.cn/apple-touch-icon.png', 'https://www.cnr.cn/favicon.ico'] },
  { file: 'strtv.png',       urls: ['https://www.strtv.cn/apple-touch-icon.png', 'https://www.strtv.cn/favicon.ico'] },
  { file: 'jiupai.png',      urls: ['https://www.jiupainews.com/apple-touch-icon.png', 'https://www.jiupainews.com/favicon.ico'] },
  { file: 'hhu.png',         urls: ['https://www.hhu.edu.cn/apple-touch-icon.png', 'https://www.hhu.edu.cn/favicon.ico'] },
  { file: 'dabaoensi.png',   urls: ['https://www.dabaoensi.com/apple-touch-icon.png', 'https://www.dabaoensi.com/favicon.ico'] },
  { file: 'hesheng.png',     urls: ['http://dsh.st-hsbh.cn/apple-touch-icon.png', 'http://dsh.st-hsbh.cn/favicon.ico'] },
  { file: 'gdstlib.png',     urls: ['https://www.gdstlib.cn/apple-touch-icon.png', 'https://www.gdstlib.cn/favicon.ico'] },
  { file: 'njgsl.png',       urls: ['https://cc.nanjing.gov.cn/apple-touch-icon.png', 'https://cc.nanjing.gov.cn/favicon.ico'] },
  { file: 'cuchuashao.png',  urls: ['https://www.cuchuashao.com/apple-touch-icon.png', 'https://www.cuchuashao.com/favicon.ico'] },
]

async function exists(p) {
  try { await access(p); return true } catch { return false }
}

async function fetchFirst(urls) {
  for (const u of urls) {
    try {
      const r = await fetch(u, { redirect: 'follow' })
      if (!r.ok) continue
      const ct = r.headers.get('content-type') || ''
      if (!ct.includes('image')) continue
      const buf = Buffer.from(await r.arrayBuffer())
      if (buf.length < 200) continue
      const isIco = ct.includes('icon') || buf.subarray(0, 4).toString('hex') === '00000100'
      return { buf, isIco }
    } catch {
      // 尝试下一个地址
    }
  }
  return null
}

await mkdir(OUT, { recursive: true })
let ok = 0
const failed = []
for (const t of targets) {
  const dest = join(OUT, t.file)
  if (await exists(dest)) {
    console.log('· 跳过(已存在):', t.file)
    continue
  }
  const res = await fetchFirst(t.urls)
  if (!res) {
    console.log('✗ 失败(无可下载 logo):', t.file)
    failed.push(t.file)
    continue
  }
  let finalFile = t.file
  if (res.isIco && t.file.endsWith('.png')) finalFile = t.file.replace(/\.png$/, '.ico')
  await writeFile(join(OUT, finalFile), res.buf)
  console.log('✓ 已下载:', finalFile, `(${res.buf.length} bytes${res.isIco ? ' · 实际为 .ico' : ''})`)
  ok++
}
console.log(`\n完成：成功 ${ok}，失败 ${failed.length}`)
if (failed.length) console.log('需手动处理:', failed.join(', '))
console.log('提示：下载后刷新页面即可看到真实 logo；失败项会显示字标占位，不影响排版。')
