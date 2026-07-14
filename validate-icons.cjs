// Validate generated index.ts against actual icon source files
const fs = require('node:fs')
const path = require('node:path')

const indexPath = path.join(__dirname, 'packages/icons/src/index.ts')
const iconsDir = path.join(__dirname, 'packages/icons/src/icons')

const indexContent = fs.readFileSync(indexPath, 'utf8')
const indexLines = indexContent
  .split(/\r?\n/)
  .filter((l) => /^export \{ (ZcIcon\w+) \} from '\.\/icons\/([\w-]+)'$/.test(l))

console.log(`Total exports in index.ts: ${indexLines.length}`)

const iconFiles = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.ts'))
console.log(`Total icon files: ${iconFiles.length}`)

let mismatches = 0
let missing = 0

for (const line of indexLines) {
  const m = line.match(/^export \{ (ZcIcon\w+) \} from '\.\/icons\/([\w-]+)'$/)
  if (!m) continue
  const [, exportName, fileBase] = m
  const iconPath = path.join(iconsDir, fileBase + '.ts')
  if (!fs.existsSync(iconPath)) {
    console.log(`MISSING file: ${fileBase}.ts`)
    missing++
    continue
  }
  const content = fs.readFileSync(iconPath, 'utf8')
  if (!content.includes(`export const ${exportName}`)) {
    console.log(`MISMATCH: index=${exportName}, file=${fileBase}.ts`)
    mismatches++
  }
}

console.log(`\nResult: ${mismatches} mismatches, ${missing} missing`)

// Also check for icon files NOT in index.ts
const indexedFiles = new Set(indexLines.map((l) => l.match(/'\.\/icons\/([\w-]+)'/)[1]))
let orphan = 0
for (const f of iconFiles) {
  const base = f.replace('.ts', '')
  if (!indexedFiles.has(base)) {
    console.log(`ORPHAN: ${f}`)
    orphan++
  }
}
console.log(`Orphans (files not in index): ${orphan}`)
