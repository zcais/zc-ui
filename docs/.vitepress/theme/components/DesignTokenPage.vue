<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
  colorScales,
  generateColorScale,
  adjustHsl,
  getReadableTextColor,
  setBrandColor,
  clearThemeOverrides,
  spacing as spacingData,
  fontSizes as fontSizesData,
  borderRadius as borderRadiusData,
  shadows as shadowsData,
  transitions as transitionsData,
  type ColorName,
} from '@zc-ui/theme'

// ============================================================
// Types
// ============================================================

interface ColorEntry {
  shade: number
  hex: string
  cssVar: string
  darkHex: string
  darkCssVar: string
}

interface TokenGroup {
  label: string
  tokens: { name: string; value: string; description: string }[]
}

// ============================================================
// Color Palette Data
// ============================================================

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/** Dark mode lightness targets (inverted ramp for dark backgrounds) */
const DARK_LIGHTNESS_RAMP: Record<number, number> = {
  50: 15,
  100: 20,
  200: 27,
  300: 35,
  400: 42,
  500: 50,
  600: 57,
  700: 66,
  800: 75,
  900: 85,
  950: 92,
}

/** Generate a dark-mode variant of a color at a given shade */
function generateDarkShade(hex: string, shade: number): string {
  try {
    return adjustHsl(hex, { l: DARK_LIGHTNESS_RAMP[shade] ?? 50 })
  } catch {
    return hex
  }
}

/** Toggle between light/dark palette display */
const showDarkPalette = ref(false)

const COLOR_NAMES: { key: ColorName; label: string; cn: string }[] = [
  { key: 'primary', label: 'Primary', cn: '主色' },
  { key: 'success', label: 'Success', cn: '成功' },
  { key: 'warning', label: 'Warning', cn: '警告' },
  { key: 'danger', label: 'Danger', cn: '危险' },
  { key: 'info', label: 'Info', cn: '信息' },
]

const colorPalettes = computed(() => {
  return COLOR_NAMES.map(({ key, label, cn }) => {
    const scale = colorScales[key]
    const entries: ColorEntry[] = SHADES.map((shade) => ({
      shade,
      hex: scale[shade],
      cssVar: `--color-zc-${key}-${shade}`,
      darkHex: generateDarkShade(scale[shade], shade),
      darkCssVar: `--color-zc-${key}-${shade}`,
    }))
    return { key, label, cn, entries }
  })
})

// ============================================================
// Token Showcase Data
// ============================================================

const spacingTokens: TokenGroup = {
  label: 'Spacing 间距',
  tokens: [
    { name: '--spacing-zc-xs', value: spacingData.xs, description: '超小间距' },
    { name: '--spacing-zc-sm', value: spacingData.sm, description: '小间距' },
    { name: '--spacing-zc-base', value: spacingData.base, description: '基础间距' },
    { name: '--spacing-zc-md', value: spacingData.md, description: '中间距' },
    { name: '--spacing-zc-lg', value: spacingData.lg, description: '大间距' },
    { name: '--spacing-zc-xl', value: spacingData.xl, description: '超大间距' },
  ],
}

const typographyTokens: TokenGroup = {
  label: 'Typography 字号',
  tokens: [
    { name: '--text-zc-xs', value: fontSizesData.xs, description: '辅助文字' },
    { name: '--text-zc-sm', value: fontSizesData.sm, description: '小号文字' },
    { name: '--text-zc-base', value: fontSizesData.base, description: '正文（默认）' },
    { name: '--text-zc-md', value: fontSizesData.md, description: '中号标题' },
    { name: '--text-zc-lg', value: fontSizesData.lg, description: '大号标题' },
    { name: '--text-zc-xl', value: fontSizesData.xl, description: '超大标题' },
  ],
}

