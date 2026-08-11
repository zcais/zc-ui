<script setup lang="ts">
import { computed, ref, useSlots, h } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcCodeBlock' })

export type CodeBlockTheme = 'light' | 'dark'

const props = withDefaults(
  defineProps<{
    /** Source code text */
    code?: string
    /** Programming language */
    language?: string
    /** Theme */
    theme?: CodeBlockTheme
    /** Show line numbers */
    showLineNumbers?: boolean
    /** Show copy button */
    showCopy?: boolean
    /** Show language label */
    showLanguage?: boolean
    /** Show header bar */
    showHeader?: boolean
    /** Starting line number */
    startLineNumber?: number
    /** Max height with scroll */
    maxHeight?: string
    /** Font size */
    fontSize?: number
    /** Copy button text */
    copyText?: string
    /** Copied feedback text */
    copiedText?: string
  }>(),
  {
    code: '',
    language: 'text',
    theme: 'light',
    showLineNumbers: false,
    showCopy: true,
    showLanguage: true,
    showHeader: true,
    startLineNumber: 1,
    maxHeight: '',
    fontSize: 13,
    copyText: '复制',
    copiedText: '已复制',
  }
)

const emit = defineEmits<{
  (e: 'copy', code: string): void
}>()

const ns = useNamespace('code-block')
const slots = useSlots()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

/** Get the actual code content */
const codeContent = computed(() => {
  if (slots.default) {
    // Extract text from default slot
    const vnodes = slots.default()
    if (vnodes.length > 0) {
      const text = vnodes[0]?.children
      if (typeof text === 'string') return text
    }
  }
  return props.code
})

/** Token types for syntax highlighting */
type TokenType =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'function'
  | 'operator'
  | 'tag'
  | 'attr'
  | 'punctuation'
  | 'plain'

interface Token {
  type: TokenType
  value: string
}

/** Language-specific keyword sets */
const KEYWORDS: Record<string, Set<string>> = {
  javascript: new Set([
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'new',
    'delete',
    'typeof',
    'instanceof',
    'void',
    'this',
    'class',
    'extends',
    'super',
    'import',
    'export',
    'from',
    'default',
    'async',
    'await',
    'try',
    'catch',
    'finally',
    'throw',
    'yield',
    'in',
    'of',
    'null',
    'undefined',
    'true',
    'false',
  ]),
  typescript: new Set([
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'new',
    'delete',
    'typeof',
    'instanceof',
    'void',
    'this',
    'class',
    'extends',
    'super',
    'import',
    'export',
    'from',
    'default',
    'async',
    'await',
    'try',
    'catch',
    'finally',
    'throw',
    'yield',
    'in',
    'of',
    'null',
    'undefined',
    'true',
    'false',
    'type',
    'interface',
    'enum',
    'namespace',
    'public',
    'private',
    'protected',
    'readonly',
    'static',
    'abstract',
    'implements',
    'declare',
    'as',
    'is',
    'keyof',
    'infer',
    'never',
    'unknown',
    'any',
    'string',
    'number',
    'boolean',
    'object',
    'symbol',
    'bigint',
  ]),
  bash: new Set([
    'if',
    'then',
    'else',
    'elif',
    'fi',
    'for',
    'while',
    'do',
    'done',
    'case',
    'esac',
    'function',
    'return',
    'echo',
    'export',
    'local',
    'readonly',
    'source',
    'alias',
    'unalias',
    'cd',
    'ls',
    'mkdir',
    'rm',
    'cp',
    'mv',
    'cat',
    'grep',
    'sed',
    'awk',
    'npm',
    'pnpm',
    'yarn',
    'node',
    'git',
  ]),
}

const ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
}

/** Resolve language to canonical name */
function resolveLang(lang: string): string {
  const lower = lang.toLowerCase()
  return ALIASES[lower] || lower
}

