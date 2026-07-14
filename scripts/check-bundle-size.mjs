/**
 * Bundle Size Checker
 *
 * Scans all package dist directories, measures output file sizes,
 * compares them against thresholds and an optional baseline.
 *
 * Usage:
 *   node scripts/check-bundle-size.mjs              # Check against thresholds + baseline
 *   node scripts/check-bundle-size.mjs --update     # Update baseline with current sizes
 *   node scripts/check-bundle-size.mjs --report     # Output JSON report (for CI)
 *
 * Exit codes:
 *   0 — All files within thresholds
 *   1 — One or more files exceed thresholds
 */

import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, join, relative, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync, brotliCompressSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PACKAGES_DIR = resolve(ROOT, 'packages')
const BASELINE_PATH = resolve(__dirname, 'bundle-size-baseline.json')
const REPORT_OUTPUT_PATH = resolve(ROOT, 'reports', 'bundle-size-report.json')

// ─── Config ────────────────────────────────────────────────────────────

/**
 * Default size thresholds per file pattern (in bytes).
 * Files matching the pattern are checked against the corresponding limit.
 */
const THRESHOLDS = [
  { pattern: /\.umd\.js$/, limit: 800 * 1024, label: 'UMD bundle' },
  { pattern: /\.mjs$/, limit: 600 * 1024, label: 'ESM bundle' },
  { pattern: /\.cjs$/, limit: 600 * 1024, label: 'CJS bundle' },
  { pattern: /\.css$/, limit: 350 * 1024, label: 'CSS' },
]

/** Maximum allowed regression from baseline (in percent). */
const MAX_REGRESSION_PERCENT = 10

/** Files/patterns to exclude from size checking. */
const EXCLUDE_PATTERNS = [/\.map$/, /\.d\.ts$/, /\/types\//, /\/types\b/]

// ─── Helpers ───────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function shouldExclude(filePath) {
  const normalized = filePath.replace(/\\/g, '/')
  return EXCLUDE_PATTERNS.some((p) => p.test(normalized))
}

function getThreshold(filePath) {
  const normalized = filePath.replace(/\\/g, '/')
  return THRESHOLDS.find((t) => t.pattern.test(normalized))
}

function getPackages() {
  return readdirSync(PACKAGES_DIR)
    .filter((name) => {
      const pkgJsonPath = join(PACKAGES_DIR, name, 'package.json')
      return existsSync(pkgJsonPath)
    })
    .map((name) => ({
      name,
      distPath: join(PACKAGES_DIR, name, 'dist'),
    }))
    .filter((pkg) => existsSync(pkg.distPath))
}

function walkDir(dir, base = dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath, base))
    } else {
      results.push({
        path: fullPath,
        relativePath: relative(ROOT, fullPath),
        size: stat.size,
      })
    }
  }
  return results
}

function measureFile(filePath) {
  const content = readFileSync(filePath)
  const gzipSize = gzipSync(content).length

  let brotliSize = null
  try {
    brotliSize = brotliCompressSync(content).length
  } catch {
    // Brotli may not be available in all environments
  }

  return { gzipSize, brotliSize }
}

// ─── Color helpers (no deps) ───────────────────────────────────────────

const isTTY = process.stdout.isTTY
const c = {
  red: (s) => (isTTY ? `\x1b[31m${s}\x1b[0m` : s),
  green: (s) => (isTTY ? `\x1b[32m${s}\x1b[0m` : s),
  yellow: (s) => (isTTY ? `\x1b[33m${s}\x1b[0m` : s),
  cyan: (s) => (isTTY ? `\x1b[36m${s}\x1b[0m` : s),
  gray: (s) => (isTTY ? `\x1b[90m${s}\x1b[0m` : s),
  bold: (s) => (isTTY ? `\x1b[1m${s}\x1b[0m` : s),
}

// ─── Main Logic ────────────────────────────────────────────────────────

