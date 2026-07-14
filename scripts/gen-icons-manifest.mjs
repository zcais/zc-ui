/* global console, process */
/**
 * gen-icons-manifest.mjs
 *
 * Scans packages/icons/src/icons/*.ts, extracts each icon's kebab name and
 * SVG body, classifies it into a semantic category, and emits a compact JSON
 * manifest consumed by the docs <IconGallery /> component.
 *
 * Usage:  node scripts/gen-icons-manifest.mjs
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const ICONS_DIR = resolve(ROOT, 'packages/icons/src/icons')
const OUT_FILE = resolve(ROOT, 'docs/.vitepress/data/icons-manifest.json')

/* ---------------------------------------------------------------------------
 * Semantic category definitions.
 * First matching rule wins — order matters (more specific first).
 * `test` receives the kebab-case icon name.
 * ------------------------------------------------------------------------ */
const CATEGORIES = [
  { key: 'brand', label: '品牌', emoji: '🏷️', test: (n) => /^brand[-.]/.test(n) },
  {
    key: 'arrow',
    label: '箭头方向',
    emoji: '➡️',
    test: (n) => /(^|-)arrow|chevron|directions/.test(n),
  },
  {
    key: 'alert',
    label: '警示',
    emoji: '⚠️',
    test: (n) => /alert|exclamation|warning|forbid/.test(n),
  },
  {
    key: 'communication',
    label: '通信通知',
    emoji: '🔔',
    test: (n) =>
      /mail|message|notification|bell|inbox|broadcast|(^|-)send|at-|phone|mobile|signal/.test(n),
  },
  {
    key: 'media',
    label: '媒体',
    emoji: '🎬',
    test: (n) =>
      /music|video|movie|player|headphone|microphone|photo|image|picture|film|(^|-)play|disc|record/.test(
        n
      ),
  },
  {
    key: 'file',
    label: '文件',
    emoji: '📄',
    test: (n) => /(^|-)file|folder|document|notebook|(^|-)book|notes|clipboard|paper/.test(n),
  },
  {
    key: 'user',
    label: '用户',
    emoji: '👤',
    test: (n) => /user|users|profile|face|mood|accessible|access-point|gender|child|baby/.test(n),
  },
  {
    key: 'chart',
    label: '图表数据',
    emoji: '📊',
    test: (n) => /chart|graph|analytics|statistic|trending|report|dashboard|chart/.test(n),
  },
  {
    key: 'commerce',
    label: '电商金融',
    emoji: '💰',
    test: (n) =>
      /shopping|(^|-)cart|coin|cash|wallet|credit|currency|receipt|bag|building|store|shop|bank|tax|business/.test(
        n
      ),
  },
  {
    key: 'map',
    label: '地图位置',
    emoji: '📍',
    test: (n) =>
      /^map|location|(^|-)pin|gps|route|world|globe|flag|compass|navigation|current/.test(n),
  },
  {
    key: 'weather',
    label: '天气自然',
    emoji: '🌤️',
    test: (n) =>
      /sun|moon|cloud|rain|snow|storm|wind|weather|temperature|flame|umbrella|droplet|leaf|tree|plant/.test(
        n
      ),
  },
  {
    key: 'device',
    label: '设备',
    emoji: '💻',
    test: (n) =>
      /device|laptop|monitor|keyboard|mouse|printer|camera|tablet|cpu|server|router|(^|-)tv|topology|battery|wifi|bluetooth|plug|usb/.test(
        n
      ),
  },
  {
    key: 'time',
    label: '时间日期',
    emoji: '🕐',
    test: (n) =>
      /clock|hour|alarm|calendar|^time|(^|-)time|history|timer|stopwatch|date|event/.test(n),
  },
  {
    key: 'edit',
    label: '文本编辑',
    emoji: '✏️',
    test: (n) =>
      /edit|pencil|write|(^|-)pen|typography|align|^text|(^|-)text|format|color-swatch|brush|paint/.test(
        n
      ),
  },
  {
    key: 'build',
    label: '工具设置',
    emoji: '🔧',
    test: (n) =>
      /(^|-)tool|hammer|wrench|build|construction|settings|adjustment|bolt|puzzle|cog|filter|key/.test(
        n
      ),
  },
]

const DEFAULT_CATEGORY = 'common'

/** Rules for icon classification plus the default fallback. */
const ALL_RULES = [
  ...CATEGORIES,
  { key: DEFAULT_CATEGORY, label: '通用操作', emoji: '✦', test: () => true },
]

/** @param {string} name kebab-case icon name */
function classify(name) {
  for (const cat of ALL_RULES) {
    if (cat.test(name)) return cat.key
  }
  return DEFAULT_CATEGORY
}

/**
 * Extract { name, body } from a single icon module source.
 * Handles both single-quote and double-quote string literals.
 * @param {string} src
 * @returns {{name: string, body: string} | null}
 */
function extract(src) {
  // registerIcon('icon-name', { ... })
  const nameMatch = src.match(/registerIcon\(\s*['"]([^'"]+)['"]/)
  // const _body = '...SVG...'
  const bodyMatch = src.match(/const\s+_body\s*=\s*(['"])([\s\S]*?)\1\s*\n/)
  if (!nameMatch || !bodyMatch) return null
  return { name: nameMatch[1], body: bodyMatch[2] }
}

async function main() {
  if (!existsSync(ICONS_DIR)) {
    throw new Error(`Icons directory not found: ${ICONS_DIR}`)
  }

  const files = (await readdir(ICONS_DIR)).filter((f) => f.endsWith('.ts'))
  console.log(`Found ${files.length} icon files.`)

  /** @type {{name:string, category:string, body:string}[]} */
  const icons = []
  let skipped = 0

  for (const file of files) {
    const src = await readFile(resolve(ICONS_DIR, file), 'utf8')
    const data = extract(src)
    if (!data) {
      skipped++
      continue
    }
    icons.push({ name: data.name, category: classify(data.name), body: data.body })
  }

  // Stable order: by category (as defined), then by name
  const catOrder = new Map(ALL_RULES.map((c, i) => [c.key, i]))
  icons.sort((a, b) => {
    const co = catOrder.get(a.category) - catOrder.get(b.category)
    return co !== 0 ? co : a.name.localeCompare(b.name)
  })

  // Category metadata (in display order) + counts
  const counts = {}
  for (const i of icons) counts[i.category] = (counts[i.category] || 0) + 1
  const categories = ALL_RULES.map((c) => ({
    key: c.key,
    label: c.label,
    emoji: c.emoji,
    count: counts[c.key] || 0,
  }))

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: icons.length,
    categories,
    icons,
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(manifest, null, 0), 'utf8')

  console.log(`Extracted ${icons.length} icons (${skipped} skipped).`)
  console.log('Category breakdown:')
  for (const c of categories) {
    console.log(`  ${c.emoji}  ${c.label.padEnd(8)} ${String(c.count).padStart(5)}  (${c.key})`)
  }
  console.log(`\nWrote ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