const radiusTokens: TokenGroup = {
  label: 'Radius 圆角',
  tokens: [
    { name: '--radius-zc-sm', value: borderRadiusData.sm, description: '小圆角' },
    { name: '--radius-zc-base', value: borderRadiusData.base, description: '基础圆角' },
    { name: '--radius-zc-md', value: borderRadiusData.md, description: '中圆角' },
    { name: '--radius-zc-lg', value: borderRadiusData.lg, description: '大圆角' },
    { name: '--radius-zc-round', value: borderRadiusData.round, description: '圆角按钮' },
    { name: '--radius-zc-circle', value: borderRadiusData.circle, description: '圆形' },
  ],
}

const shadowTokens: TokenGroup = {
  label: 'Shadow 阴影',
  tokens: [
    { name: '--shadow-zc-sm', value: shadowsData.sm, description: '微小阴影' },
    { name: '--shadow-zc-base', value: shadowsData.base, description: '基础阴影' },
    { name: '--shadow-zc-md', value: shadowsData.md, description: '中等阴影' },
    { name: '--shadow-zc-lg', value: shadowsData.lg, description: '大阴影' },
    { name: '--shadow-zc-xl', value: shadowsData.xl, description: '超大阴影' },
    { name: '--shadow-zc-dark', value: shadowsData.dark, description: '深色阴影' },
  ],
}

const transitionTokens: TokenGroup = {
  label: 'Transition 过渡',
  tokens: [
    {
      name: '--transition-duration-zc-fast',
      value: transitionsData.duration.fast,
      description: '快速过渡',
    },
    {
      name: '--transition-duration-zc-base',
      value: transitionsData.duration.base,
      description: '基础过渡',
    },
    {
      name: '--transition-duration-zc-slow',
      value: transitionsData.duration.slow,
      description: '慢速过渡',
    },
    { name: '--ease-zc-in', value: transitionsData.timingFunction.easeIn, description: '缓入' },
    { name: '--ease-zc-out', value: transitionsData.timingFunction.easeOut, description: '缓出' },
    {
      name: '--ease-zc-in-out',
      value: transitionsData.timingFunction.easeInOut,
      description: '缓入缓出',
    },
  ],
}

const tokenGroups = [spacingTokens, typographyTokens, radiusTokens, shadowTokens, transitionTokens]

// ============================================================
// Theme Editor
// ============================================================

const editorColors = reactive({
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
})

const editorRadius = ref(4) // px
const hasAppliedGlobally = ref(false)

const editorGeneratedScales = computed(() => {
  const result: Record<string, Record<number, string>> = {}
  for (const [key, hex] of Object.entries(editorColors)) {
    try {
      result[key] = generateColorScale(hex)
    } catch {
      result[key] = colorScales[key as ColorName]
    }
  }
  return result
})

function applyThemeToPreview() {
  const previewEl = document.querySelector('.dt-preview-surface') as HTMLElement | null
  if (!previewEl) return

  // Apply all brand colors
  for (const [key, hex] of Object.entries(editorColors)) {
    try {
      const scale = generateColorScale(hex)
      for (const shade of SHADES) {
        previewEl.style.setProperty(`--color-zc-${key}-${shade}`, scale[shade])
      }
    } catch {
      // ignore invalid colors
    }
  }

  // Apply radius
  previewEl.style.setProperty('--radius-zc-base', `${editorRadius.value}px`)
  previewEl.style.setProperty('--radius-zc-md', `${editorRadius.value + 2}px`)
  previewEl.style.setProperty('--radius-zc-lg', `${editorRadius.value + 4}px`)
}

function handleColorInput() {
  nextTick(() => {
    applyThemeToPreview()
  })
}

function resetEditor() {
  editorColors.primary = '#409eff'
  editorColors.success = '#67c23a'
  editorColors.warning = '#e6a23c'
  editorColors.danger = '#f56c6c'
  editorColors.info = '#909399'
  editorRadius.value = 4
  applyThemeToPreview()
}

function applyGlobally() {
  for (const [key, hex] of Object.entries(editorColors)) {
    setBrandColor(key as ColorName, hex)
  }
  const root = document.documentElement
  root.style.setProperty('--radius-zc-base', `${editorRadius.value}px`)
  root.style.setProperty('--radius-zc-md', `${editorRadius.value + 2}px`)
  root.style.setProperty('--radius-zc-lg', `${editorRadius.value + 4}px`)
  hasAppliedGlobally.value = true
}