/** Simple tokenizer for common languages */
function tokenize(code: string, language: string): Token[] {
  const lang = resolveLang(language)
  const keywords = KEYWORDS[lang]
  const tokens: Token[] = []

  // For unknown languages, return plain
  if (!keywords && lang !== 'json' && lang !== 'html' && lang !== 'css' && lang !== 'xml') {
    return [{ type: 'plain', value: code }]
  }

  // Combined regex for tokens
  // Order matters: comments, strings, numbers, keywords, functions
  const patterns: Array<{ type: TokenType; regex: RegExp }> = [
    { type: 'comment', regex: lang === 'bash' ? /^#[^\n]*/ : /^\/\/[^\n]*|^\/\*[\s\S]*?\*\// },
    { type: 'comment', regex: /^#[^\n]*/ },
    { type: 'string', regex: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'|^`(?:[^`\\]|\\.)*`/ },
    { type: 'number', regex: /^0x[0-9a-fA-F]+|^\b\d+\.?\d*([eE][+-]?\d+)?/ },
    {
      type: 'keyword',
      regex: keywords
        ? new RegExp(
            `^(?:${[...keywords].map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`
          )
        : /^$/,
    },
    { type: 'function', regex: /^[a-zA-Z_$][\w$]*(?=\s*\()/ },
    { type: 'operator', regex: /^[+\-*/%=<>!&|^~?:]+/ },
    { type: 'punctuation', regex: /^[{}()\[\];,.]/ },
    { type: 'plain', regex: /^\s+/ },
    { type: 'plain', regex: /^[a-zA-Z_$][\w$]*/ },
    { type: 'plain', regex: /^[^\s]/ },
  ]

  let remaining = code
  while (remaining.length > 0) {
    let matched = false
    for (const { type, regex } of patterns) {
      const match = remaining.match(regex)
      if (match && match[0]) {
        tokens.push({ type, value: match[0] })
        remaining = remaining.slice(match[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push({ type: 'plain', value: remaining[0] })
      remaining = remaining.slice(1)
    }
  }

  return tokens
}

/** Render highlighted code as VNodes */
function renderHighlightedCode() {
  const code = codeContent.value
  if (!code) return []

  const lang = resolveLang(props.language)

  // JSON special handling
  if (lang === 'json') {
    return tokenizeJSON(code)
  }

  // HTML/XML special handling
  if (lang === 'html' || lang === 'xml') {
    return tokenizeHTML(code)
  }

  // CSS special handling
  if (lang === 'css') {
    return tokenizeCSS(code)
  }

  const tokens = tokenize(code, props.language)
  return tokens.map((token, i) =>
    token.type === 'plain'
      ? token.value
      : h('span', { class: `tok-${token.type}`, key: i }, token.value)
  )
}

function tokenizeJSON(code: string) {
  const tokens = tokenize(code, 'typescript')
  return tokens.map((token, i) =>
    token.type === 'plain'
      ? token.value
      : h('span', { class: `tok-${token.type}`, key: i }, token.value)
  )
}

function tokenizeHTML(code: string) {
  const tokens: Token[] = []
  const tagRegex = /(<\/?[\w-]+)|([\w-]+)(?==)|("[^"]*"|'[^']*')|(\/?>)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tagRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', value: code.slice(lastIndex, match.index) })
    }
    if (match[1]) tokens.push({ type: 'tag', value: match[1] })
    else if (match[2]) tokens.push({ type: 'attr', value: match[2] })
    else if (match[3]) tokens.push({ type: 'string', value: match[3] })
    else if (match[4]) tokens.push({ type: 'tag', value: match[4] })
    lastIndex = tagRegex.lastIndex
  }
  if (lastIndex < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastIndex) })
  }

  return tokens.map((token, i) =>
    token.type === 'plain'
      ? token.value
      : h('span', { class: `tok-${token.type}`, key: i }, token.value)
  )
}

function tokenizeCSS(code: string) {
  const tokens: Token[] = []
  const patterns: Array<{ type: TokenType; regex: RegExp }> = [
    { type: 'comment', regex: /^\/\*[\s\S]*?\*\// },
    { type: 'string', regex: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/ },
    { type: 'number', regex: /^[-+]?\d*\.?\d+(px|em|rem|%|vh|vw|s|ms|deg|fr)?/ },
    { type: 'attr', regex: /^[@#][\w-]+/ },
    { type: 'function', regex: /^[\w-]+(?=\s*\()/ },
    { type: 'tag', regex: /^[\w-]+(?=\s*:)/ },
    // CSS selectors: .class, #id, :pseudo, ::pseudo-element
    { type: 'keyword', regex: /^[.#:][\w-]+|::[\w-]+/ },
    { type: 'operator', regex: /^[{};:()]/ },
    { type: 'plain', regex: /^\s+/ },
    { type: 'plain', regex: /^[a-zA-Z_-][\w-]*/ },
    { type: 'plain', regex: /^[^\s]/ },
  ]

  let remaining = code
  while (remaining.length > 0) {
    let matched = false
    for (const { type, regex } of patterns) {
      const m = remaining.match(regex)
      if (m && m[0]) {
        tokens.push({ type, value: m[0] })
        remaining = remaining.slice(m[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push({ type: 'plain', value: remaining[0] })
      remaining = remaining.slice(1)
    }
  }

  return tokens.map((token, i) =>
    token.type === 'plain'
      ? token.value
      : h('span', { class: `tok-${token.type}`, key: i }, token.value)
  )
}

/** Lines for line numbering */
const lines = computed(() => codeContent.value.split('\n'))

const headerClasses = computed(() => [ns.e('header')])
const codeContainerClasses = computed(() => [ns.e('code'), ns.is('dark', props.theme === 'dark')])

const codeContainerStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  ...(props.maxHeight ? { maxHeight: props.maxHeight, overflow: 'auto' } : {}),
}))

const languageLabel = computed(() => {
  const lang = props.language.toLowerCase()
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    bash: 'Bash',
    shell: 'Shell',
    python: 'Python',
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    sql: 'SQL',
    yaml: 'YAML',
    xml: 'XML',
  }
  return labels[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
})

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(codeContent.value)
    copied.value = true
    emit('copy', codeContent.value)
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = codeContent.value
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      copied.value = true
      if (copyTimer) clearTimeout(copyTimer)
      copyTimer = setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      // ignore
    }
    document.body.removeChild(textarea)
  }
}

const highlightedContent = computed(() => renderHighlightedCode())
</script>

<template>
  <div :class="[ns.b(), ns.m(theme)]">
    <!-- Header bar -->
    <div v-if="showHeader" :class="headerClasses">
      <div :class="ns.e('dots')" aria-hidden="true">
        <span :class="[ns.e('dot'), ns.e('dot--red')]"></span>
        <span :class="[ns.e('dot'), ns.e('dot--yellow')]"></span>
        <span :class="[ns.e('dot'), ns.e('dot--green')]"></span>
      </div>
      <span v-if="showLanguage" :class="ns.e('language')">{{ languageLabel }}</span>
      <div :class="ns.e('actions')">
        <slot name="actions" />
        <button
          v-if="showCopy"
          :class="[ns.e('copy-btn'), ns.is('copied', copied)]"
          type="button"
          @click="handleCopy"
        >
          <svg
            v-if="!copied"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ copied ? copiedText : copyText }}
        </button>
      </div>
    </div>

    <!-- Code content -->
    <div :class="codeContainerClasses" :style="codeContainerStyle">
      <!-- Line numbers column -->
      <div v-if="showLineNumbers" :class="ns.e('line-numbers')" aria-hidden="true">
        <span v-for="(_, i) in lines" :key="i" :class="ns.e('line-number')">
          {{ startLineNumber + i }}
        </span>
      </div>

      <!-- Code -->
      <pre
        :class="ns.e('pre')"
      ><code :class="ns.e('inline-code')"><component :is="() => highlightedContent" /></code></pre>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCodeBlock styles
 * ============================================================ */

.zc-code-block {
  --zc-cb-bg: var(--color-zc-bg-base, #f6f8fa);
  --zc-cb-header-bg: var(--color-zc-fill-light, #f0f2f5);
  --zc-cb-text: var(--color-zc-text-primary, #24292e);
  --zc-cb-border: var(--color-zc-border-light, #e1e4e8);
  --zc-cb-header-text: var(--color-zc-text-secondary, #586069);
  width: 100%;
  border: 1px solid var(--zc-cb-border);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--zc-cb-bg);
}

/* ---- Dark theme ---- */
.zc-code-block--dark {
  --zc-cb-bg: #1e1e1e;
  --zc-cb-header-bg: #2d2d2d;
  --zc-cb-text: #d4d4d4;
  --zc-cb-border: #3c3c3c;
  --zc-cb-header-text: #999;
}

/* ---- Header ---- */
.zc-code-block__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: var(--zc-cb-header-bg);
  border-bottom: 1px solid var(--zc-cb-border);
}

.zc-code-block__dots {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.zc-code-block__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.zc-code-block__dot--red {
  background-color: #ff5f56;
}

.zc-code-block__dot--yellow {
  background-color: #ffbd2e;
}

.zc-code-block__dot--green {
  background-color: #27c93f;
}

.zc-code-block__language {
  font-size: 12px;
  font-weight: 500;
  color: var(--zc-cb-header-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.zc-code-block__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.zc-code-block__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--zc-cb-header-text);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s;
}

.zc-code-block__copy-btn:hover {
  background-color: rgba(128, 128, 128, 0.15);
  color: var(--zc-cb-text);
}

.zc-code-block__copy-btn.is-copied {
  color: #27c93f;
}

.zc-code-block__copy-btn.is-copied:hover {
  color: #27c93f;
}

/* ---- Code container ---- */
.zc-code-block__code {
  display: flex;
  padding: 12px 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  line-height: 1.6;
  tab-size: 2;
}

/* ---- Line numbers ---- */
.zc-code-block__line-numbers {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  text-align: right;
  user-select: none;
  border-right: 1px solid var(--zc-cb-border);
  flex-shrink: 0;
}

.zc-code-block__line-number {
  color: var(--zc-cb-header-text);
  font-size: inherit;
  line-height: 1.6;
}

/* ---- Pre/code ---- */
.zc-code-block__pre {
  margin: 0;
  padding: 0 16px;
  flex: 1;
  overflow-x: auto;
}

.zc-code-block__inline-code {
  color: var(--zc-cb-text);
  white-space: pre;
}

/* ---- Syntax highlight tokens ---- */
:deep(.tok-keyword) {
  color: #d73a49;
  font-weight: 500;
}

:deep(.tok-string) {
  color: #032f62;
}

:deep(.tok-comment) {
  color: #6a737d;
  font-style: italic;
}

:deep(.tok-number) {
  color: #005cc5;
}

:deep(.tok-function) {
  color: #6f42c1;
}

:deep(.tok-operator) {
  color: #d73a49;
}

:deep(.tok-tag) {
  color: #22863a;
}

:deep(.tok-attr) {
  color: #6f42c1;
}

:deep(.tok-punctuation) {
  color: var(--zc-cb-text);
}

/* ---- Dark theme token colors ---- */
.zc-code-block--dark :deep(.tok-keyword) {
  color: #569cd6;
}

.zc-code-block--dark :deep(.tok-string) {
  color: #ce9178;
}

.zc-code-block--dark :deep(.tok-comment) {
  color: #6a9955;
}

.zc-code-block--dark :deep(.tok-number) {
  color: #b5cea8;
}

.zc-code-block--dark :deep(.tok-function) {
  color: #dcdcaa;
}

.zc-code-block--dark :deep(.tok-operator) {
  color: #d4d4d4;
}

.zc-code-block--dark :deep(.tok-tag) {
  color: #569cd6;
}

.zc-code-block--dark :deep(.tok-attr) {
  color: #9cdcfe;
}

/* ---- Custom scrollbar ---- */
.zc-code-block__code::-webkit-scrollbar,
.zc-code-block__pre::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.zc-code-block__code::-webkit-scrollbar-track,
.zc-code-block__pre::-webkit-scrollbar-track {
  background: transparent;
}

.zc-code-block__code::-webkit-scrollbar-thumb,
.zc-code-block__pre::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.3);
  border-radius: 3px;
}

.zc-code-block__code::-webkit-scrollbar-thumb:hover,
.zc-code-block__pre::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

/* ---- Dark mode (global) ---- */
.dark .zc-code-block:not(.zc-code-block--dark) {
  --zc-cb-bg: #1e1e1e;
  --zc-cb-header-bg: #2d2d2d;
  --zc-cb-text: #d4d4d4;
  --zc-cb-border: #3c3c3c;
  --zc-cb-header-text: #999;
}

/* ---- Dark mode (global) token colors ---- */
.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-keyword) {
  color: #569cd6;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-string) {
  color: #ce9178;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-comment) {
  color: #6a9955;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-number) {
  color: #b5cea8;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-function) {
  color: #dcdcaa;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-operator) {
  color: #d4d4d4;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-tag) {
  color: #569cd6;
}

.dark .zc-code-block:not(.zc-code-block--dark) :deep(.tok-attr) {
  color: #9cdcfe;
}
</style>