function collectSizes() {
  const packages = getPackages()
  const results = []

  for (const pkg of packages) {
    const files = walkDir(pkg.distPath)
    for (const file of files) {
      if (shouldExclude(file.relativePath)) continue

      const threshold = getThreshold(file.relativePath)
      const { gzipSize, brotliSize } = measureFile(file.path)

      results.push({
        package: pkg.name,
        file: basename(file.path),
        path: file.relativePath.replace(/\\/g, '/'),
        rawSize: file.size,
        gzipSize,
        brotliSize,
        threshold: threshold ? threshold.limit : null,
        thresholdLabel: threshold ? threshold.label : null,
      })
    }
  }

  return results
}

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'))
  } catch {
    return null
  }
}

function checkThresholds(results) {
  const violations = []

  for (const r of results) {
    if (r.threshold && r.rawSize > r.threshold) {
      violations.push({
        ...r,
        type: 'threshold',
        excess: r.rawSize - r.threshold,
        message: `${r.path} exceeds ${r.thresholdLabel} limit: ${formatBytes(r.rawSize)} > ${formatBytes(r.threshold)}`,
      })
    }
  }

  return violations
}

function checkBaseline(results, baseline) {
  if (!baseline || !baseline.files) return []

  const violations = []

  for (const r of results) {
    const baselineEntry = baseline.files[r.path]
    if (!baselineEntry) continue

    const baselineSize = baselineEntry.rawSize
    const delta = r.rawSize - baselineSize
    const deltaPercent = baselineSize > 0 ? (delta / baselineSize) * 100 : 0

    if (deltaPercent > MAX_REGRESSION_PERCENT && delta > 1024) {
      violations.push({
        ...r,
        type: 'regression',
        baselineSize,
        delta,
        deltaPercent,
        message: `${r.path} regressed ${deltaPercent.toFixed(1)}% from baseline: ${formatBytes(r.rawSize)} vs ${formatBytes(baselineSize)}`,
      })
    }
  }

  return violations
}

function updateBaseline(results) {
  const now = new Date().toISOString()
  const files = {}
  let totalRaw = 0
  let totalGzip = 0

  for (const r of results) {
    files[r.path] = {
      rawSize: r.rawSize,
      gzipSize: r.gzipSize,
      brotliSize: r.brotliSize,
    }
    totalRaw += r.rawSize
    totalGzip += r.gzipSize
  }

  const baseline = {
    updatedAt: now,
    summary: {
      totalFiles: results.length,
      totalRawSize: totalRaw,
      totalGzipSize: totalGzip,
    },
    files,
  }

  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + '\n', 'utf-8')
  console.log(c.green(`✓ Baseline updated at ${BASELINE_PATH}`))
  console.log(
    c.gray(
      `  ${results.length} files, total raw: ${formatBytes(totalRaw)}, gzip: ${formatBytes(totalGzip)}`
    )
  )
}