// ============================================================
// Copy to clipboard
// ============================================================

const copiedVar = ref('')

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedVar.value = text
    setTimeout(() => {
      if (copiedVar.value === text) copiedVar.value = ''
    }, 1500)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copiedVar.value = text
    setTimeout(() => {
      if (copiedVar.value === text) copiedVar.value = ''
    }, 1500)
  }
}

// ============================================================
// Dark mode comparison toggle
// ============================================================

const showDarkCompare = ref(false)

const darkSemanticTokens = [
  { name: '--color-zc-text-primary', light: '#303133', dark: '#e5eaf3', label: '主要文字' },
  { name: '--color-zc-text-regular', light: '#606266', dark: '#cfd3dc', label: '常规文字' },
  { name: '--color-zc-text-secondary', light: '#909399', dark: '#a3a6ad', label: '次要文字' },
  { name: '--color-zc-text-placeholder', light: '#a8abb2', dark: '#8d9095', label: '占位文字' },
  { name: '--color-zc-border-base', light: '#dcdfe6', dark: '#4c4d4f', label: '基础边框' },
  { name: '--color-zc-border-light', light: '#e4e7ed', dark: '#414243', label: '浅色边框' },
  { name: '--color-zc-fill-base', light: '#f0f2f5', dark: '#303030', label: '基础填充' },
  { name: '--color-zc-bg-base', light: '#ffffff', dark: '#1d1d1d', label: '基础背景' },
]

// ============================================================
// Helpers
// ============================================================

/** Get readable text color for a background — uses WCAG-based luminance calculation */
function getTextColor(hex: string): string {
  try {
    return getReadableTextColor(hex)
  } catch {
    return '#ffffff'
  }
}

// ============================================================
// Lifecycle
// ============================================================

onMounted(() => {
  nextTick(() => {
    applyThemeToPreview()
  })
})

onUnmounted(() => {
  // Clean up global theme overrides when leaving the page
  if (hasAppliedGlobally.value) {
    clearThemeOverrides()
    const root = document.documentElement
    root.style.removeProperty('--radius-zc-base')
    root.style.removeProperty('--radius-zc-md')
    root.style.removeProperty('--radius-zc-lg')
  }
})
</script>

