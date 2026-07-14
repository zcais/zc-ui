<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcCard' })

export type CardShadow = 'always' | 'hover' | 'never'

const props = withDefaults(
  defineProps<{
    /** Card title text. Overridden by header slot. */
    header?: string
    /** Inline styles for body element.
     * @deprecated Use bodyClass with CSS variables or scoped style overrides instead.
     * Inline styles should be avoided in favor of design tokens */
    bodyStyle?: string | Record<string, string>
    /** Shadow display mode */
    shadow?: CardShadow
    /** Custom class for body element */
    bodyClass?: string
  }>(),
  {
    header: undefined,
    bodyStyle: undefined,
    shadow: 'always',
    bodyClass: undefined,
  }
)

const ns = useNamespace('card')
const slots = useSlots()

const showHeader = computed(() => !!props.header || !!slots.header)
const showFooter = computed(() => !!slots.footer)

const classes = computed(() => [ns.b(), ns.m(`shadow-${props.shadow}`)])
</script>

<template>
  <div :class="classes">
    <div v-if="showHeader" :class="ns.e('header')">
      <slot name="header">
        <span :class="ns.e('header-title')">{{ header }}</span>
      </slot>
    </div>
    <div :class="[ns.e('body'), bodyClass]" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="showFooter" :class="ns.e('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCard styles
 * BEM naming: zc-card / zc-card__header / zc-card__body / zc-card__footer
 * ============================================================ */

.zc-card {
  /* Component-level CSS variables */
  --zc-card-bg-color: var(--color-zc-bg-base, #fff);
  --zc-card-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-card-border-radius: var(--radius-zc-base, 4px);
  --zc-card-box-shadow: var(--shadow-zc-base, 0 2px 8px 0 rgba(0, 0, 0, 0.08));
  --zc-card-header-bg-color: transparent;
--zc-card-header-border-color: var(--color-zc-border-lighter, #ebeef5);
--zc-card-header-padding: var(--spacing-zc-base, 12px) var(--spacing-zc-md, 16px);
--zc-card-body-padding: var(--spacing-zc-md, 16px);
--zc-card-title-color: var(--color-zc-text-primary, #303133);
  --zc-card-title-font-size: var(--text-zc-md, 16px);
--zc-card-body-color: var(--color-zc-text-primary, #303133);
--zc-card-footer-border-color: var(--color-zc-border-lighter, #ebeef5);
--zc-card-footer-padding: var(--spacing-zc-base, 12px) var(--spacing-zc-md, 16px);
  
  border: 1px solid var(--zc-card-border-color);
border-radius: var(--zc-card-border-radius);
background-color: var(--zc-card-bg-color);
overflow: hidden;
  color: var(--zc-card-body-color);
transition: box-shadow var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

  /* ---- Shadow modes ---- */
.zc-card--shadow-always {
box-shadow: var(--zc-card-box-shadow);
}

  .zc-card--shadow-hover {
  box-shadow: none;
  cursor: pointer;
  }
  
.zc-card--shadow-hover:hover {
box-shadow: var(--zc-card-box-shadow);
}
  
  .zc-card--shadow-never {
  box-shadow: none;
  }

/* ---- Header ---- */
.zc-card__header {
display: flex;
  align-items: center;
  padding: var(--zc-card-header-padding);
background-color: var(--zc-card-header-bg-color);
border-bottom: 1px solid var(--zc-card-header-border-color);
box-sizing: border-box;
}
  
  .zc-card__header-title {
  font-size: var(--zc-card-title-font-size);
font-weight: 500;
color: var(--zc-card-title-color);
  flex: 1;
}

/* ---- Body ---- */
.zc-card__body {
  padding: var(--zc-card-body-padding);
  box-sizing: border-box;
}

/* ---- Footer ---- */
.zc-card__footer {
  padding: var(--zc-card-footer-padding);
  border-top: 1px solid var(--zc-card-footer-border-color);
  box-sizing: border-box;
}
</style>
