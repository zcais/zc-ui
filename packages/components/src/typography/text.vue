<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcText' })

export type TextType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
export type TextSize = 'sm' | 'base' | 'lg' | 'xl' | 'inherit'

const props = withDefaults(
  defineProps<{
    /** Text color type */
    type?: TextType
    /** Text size */
    size?: TextSize
    /** Truncate text with ellipsis (single line) */
    truncated?: boolean
    /** Bold text */
    strong?: boolean
    /** Italic text */
    italic?: boolean
    /** Code style */
    code?: boolean
  }>(),
  {
    type: 'default',
    size: 'inherit',
    truncated: false,
    strong: false,
    italic: false,
    code: false,
  },
)

const ns = useNamespace('text')

const classes = computed(() => [
  ns.b(),
  props.type !== 'default' ? ns.m(props.type) : '',
  props.size !== 'inherit' ? ns.m(props.size) : '',
  ns.is('truncated', props.truncated),
  ns.is('strong', props.strong),
  ns.is('italic', props.italic),
])

const tag = computed(() => (props.code ? 'code' : 'span'))
</script>

<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcText styles
 * BEM naming: zc-text / zc-text--{type} / zc-text--{size}
 * ============================================================ */

.zc-text {
  /* CSS custom properties for easy theming */
  --zc-text-color: var(--color-zc-text-primary, #303133);
  --zc-text-font-size: inherit;
  --zc-text-line-height: inherit;

  color: var(--zc-text-color);
  font-size: var(--zc-text-font-size);
  line-height: var(--zc-text-line-height);
  margin: 0;
  padding: 0;
  word-break: break-word;
}

/* ---- Truncated ---- */
.zc-text.is-truncated {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

/* ---- Strong ---- */
.zc-text.is-strong {
  font-weight: 600;
}

/* ---- Italic ---- */
.zc-text.is-italic {
  font-style: italic;
}

/* ---- Type colors ---- */
.zc-text--primary {
  --zc-text-color: var(--color-zc-primary-500, #409eff);
}
.zc-text--success {
  --zc-text-color: var(--color-zc-success-500, #67c23a);
}
.zc-text--warning {
  --zc-text-color: var(--color-zc-warning-500, #e6a23c);
}
.zc-text--danger {
  --zc-text-color: var(--color-zc-danger-500, #f56c6c);
}
.zc-text--info {
  --zc-text-color: var(--color-zc-info-500, #909399);
}

/* ---- Sizes ---- */
.zc-text--sm {
  --zc-text-font-size: var(--text-zc-sm, 12px);
}
.zc-text--base {
  --zc-text-font-size: var(--text-zc-base, 14px);
}
.zc-text--lg {
  --zc-text-font-size: var(--text-zc-lg, 16px);
}
.zc-text--xl {
  --zc-text-font-size: var(--text-zc-xl, 20px);
}

/* ---- Code style ---- */
code.zc-text {
  font-family: var(--font-zc-mono, 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace);
  font-size: 0.85em;
  background: var(--color-zc-fill-light, #f5f7fa);
  border-radius: var(--radius-zc-base, 4px);
  padding: 0.15em 0.4em;
  white-space: break-spaces;
}

/* ---- Dark mode ---- */
html[data-theme='dark'] .zc-text {
  --zc-text-color: var(--color-zc-text-primary, #e5eaf3);
}

html[data-theme='dark'] .zc-text--primary {
  --zc-text-color: var(--color-zc-primary-400, #79bbff);
}
html[data-theme='dark'] .zc-text--success {
  --zc-text-color: var(--color-zc-success-400, #95d475);
}
html[data-theme='dark'] .zc-text--warning {
  --zc-text-color: var(--color-zc-warning-400, #eebe77);
}
html[data-theme='dark'] .zc-text--danger {
  --zc-text-color: var(--color-zc-danger-400, #f89898);
}
html[data-theme='dark'] .zc-text--info {
  --zc-text-color: var(--color-zc-info-400, #b1b3b8);
}

html[data-theme='dark'] code.zc-text {
  background: var(--color-zc-fill, #252526);
  color: var(--color-zc-text-primary, #e5eaf3);
}
</style>