<template>
  <div class="design-tokens-page">
    <!-- ======================================================== -->
    <!-- Color Palette -->
    <!-- ======================================================== -->
    <section class="dt-section">
      <h2 id="color-palette">🎨 Color Palette 色板</h2>
      <p class="dt-section-desc">
        ZC UI 提供五组语义化色板，每组包含 50–950 共 11 个色阶。点击色块可复制对应的 CSS 变量名。
      </p>

      <div class="dt-palette-toggle">
        <button
          :class="['dt-toggle-btn', !showDarkPalette && 'dt-toggle-btn--active']"
          @click="showDarkPalette = false"
        >
          ☀️ 亮色模式
        </button>
        <button
          :class="['dt-toggle-btn', showDarkPalette && 'dt-toggle-btn--active']"
          @click="showDarkPalette = true"
        >
          🌙 暗色模式
        </button>
      </div>

      <div v-for="palette in colorPalettes" :key="palette.key" class="dt-color-group">
        <div class="dt-color-group-header">
          <span
            class="dt-color-dot"
            :style="{
              background: showDarkPalette ? palette.entries[5].darkHex : palette.entries[5].hex,
            }"
          />
          <span class="dt-color-name">{{ palette.label }}</span>
          <span class="dt-color-cn">{{ palette.cn }}</span>
        </div>
        <div class="dt-color-row" :class="{ 'dt-color-row--dark': showDarkPalette }">
          <div
            v-for="entry in palette.entries"
            :key="entry.shade"
            class="dt-color-swatch"
            :style="{
              background: showDarkPalette ? entry.darkHex : entry.hex,
              color: getTextColor(showDarkPalette ? entry.darkHex : entry.hex),
            }"
            @click="copyToClipboard(entry.cssVar)"
            :title="`点击复制: ${entry.cssVar}`"
          >
            <span class="dt-shade-num">{{ entry.shade }}</span>
            <span class="dt-shade-hex">{{ showDarkPalette ? entry.darkHex : entry.hex }}</span>
            <span v-if="copiedVar === entry.cssVar" class="dt-copy-badge"> ✓ 已复制 </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- Dark Mode Color Comparison -->
    <!-- ======================================================== -->
    <section class="dt-section">
      <h2 id="dark-mode-comparison">🌙 暗色模式对比</h2>
      <p class="dt-section-desc">
        暗色模式下的语义化令牌对比。切换文档站的亮/暗模式可查看实际效果。
      </p>

      <div class="dt-dark-toggle">
        <button
          :class="['dt-toggle-btn', !showDarkCompare && 'dt-toggle-btn--active']"
          @click="showDarkCompare = false"
        >
          并排对比
        </button>
        <button
          :class="['dt-toggle-btn', showDarkCompare && 'dt-toggle-btn--active']"
          @click="showDarkCompare = true"
        >
          暗色预览
        </button>
      </div>

      <div class="dt-dark-grid">
        <div
          v-for="token in darkSemanticTokens"
          :key="token.name"
          class="dt-dark-card"
          :class="{ 'dt-dark-card--flipped': showDarkCompare }"
          @click="copyToClipboard(token.name)"
          :title="`点击复制: ${token.name}`"
        >
          <div class="dt-dark-card-label">{{ token.label }}</div>
          <div class="dt-dark-card-swatches">
            <div class="dt-dark-swatch dt-dark-swatch--light" :style="{ background: token.light }">
              <span :style="{ color: getTextColor(token.light) }">亮色</span>
            </div>
            <div class="dt-dark-swatch dt-dark-swatch--dark" :style="{ background: token.dark }">
              <span :style="{ color: getTextColor(token.dark) }">暗色</span>
            </div>
          </div>
          <code class="dt-dark-card-var">{{ token.name }}</code>
          <div class="dt-dark-card-values">
            <span>{{ token.light }}</span>
            <span>{{ token.dark }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- Theme Editor -->
    <!-- ======================================================== -->
    <section class="dt-section">
      <h2 id="theme-editor">🎛️ Theme Editor 主题编辑器</h2>
      <p class="dt-section-desc">
        实时调整品牌色和圆角，预览效果。点击「应用到全局」可在整个文档站生效。
      </p>

      <div class="dt-editor-layout">
        <!-- Controls Panel -->
        <div class="dt-editor-controls">
          <h3 class="dt-editor-title">品牌色设置</h3>

          <div class="dt-color-picker-row" v-for="item in COLOR_NAMES" :key="item.key">
            <label class="dt-picker-label">
              <input
                type="color"
                :value="editorColors[item.key]"
                @input="
                  (e) => {
                    editorColors[item.key] = (e.target as HTMLInputElement).value
                    handleColorInput()
                  }
                "
                class="dt-color-input"
              />
              <span class="dt-picker-text">{{ item.label }} {{ item.cn }}</span>
            </label>
            <input
              type="text"
              :value="editorColors[item.key]"
              @input="
                (e) => {
                  editorColors[item.key] = (e.target as HTMLInputElement).value
                  handleColorInput()
                }
              "
              class="dt-hex-input"
            />
            <!-- Generated scale preview -->
            <div class="dt-mini-scale">
              <div
                v-for="shade in [50, 100, 300, 500, 700, 900]"
                :key="shade"
                class="dt-mini-swatch"
                :style="{ background: editorGeneratedScales[item.key]?.[shade] || '#ccc' }"
                :title="`${item.key}-${shade}: ${editorGeneratedScales[item.key]?.[shade]}`"
                @click="copyToClipboard(`--color-zc-${item.key}-${shade}`)"
              />
            </div>
          </div>

          <h3 class="dt-editor-title dt-editor-title--mt">圆角设置</h3>
          <div class="dt-slider-row">
            <input
              type="range"
              min="0"
              max="20"
              v-model.number="editorRadius"
              @input="handleColorInput"
              class="dt-slider"
            />
            <span class="dt-slider-value">{{ editorRadius }}px</span>
          </div>

          <div class="dt-editor-actions">
            <button class="dt-btn dt-btn--primary" @click="applyGlobally">⚡ 应用到全局</button>
            <button class="dt-btn dt-btn--ghost" @click="resetEditor">↺ 重置</button>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="dt-editor-preview">
          <div class="dt-preview-surface">
            <div class="dt-preview-header">
              <span class="dt-preview-title">实时预览</span>
            </div>

            <!-- Button Preview -->
            <div class="dt-preview-group">
              <div class="dt-preview-label">Buttons</div>
              <div class="dt-preview-btns">
                <button
                  v-for="item in COLOR_NAMES"
                  :key="item.key"
                  class="dt-preview-btn"
                  :style="{
                    background: `var(--color-zc-${item.key}-500)`,
                    borderColor: `var(--color-zc-${item.key}-500)`,
                    borderRadius: `var(--radius-zc-base)`,
                    color: '#fff',
                  }"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <!-- Tag Preview -->
            <div class="dt-preview-group">
              <div class="dt-preview-label">Tags</div>
              <div class="dt-preview-tags">
                <span
                  v-for="item in COLOR_NAMES"
                  :key="item.key"
                  class="dt-preview-tag"
                  :style="{
                    background: `var(--color-zc-${item.key}-50)`,
                    color: `var(--color-zc-${item.key}-700)`,
                    borderColor: `var(--color-zc-${item.key}-200)`,
                    borderRadius: `var(--radius-zc-base)`,
                  }"
                >
                  {{ item.cn }}
                </span>
              </div>
            </div>

            <!-- Card Preview -->
            <div class="dt-preview-group">
              <div class="dt-preview-label">Card</div>
              <div
                class="dt-preview-card"
                :style="{
                  borderRadius: `var(--radius-zc-lg)`,
                  borderColor: 'var(--color-zc-border-light)',
                }"
              >
                <div class="dt-preview-card-header">
                  <span
                    class="dt-preview-card-badge"
                    :style="{
                      background: 'var(--color-zc-primary-50)',
                      color: 'var(--color-zc-primary-600)',
                      borderRadius: 'var(--radius-zc-base)',
                    }"
                  >
                    Primary
                  </span>
                  <span class="dt-preview-card-title">设计令牌预览</span>
                </div>
                <div class="dt-preview-card-body">
                  <div class="dt-preview-stat">
                    <span
                      class="dt-preview-stat-value"
                      :style="{ color: 'var(--color-zc-primary-600)' }"
                      >128</span
                    >
                    <span class="dt-preview-stat-label">组件数</span>
                  </div>
                  <div class="dt-preview-stat">
                    <span
                      class="dt-preview-stat-value"
                      :style="{ color: 'var(--color-zc-success-500)' }"
                      >99%</span
                    >
                    <span class="dt-preview-stat-label">覆盖率</span>
                  </div>
                  <div class="dt-preview-stat">
                    <span
                      class="dt-preview-stat-value"
                      :style="{ color: 'var(--color-zc-warning-500)' }"
                      >5</span
                    >
                    <span class="dt-preview-stat-label">主题</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="dt-preview-group">
              <div class="dt-preview-label">Progress</div>
              <div class="dt-preview-progress-track">
                <div
                  class="dt-preview-progress-fill"
                  :style="{
                    width: '65%',
                    background: 'var(--color-zc-primary-500)',
                    borderRadius: 'var(--radius-zc-base)',
                  }"
                />
              </div>
            </div>

            <!-- Alert -->
            <div class="dt-preview-group">
              <div class="dt-preview-label">Alert</div>
              <div
                v-for="item in COLOR_NAMES.slice(0, 3)"
                :key="item.key"
                class="dt-preview-alert"
                :style="{
                  background: `var(--color-zc-${item.key}-50)`,
                  borderLeft: `4px solid var(--color-zc-${item.key}-500)`,
                  borderRadius: `var(--radius-zc-base)`,
                  color: `var(--color-zc-${item.key}-800)`,
                }"
              >
                这是一个 {{ item.cn }} 类型的提示消息。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- Other Token Showcases -->
    <!-- ======================================================== -->
    <section class="dt-section" v-for="group in tokenGroups" :key="group.label">
      <h2 :id="group.label.split(' ')[0].toLowerCase()">📐 {{ group.label }}</h2>
      <div class="dt-token-grid">
        <div
          v-for="token in group.tokens"
          :key="token.name"
          class="dt-token-card"
          @click="copyToClipboard(token.name)"
          :title="`点击复制: ${token.name}`"
        >
          <div class="dt-token-card-preview">
            <!-- Spacing preview -->
            <template v-if="group.label.includes('Spacing')">
              <div class="dt-spacing-preview">
                <div class="dt-spacing-bar" :style="{ width: token.value }" />
              </div>
            </template>
            <!-- Typography preview -->
            <template v-else-if="group.label.includes('Typography')">
              <span class="dt-typography-preview" :style="{ fontSize: token.value }">Aa</span>
            </template>
            <!-- Radius preview -->
            <template v-else-if="group.label.includes('Radius')">
              <div
                class="dt-radius-preview"
                :style="{
                  borderRadius: token.value,
                  background: 'var(--vp-c-brand-1)',
                }"
              />
            </template>
            <!-- Shadow preview -->
            <template v-else-if="group.label.includes('Shadow')">
              <div class="dt-shadow-preview" :style="{ boxShadow: token.value }" />
            </template>
            <!-- Transition preview -->
            <template v-else-if="group.label.includes('Transition')">
              <div class="dt-transition-preview">
                <div
                  class="dt-transition-box"
                  :style="
                    token.name.includes('duration')
                      ? { transitionDuration: token.value }
                      : { transitionTimingFunction: token.value }
                  "
                />
              </div>
            </template>
          </div>
          <div class="dt-token-card-info">
            <div class="dt-token-card-desc">{{ token.description }}</div>
            <code class="dt-token-card-name">{{ token.name }}</code>
            <div class="dt-token-card-value">{{ token.value }}</div>
          </div>
          <span v-if="copiedVar === token.name" class="dt-copy-badge">✓ 已复制</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
 * Section & Layout
 * ============================================================ */

