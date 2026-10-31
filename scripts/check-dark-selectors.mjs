#!/usr/bin/env node
/**
 * Lint script: verify that the `.dark` class is the sole dark mode selector
 * convention across the entire codebase.
 *
 * Scans all .vue, .ts, .css, and .scss files under packages/ (excluding
 * node_modules, dist, __tests__, and this script itself) for any dark mode
 * selector that is NOT the standard `.dark` class.
 *
 * Allowed patterns:
 *   - `.dark .component { ... }`       (parent .dark class targeting child)
 *   - `.dark.component { ... }`        (.dark combined with component class)
 *   - `@custom-variant dark (...)`     (Tailwind v4 dark variant in styles.css)
 *   - `isDark`, `toggleDark`, etc.     (TS/JS identifiers)
 *   - `applyDarkMode(...)`             (runtime API function calls)
 *   - `--color-zc-*-dark`             (CSS variable names with "dark" suffix)
 *   - `.zc-*-dark`                     (component-level dark effect classes like .zc-tag--dark)
 *   - `DARK_MODE_ATTR`                 (constant in index.ts)
 *   - `is-dark`                        (BEM modifier class for component dark effect)
 *
 * Disallowed patterns (will cause lint failure):
 *   - `html[data-theme='dark']`
 *   - `[data-theme='dark']`
 *   - `[data-mode='dark']`
 *   - `:where(.dark, [data-theme='dark'])`
 *   - `:global([data-theme='dark'])`
 *   - `html.zc-dark`
 *   - `.zc-dark` (as a dark mode selector, not a component class)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const packagesDir = join(root, 'packages')

const extensions = ['.vue', '.ts', '.css', '.scss']

// Patterns that are NOT allowed — these indicate a non-.dark selector convention
const violations = [
  {
    pattern: /data-theme\s*=\s*['"]dark['"]/g,
    message: "Use .dark class instead of data-theme='dark' attribute selector",
  },
  {
    pattern: /\[data-theme\s*=\s*['"]dark['"]\]/g,
    message: "Use .dark class instead of [data-theme='dark'] selector",
  },
  {
    pattern: /\[data-mode\s*=\s*['"]dark['"]\]/g,
    message: "Use .dark class instead of [data-mode='dark'] selector",
  },
  {
    pattern: /:where\([^)]*dark[^)]*\)/g,
    message: 'Use .dark class directly instead of :where() dark selectors',
  },
  {
    pattern: /:global\([^)]*dark[^)]*\)/g,
    message: 'Use .dark class directly instead of :global() dark selectors',
  },
  {
    pattern: /html\.zc-dark/g,
    message: 'Use .dark class instead of html.zc-dark',
  },
]

// Directories to skip
const skipDirs = new Set(['node_modules', 'dist', '__tests__', '.git'])

function scanFile(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf('.'))
  if (!extensions.includes(ext)) return []

  let content
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch {
    return []
  }

  // Known-allowed patterns that should not trigger violations
  // Tailwind v4 @custom-variant dark declaration in styles.css
  const allowedPatterns = [/@custom-variant\s+dark\s*\([^)]*\)/g]

  // Strip allowed patterns from content before checking
  let checkContent = content
  for (const allowed of allowedPatterns) {
    checkContent = checkContent.replace(allowed, '/* allowed */')
  }

  const issues = []
  for (const { pattern, message } of violations) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(checkContent)) !== null) {
      const line = content.slice(0, match.index).split('\n').length
      issues.push({
        file: relative(root, filePath),
        line,
        match: match[0],
        message,
      })
    }
  }
  return issues
}

function scanDirectory(dir) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }

  for (const entry of entries) {
    // Skip excluded directories
    if (skipDirs.has(entry)) continue

    // Skip this lint script itself
    if (entry === 'check-dark-selectors.mjs') continue

    const fullPath = join(dir, entry)
    let stat
    try {
      stat = statSync(fullPath)
    } catch {
      continue
    }

    if (stat.isDirectory()) {
      results.push(...scanDirectory(fullPath))
    } else {
      results.push(...scanFile(fullPath))
    }
  }
  return results
}

console.log('🔍 Scanning for non-.dark dark mode selectors...\n')

const allIssues = scanDirectory(packagesDir)

if (allIssues.length === 0) {
  console.log('✅ All dark mode selectors use the unified .dark class convention.')
  process.exit(0)
} else {
  console.log(`❌ Found ${allIssues.length} violation(s):\n`)
  for (const { file, line, match, message } of allIssues) {
    console.log(`  ${file}:${line}`)
    console.log(`    Found: "${match}"`)
    console.log(`    ${message}\n`)
  }
  process.exit(1)
}
