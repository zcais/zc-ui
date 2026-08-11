<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcDivider' })

export type DividerDirection = 'horizontal' | 'vertical'
export type DividerContentPosition = 'left' | 'center' | 'right'
export type DividerBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double'

const props = withDefaults(
  defineProps<{
    /** Divider direction */
    direction?: DividerDirection
    /** Text alignment (horizontal only) */
    contentPosition?: DividerContentPosition
    /** Border style */
    borderStyle?: DividerBorderStyle
    /** Shortcut for dashed border */
    dashed?: boolean
    /** Plain mode: text without padding emphasis */
    plain?: boolean
    /** Custom border color */
    color?: string
    /** Custom border thickness (e.g., '2px'). Applied to all border sides */
    borderWidth?: string
    /** Custom top/bottom margin for horizontal dividers (e.g., '16px' or '16px 0') */
    margin?: string
    /** Custom height for vertical dividers (e.g., '24px', '2em') */
    height?: string
    /** Custom content-side ratio for left/right positioning (e.g., '80px' or '20%') */
    contentWidth?: string
  }>(),
  {
    direction: 'horizontal',
    contentPosition: 'center',
    borderStyle: 'solid',
    dashed: false,
    plain: false,
    color: undefined,
    borderWidth: undefined,
    margin: undefined,
    height: undefined,
    contentWidth: undefined,
  }
)

const ns = useNamespace('divider')
const slots = useSlots()

const hasContent = computed(() => !!slots.default && slots.default().length > 0)
const hasIcon = computed(() => !!slots.icon && slots.icon().length > 0)

const actualBorderStyle = computed(() => (props.dashed ? 'dashed' : props.borderStyle))

const classes = computed(() => [
  ns.b(),
  ns.m(props.direction),
  ns.is('with-content', hasContent.value && props.direction === 'horizontal'),
  ns.is('with-icon', hasIcon.value),
  ns.is('plain', props.plain),
  // Use BEM modifier for content position instead of fragile :has() selector
  ...(props.direction === 'horizontal' && hasContent.value
    ? [ns.m(`text-${props.contentPosition}`)]
    : []),
])

const borderStyleObj = computed(() => {
  const style: Record<string, string> = {
    [props.direction === 'vertical' ? 'borderLeftStyle' : 'borderTopStyle']:
      actualBorderStyle.value,
  }
  if (props.color) {
    style[props.direction === 'vertical' ? 'borderLeftColor' : 'borderTopColor'] = props.color
  }
  if (props.borderWidth) {
    style[props.direction === 'vertical' ? 'borderLeftWidth' : 'borderTopWidth'] = props.borderWidth
  }
  return style
})

const lineStyle = computed(() => borderStyleObj.value)

const vLineStyle = computed(() => ({
  ...borderStyleObj.value,
  ...(props.height ? { height: props.height } : {}),
}))

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.direction === 'horizontal' && props.margin) {
    style.margin = props.margin
  }
  if (props.direction === 'vertical' && props.height) {
    style.height = props.height
  }
  if (props.contentWidth && props.contentPosition !== 'center') {
    style['--zc-divider-content-width'] = props.contentWidth
  }
  return style
})
</script>

<template>
  <div :class="classes" :style="rootStyle" role="separator">
    <template v-if="direction === 'horizontal' && hasContent">
      <div :class="[ns.e('line'), ns.em('line', 'left')]" :style="lineStyle" />
      <div :class="ns.e('text')">
        <slot v-if="hasIcon" name="icon" />
        <slot />
      </div>
      <div :class="[ns.e('line'), ns.em('line', 'right')]" :style="lineStyle" />
    </template>
    <template v-else-if="direction === 'vertical'">
      <div :class="ns.e('vertical-line')" :style="vLineStyle" />
    </template>
    <template v-else>
      <div :class="ns.e('line')" :style="lineStyle" />
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcDivider styles
 * BEM naming: zc-divider / zc-divider__line / zc-divider__text
 * ============================================================ */

.zc-divider {
  --zc-divider-color: var(--color-zc-border-base, #dcdfe6);
  --zc-divider-text-color: var(--color-zc-text-primary, #303133);
  --zc-divider-font-size: var(--text-zc-md, 14px);
  --zc-divider-margin: 24px 0;
  --zc-divider-text-padding: 20px;
  --zc-divider-border-width: 1px;
  --zc-divider-content-width: 5%;
}

/* ---- Horizontal ---- */
.zc-divider--horizontal {
  display: block;
  width: 100%;
  margin: var(--zc-divider-margin);
}

/* Without content: single line */
.zc-divider--horizontal:not(.is-with-content) {
  border-top: var(--zc-divider-border-width) solid var(--zc-divider-color);
  height: 0;
}

/* With content: flexbox layout */
.zc-divider--horizontal.is-with-content {
  display: flex;
  align-items: center;
  border-top: none;
}

.zc-divider--horizontal.is-with-content .zc-divider__line {
  border-top: var(--zc-divider-border-width) solid var(--zc-divider-color);
}

/* Content position: left */
.zc-divider--text-left .zc-divider__line--left {
  flex: 0 0 var(--zc-divider-content-width);
}

.zc-divider--text-left .zc-divider__line--right {
  flex: 1;
}

/* Content position: right */
.zc-divider--text-right .zc-divider__line--left {
  flex: 1;
}

.zc-divider--text-right .zc-divider__line--right {
  flex: 0 0 var(--zc-divider-content-width);
}

/* Content position: center */
.zc-divider--text-center .zc-divider__line--left,
.zc-divider--text-center .zc-divider__line--right {
  flex: 1;
}

/* Text styling */
.zc-divider__text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 var(--zc-divider-text-padding);
  font-size: var(--zc-divider-font-size);
  font-weight: 500;
  color: var(--zc-divider-text-color);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Icon in text */
.zc-divider.is-with-icon .zc-divider__text :slotted(svg),
.zc-divider.is-with-icon .zc-divider__text :slotted([class*='icon']) {
  font-size: 1.1em;
  width: 1.1em;
  height: 1.1em;
  opacity: 0.85;
}

/* Plain mode: reduced padding, lighter text */
.zc-divider.is-plain .zc-divider__text {
  font-weight: 400;
  color: var(--color-zc-text-secondary, #909399);
  padding: 0 12px;
}

/* ---- Vertical ---- */
.zc-divider--vertical {
  display: inline-flex;
  align-items: center;
  position: relative;
  margin: 0 var(--spacing-zc-sm, 8px);
  height: 1em;
  vertical-align: middle;
}

.zc-divider__vertical-line {
  width: 0;
  height: 100%;
  border-left: var(--zc-divider-border-width) solid var(--zc-divider-color);
}

/* ---- Dark mode ---- */
.dark .zc-divider {
  --zc-divider-color: var(--color-zc-border-base, #414243);
  --zc-divider-text-color: var(--color-zc-text-primary, #e5eaf3);
}
</style>
