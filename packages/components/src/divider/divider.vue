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
  }>(),
  {
    direction: 'horizontal',
    contentPosition: 'center',
    borderStyle: 'solid',
    dashed: false,
  }
)

const ns = useNamespace('divider')
const slots = useSlots()

const hasContent = computed(() => !!slots.default && slots.default().length > 0)

const actualBorderStyle = computed(() => (props.dashed ? 'dashed' : props.borderStyle))

const classes = computed(() => [
  ns.b(),
  ns.m(props.direction),
  ns.is('with-content', hasContent.value && props.direction === 'horizontal'),
])
</script>

<template>
  <div :class="classes" role="separator">
    <template v-if="direction === 'horizontal' && hasContent">
      <div
        :class="[ns.e('line'), ns.em('line', 'left')]"
        :style="{ borderTopStyle: actualBorderStyle }"
      />
      <div :class="ns.e('text')" :style="{ textAlign: contentPosition }">
        <slot />
      </div>
      <div
        :class="[ns.e('line'), ns.em('line', 'right')]"
        :style="{ borderTopStyle: actualBorderStyle }"
      />
    </template>
    <template v-else-if="direction === 'vertical'">
      <div :class="ns.e('vertical-line')" :style="{ borderLeftStyle: actualBorderStyle }" />
    </template>
    <template v-else>
      <div :class="ns.e('line')" :style="{ borderTopStyle: actualBorderStyle }" />
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
--zc-divider-font-size: var(--text-zc-md, 16px);
--zc-divider-margin: 24px 0;
--zc-divider-text-padding: 20px;
  }
  
  /* ---- Horizontal ---- */
.zc-divider--horizontal {
display: block;
width: 100%;
margin: var(--zc-divider-margin);
  }
  
/* Without content: single line */
.zc-divider--horizontal:not(.is-with-content) {
border-top: 1px solid var(--zc-divider-color);
height: 0;
  }
  
  /* With content: flexbox layout */
  .zc-divider--horizontal.is-with-content {
display: flex;
align-items: center;
border-top: none;
  margin: var(--zc-divider-margin);
}

.zc-divider--horizontal.is-with-content .zc-divider__line {
border-top: 1px solid var(--zc-divider-color);
  }

/* Content position: left */
.zc-divider--horizontal.is-with-content .zc-divider__line--left {
  flex: 0 1 5%;
}

.zc-divider--horizontal.is-with-content .zc-divider__line--right {
flex: 1;
  }
  
/* Content position: right (swap via text align) */
.zc-divider--horizontal.is-with-content:has(.zc-divider__text[style*='right'])
.zc-divider__line--left {
  flex: 1;
  }

.zc-divider--horizontal.is-with-content:has(.zc-divider__text[style*='right'])
.zc-divider__line--right {
flex: 0 1 5%;
  }

  /* Content position: center (equal flex) */
  .zc-divider--horizontal.is-with-content:has(.zc-divider__text[style*='center'])
.zc-divider__line--left,
.zc-divider--horizontal.is-with-content:has(.zc-divider__text[style*='center'])
.zc-divider__line--right {
  flex: 1;
  }
  
  .zc-divider__text {
  padding: 0 var(--zc-divider-text-padding);
font-size: var(--zc-divider-font-size);
color: var(--zc-divider-text-color);
white-space: nowrap;
flex-shrink: 0;
  }
  
  /* ---- Vertical ---- */
  .zc-divider--vertical {
  display: inline-block;
vertical-align: middle;
position: relative;
margin: 0 var(--spacing-zc-sm, 8px);
  height: 1em;
  }
  
.zc-divider__vertical-line {
width: 0;
  height: 100%;
  border-left: 1px solid var(--zc-divider-color);
}
</style>
