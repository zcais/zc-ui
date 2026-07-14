<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcIcon' })

export type IconSize = number | string

const props = withDefaults(
  defineProps<{
    /** SVG path data for the icon */
    name?: string
    /** Icon size in px or CSS string */
    size?: IconSize
    /** Icon color */
    color?: string
    /** SVG path 'd' attribute (alternative to name) */
    path?: string
    /** viewBox for the SVG, defaults to '0 0 24 24' */
    viewBox?: string
    /** Accessible label */
    label?: string
  }>(),
  {
    name: '',
    size: 16,
    color: '',
    path: '',
    viewBox: '0 0 24 24',
    label: '',
  }
)

const ns = useNamespace('icon')

const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.size !== undefined) {
    const sizeVal = typeof props.size === 'number' ? `${props.size}px` : props.size
    s.width = sizeVal
    s.height = sizeVal
    s.fontSize = sizeVal
  }
  if (props.color) {
    s.color = props.color
  }
  return s
})

const svgPath = computed(() => props.path || props.name)
</script>

<template>
  <i
    :class="ns.b()"
    :style="style"
    :role="label ? 'img' : 'presentation'"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg :class="ns.e('svg')" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path v-if="svgPath" :d="svgPath" fill="currentColor" />
      <slot v-else />
    </svg>
  </i>
</template>

<style scoped>
/* ============================================================
 * ZcIcon styles
 * ============================================================ */

.zc-icon {
  /* Component-level CSS variables (overridable via theming) */
  --zc-icon-size: 16px;
  --zc-icon-color: inherit;
  
  display: inline-flex;
  align-items: center;
justify-content: center;
  line-height: 1;
  color: var(--zc-icon-color);
  font-style: normal;
}

.zc-icon__svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
