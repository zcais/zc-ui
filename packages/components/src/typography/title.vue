<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNamespace, useClipboard } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTitle' })

export type TitleLevel = 1 | 2 | 3 | 4 | 5

const props = withDefaults(
  defineProps<{
    /** Heading level (1–5 → h1–h5) */
    level?: TitleLevel
    /** Show copy button */
    copyable?: boolean
    /** Text to copy (defaults to textContent) */
    copyText?: string
    /** Custom tooltip for the copy button */
    copyTooltip?: string
  }>(),
  {
    level: 1,
    copyable: false,
    copyText: undefined,
    copyTooltip: undefined,
  },
)

const emit = defineEmits<{
  (e: 'copy', text: string): void
}>()

const ns = useNamespace('title')
const { copy, copied } = useClipboard()

const titleRef = ref<HTMLElement>()

const tag = computed(() => `h${props.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5')

const classes = computed(() => [ns.b(), ns.m(`level-${props.level}`)])

async function handleCopy() {
  const text = props.copyText ?? titleRef.value?.textContent ?? ''
  const ok = await copy(text)
  if (ok) {
    emit('copy', text)
  }
}
</script>

<template>
  <component :is="tag" :class="classes">
    <span ref="titleRef" :class="ns.e('content')">
      <slot />
    </span>
    <button
      v-if="copyable"
      :class="[ns.e('copy'), ns.is('copied', copied)]"
      type="button"
      :title="copyTooltip ?? (copied ? '已复制' : '复制')"
      @click="handleCopy"
    >
      <!-- Copy icon -->
      <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <!-- Check icon -->
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcTitle styles
 * BEM naming: zc-title / zc-title__content / zc-title__copy
 * ============================================================ */

.zc-title {
  --zc-title-color: var(--color-zc-text-primary, #303133);
  --zc-title-margin-top: 0;
  --zc-title-margin-bottom: 0.5em;

  color: var(--zc-title-color);
  font-weight: 600;
  line-height: 1.4;
  margin-top: var(--zc-title-margin-top);
  margin-bottom: var(--zc-title-margin-bottom);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ---- Levels ---- */
.zc-title--level-1 {
  font-size: var(--text-zc-3xl, 28px);
  font-weight: 700;
}
.zc-title--level-2 {
  font-size: var(--text-zc-2xl, 24px);
}
.zc-title--level-3 {
  font-size: var(--text-zc-xl, 20px);
}
.zc-title--level-4 {
  font-size: var(--text-zc-lg, 16px);
}
.zc-title--level-5 {
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-secondary, #606266);
}

.zc-title__content {
  display: inline-block;
}

/* ---- Copy button ---- */
.zc-title__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  border-radius: var(--radius-zc-base, 4px);
  transition: color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  flex-shrink: 0;
}

.zc-title__copy:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-title__copy svg {
  width: 16px;
  height: 16px;
}

.zc-title__copy.is-copied {
  color: var(--color-zc-success-500, #67c23a);
}

/* ---- Dark mode ---- */
html[data-theme='dark'] .zc-title {
  --zc-title-color: var(--color-zc-text-primary, #e5eaf3);
}
html[data-theme='dark'] .zc-title--level-5 {
  color: var(--color-zc-text-secondary, #a3a6ad);
}
html[data-theme='dark'] .zc-title__copy {
  color: var(--color-zc-text-secondary, #a3a6ad);
}
</style>