.design-tokens-page {
  --dt-gap: 16px;
  margin-top: 24px;
}

.dt-section {
  margin-bottom: 48px;
}

.dt-section > h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dt-section-desc {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.7;
}

/* ============================================================
 * Color Palette
 * ============================================================ */

.dt-color-group {
  margin-bottom: 32px;
}

.dt-color-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dt-color-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

.dt-color-name {
  font-weight: 600;
  font-size: 15px;
}

.dt-color-cn {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.dt-color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.dt-color-row--dark {
  background: #1d1d1d;
  padding: 8px;
}

.dt-palette-toggle {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 20px;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  border-radius: 8px;
}

.dt-color-swatch {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  min-width: 72px;
  height: 88px;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.dt-color-swatch:hover {
  transform: translateY(-3px);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dt-shade-num {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.9;
}

.dt-shade-hex {
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  opacity: 0.8;
}

/* ============================================================
 * Copy Badge
 * ============================================================ */

.dt-copy-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: inherit;
}

.dt-token-card {
  position: relative;
}

/* ============================================================
 * Dark Mode Comparison
 * ============================================================ */

.dt-dark-toggle {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 20px;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  border-radius: 8px;
}

.dt-toggle-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.dt-toggle-btn--active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dt-dark-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.dt-dark-card {
  position: relative;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.dt-dark-card:hover {
  border-color: var(--vp-c-brand-1);
}

.dt-dark-card-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.dt-dark-card-swatches {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.dt-dark-swatch {
  flex: 1;
  padding: 16px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dt-dark-card-var {
  display: block;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 4px;
}

.dt-dark-card-values {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

/* ============================================================
 * Theme Editor
 * ============================================================ */

.dt-editor-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.dt-editor-controls {
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
}

.dt-editor-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
}

.dt-editor-title--mt {
  margin-top: 24px;
}

.dt-color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dt-picker-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.dt-color-input {
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: transparent;
}

.dt-picker-text {
  font-size: 13px;
  white-space: nowrap;
}

.dt-hex-input {
  width: 72px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  flex-shrink: 0;
}

.dt-hex-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.dt-mini-scale {
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: flex-end;
}

.dt-mini-swatch {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: transform 0.1s;
}

.dt-mini-swatch:hover {
  transform: scale(1.3);
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.dt-slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dt-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--vp-c-divider);
  border-radius: 2px;
  outline: none;
}

.dt-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  cursor: pointer;
}

.dt-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  cursor: pointer;
  border: none;
}

.dt-slider-value {
  font-size: 13px;
  font-weight: 600;
  min-width: 36px;
  text-align: right;
  font-family: var(--vp-font-family-mono);
}

.dt-editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

.dt-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.dt-btn--primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.dt-btn--primary:hover {
  background: var(--vp-c-brand-2);
}

.dt-btn--ghost {
  background: transparent;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.dt-btn--ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ============================================================
 * Theme Editor Preview
 * ============================================================ */

.dt-editor-preview {
  padding: 24px;
}

.dt-preview-surface {
  min-height: 400px;
}

.dt-preview-header {
  margin-bottom: 20px;
}

.dt-preview-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.dt-preview-group {
  margin-bottom: 20px;
}

.dt-preview-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}

.dt-preview-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dt-preview-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.dt-preview-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.dt-preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dt-preview-tag {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
}

.dt-preview-card {
  border: 1px solid;
  padding: 16px;
  max-width: 360px;
}

.dt-preview-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.dt-preview-card-badge {
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
}

.dt-preview-card-title {
  font-size: 15px;
  font-weight: 600;
}

.dt-preview-card-body {
  display: flex;
  gap: 24px;
}

.dt-preview-stat {
  display: flex;
  flex-direction: column;
}

.dt-preview-stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.dt-preview-stat-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.dt-preview-progress-track {
  height: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  overflow: hidden;
}

.dt-preview-progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.dt-preview-alert {
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* ============================================================
 * Token Card Grid
 * ============================================================ */

.dt-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.dt-token-card {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
}

.dt-token-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dt-token-card-preview {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

/* Spacing preview */
.dt-spacing-preview {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.dt-spacing-bar {
  height: 24px;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  min-width: 4px;
}

/* Typography preview */
.dt-typography-preview {
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
}

/* Radius preview */
.dt-radius-preview {
  width: 40px;
  height: 40px;
}

/* Shadow preview */
.dt-shadow-preview {
  width: 40px;
  height: 40px;
  background: var(--vp-c-bg);
  border-radius: 6px;
}

/* Transition preview */
.dt-transition-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dt-transition-box {
  width: 32px;
  height: 32px;
  background: var(--vp-c-brand-1);
  border-radius: 4px;
  transition: all 0.25s ease;
}

.dt-transition-preview:hover .dt-transition-box {
  transform: scale(1.4) rotate(15deg);
}

.dt-token-card-info {
  text-align: center;
}

.dt-token-card-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}

.dt-token-card-name {
  display: block;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 2px;
}

.dt-token-card-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

/* ============================================================
 * Responsive
 * ============================================================ */

@media (max-width: 768px) {
  .dt-editor-layout {
    grid-template-columns: 1fr;
  }

  .dt-editor-controls {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .dt-color-swatch {
    width: calc(33.333% - 3px);
    min-width: unset;
    height: 72px;
  }

  .dt-color-row {
    gap: 2px;
  }

  .dt-dark-grid {
    grid-template-columns: 1fr;
  }

  .dt-token-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dt-color-picker-row {
    flex-wrap: wrap;
  }

  .dt-mini-scale {
    width: 100%;
    justify-content: flex-start;
  }

  .dt-section > h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .dt-token-grid {
    grid-template-columns: 1fr;
  }

  .dt-color-swatch {
    width: calc(50% - 2px);
  }
}
</style>