function printReport(results, thresholdViolations, baselineViolations, baseline) {
  // Group by package
  const byPackage = {}
  for (const r of results) {
    if (!byPackage[r.package]) byPackage[r.package] = []
    byPackage[r.package].push(r)
  }

  console.log(c.bold('\n📦 Bundle Size Report'))
  console.log(c.gray('━'.repeat(70)))

  for (const [pkgName, files] of Object.entries(byPackage).sort()) {
    console.log(c.cyan(`\n  ${pkgName}/`))
    const pkgRaw = files.reduce((s, f) => s + f.rawSize, 0)
    const pkgGzip = files.reduce((s, f) => s + f.gzipSize, 0)
    console.log(
      c.gray(`    (package total: ${formatBytes(pkgRaw)}, gzip: ${formatBytes(pkgGzip)})`)
    )

    for (const f of files) {
      const violation = thresholdViolations.find((v) => v.path === f.path)
      const regression = baselineViolations.find((v) => v.path === f.path)

      let status = c.green('✓')
      let deltaStr = ''

      if (violation) {
        status = c.red('✗')
      } else if (regression) {
        status = c.yellow('⚠')
      } else if (baseline?.files?.[f.path]) {
        const bSize = baseline.files[f.path].rawSize
        const d = f.rawSize - bSize
        if (d > 0) {
          deltaStr = c.gray(` (+${formatBytes(d)} from baseline)`)
        } else if (d < 0) {
          deltaStr = c.gray(` (${formatBytes(d)} from baseline)`)
        }
      }

      const limitStr = f.threshold ? c.gray(` / ${formatBytes(f.threshold)}`) : ''
      console.log(
        `    ${status} ${f.file.padEnd(20)} ${formatBytes(f.rawSize).padStart(12)}${limitStr}${deltaStr}`
      )
      console.log(
        c.gray(
          `      gzip: ${formatBytes(f.gzipSize).padStart(10)}${f.brotliSize ? `  brotli: ${formatBytes(f.brotliSize).padStart(10)}` : ''}`
        )
      )
    }
  }

  // Summary
  const totalRaw = results.reduce((s, r) => s + r.rawSize, 0)
  const totalGzip = results.reduce((s, r) => s + r.gzipSize, 0)
  console.log(c.gray('\n' + '━'.repeat(70)))
  console.log(
    c.bold(
      `  Total: ${formatBytes(totalRaw)} (gzip: ${formatBytes(totalGzip)}) across ${results.length} files`
    )
  )

  if (thresholdViolations.length > 0) {
    console.log(c.red(`\n  ✗ ${thresholdViolations.length} threshold violation(s):`))
    for (const v of thresholdViolations) {
      console.log(c.red(`    • ${v.message}`))
    }
  }

  if (baselineViolations.length > 0) {
    console.log(c.yellow(`\n  ⚠ ${baselineViolations.length} baseline regression(s):`))
    for (const v of baselineViolations) {
      console.log(c.yellow(`    • ${v.message}`))
    }
  }

  if (thresholdViolations.length === 0 && baselineViolations.length === 0) {
    console.log(c.green('\n  ✓ All files within thresholds and baseline limits'))
  }

  console.log()
}

function saveJsonReport(results, thresholdViolations, baselineViolations, baseline) {
  mkdirSync(dirname(REPORT_OUTPUT_PATH), { recursive: true })

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      totalRawSize: results.reduce((s, r) => s + r.rawSize, 0),
      totalGzipSize: results.reduce((s, r) => s + r.gzipSize, 0),
      thresholdViolations: thresholdViolations.length,
      baselineRegressions: baselineViolations.length,
      hasBaseline: !!baseline,
    },
    thresholds: THRESHOLDS.map((t) => ({
      pattern: t.pattern.source,
      limit: t.limit,
      label: t.label,
    })),
    maxRegressionPercent: MAX_REGRESSION_PERCENT,
    files: results.map((r) => {
      const regression = baselineViolations.find((v) => v.path === r.path)
      const violation = thresholdViolations.find((v) => v.path === r.path)
      return {
        ...r,
        status: violation ? 'violation' : regression ? 'regression' : 'ok',
      }
    }),
  }

  writeFileSync(REPORT_OUTPUT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  console.log(c.gray(`\n📄 JSON report saved to ${relative(ROOT, REPORT_OUTPUT_PATH)}`))
}

// ─── Entry Point ───────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2)
  const isUpdate = args.includes('--update')
  const isReport = args.includes('--report')

  // Collect sizes
  const results = collectSizes()

  if (results.length === 0) {
    console.error(c.red('✗ No dist files found. Run "pnpm build" first.'))
    process.exit(1)
  }

  // Update baseline mode
  if (isUpdate) {
    updateBaseline(results)
    process.exit(0)
  }

  // Check thresholds
  const thresholdViolations = checkThresholds(results)

  // Check baseline regressions
  const baseline = loadBaseline()
  const baselineViolations = checkBaseline(results, baseline)

  // Print report
  printReport(results, thresholdViolations, baselineViolations, baseline)

  // Save JSON report for CI
  if (isReport) {
    saveJsonReport(results, thresholdViolations, baselineViolations, baseline)
  }

  // Exit with error if any violations
  if (thresholdViolations.length > 0 || baselineViolations.length > 0) {
    process.exit(1)
  }

  process.exit(0)
}

main()
