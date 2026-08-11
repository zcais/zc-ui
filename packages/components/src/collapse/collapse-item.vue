<script setup lang="ts">
import { computed, inject, nextTick, useId, type ComputedRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcCollapseItem' })

const props = withDefaults(
  defineProps<{
    /** Panel identifier (must match v-model value) */
    name?: string | number
    /** Panel title text */
    title?: string
    /** Disable toggle */
    disabled?: boolean
    /** Show the expand/collapse arrow icon */
    showArrow?: boolean
    /** Arrow placement: left or right of header */
    arrowPlacement?: 'left' | 'right'
  }>(),
  {
    name: undefined,
    title: undefined,
    disabled: false,
    showArrow: true,
    arrowPlacement: 'right',
  }
)

const emit = defineEmits<{
  (e: 'item-click', name: string | number | undefined): void
  (e: 'toggle', payload: { name: string | number | undefined; isActive: boolean }): void
}>()

const ns = useNamespace('collapse-item')

interface CollapseContext {
  activeNames: ComputedRef<Array<string | number>>
  toggleItem: (name: string | number | undefined) => void
  size: ComputedRef<'large' | 'default' | 'small'>
  instanceId: string
}

// Fallback unique ID for standalone usage (outside of ZcCollapse)
const ownUid = useId()

const collapseCtx = inject<CollapseContext>('zcCollapse', {
  activeNames: computed(() => []),
  toggleItem: () => {},
  size: computed(() => 'default' as const),
  instanceId: ownUid,
} as CollapseContext)

// Unique prefix for DOM ids — combines parent instance ID with item name
const idPrefix = computed(() => `zc-collapse-${collapseCtx.instanceId}-${props.name ?? 'default'}`)

const isActive = computed(() => {
  if (props.name === undefined) return false
  return collapseCtx.activeNames.value.includes(props.name)
})

async function handleClick() {
  if (props.disabled) return
  emit('item-click', props.name)
  collapseCtx.toggleItem(props.name)
  // Wait for reactive state to settle before reporting isActive
  await nextTick()
  emit('toggle', { name: props.name, isActive: isActive.value })
}

const classes = computed(() => [
  ns.b(),
  ns.is('active', isActive.value),
  ns.is('disabled', props.disabled),
  ns.m(collapseCtx.size.value),
])

/* ---- Expand/collapse height animation ---- */
function onExpandEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.overflow = 'hidden'
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
}

function onExpandAfterEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = ''
  htmlEl.style.overflow = ''
}

function onExpandLeave(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.overflow = 'hidden'
  // Force reflow then set height to 0 for transition
  void htmlEl.offsetHeight
  htmlEl.style.height = '0'
}
</script>

<template>
  <div :class="classes">
    <div
      :class="[ns.e('header'), ns.is('arrow-left', arrowPlacement === 'left')]"
      role="tab"
      :id="`zc-collapse-header-${idPrefix}`"
      :aria-expanded="isActive ? 'true' : 'false'"
      :aria-controls="`zc-collapse-content-${idPrefix}`"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="disabled ? -1 : 0"
      @click="handleClick"
      @keydown.enter.prevent="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <!-- Arrow on left -->
      <span
        v-if="showArrow && arrowPlacement === 'left'"
        :class="ns.e('arrow')"
        :style="{ transform: isActive ? 'rotate(90deg)' : 'none' }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="width: 16px; height: 16px"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>

      <!-- Icon slot -->
      <span v-if="$slots.icon" :class="ns.e('icon')">
        <slot name="icon" :active="isActive" />
      </span>

      <span :class="ns.e('header-title')">
        <slot name="title">{{ title }}</slot>
      </span>

      <!-- Extra slot -->
      <span v-if="$slots.extra" :class="ns.e('extra')">
        <slot name="extra" :active="isActive" />
      </span>

      <!-- Arrow on right -->
      <span
        v-if="showArrow && arrowPlacement === 'right'"
        :class="ns.e('arrow')"
        :style="{ transform: isActive ? 'rotate(90deg)' : 'none' }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="width: 16px; height: 16px"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    </div>
    <transition
      name="zc-collapse-expand"
      @enter="onExpandEnter"
      @after-enter="onExpandAfterEnter"
      @leave="onExpandLeave"
    >
      <div v-show="isActive" :class="ns.e('wrapper')">
        <div
          :class="ns.e('content')"
          role="tabpanel"
          :id="`zc-collapse-content-${idPrefix}`"
          :aria-labelledby="`zc-collapse-header-${idPrefix}`"
        >
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCollapseItem styles
 * BEM naming: zc-collapse-item / __header / __content / __arrow
 * ============================================================ */

.zc-collapse-item {
  border-bottom: 1px solid var(--color-zc-border-light, #e4e7ed);
}

/* Ghost mode: no per-item border */
.zc-collapse.is-ghost .zc-collapse-item {
  border-bottom: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-collapse-item:last-child {
  border-bottom: none;
}

/* ---- Header ---- */
.zc-collapse-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--zc-collapse-header-height, 48px);
  padding: 0 var(--spacing-zc-md, 16px);
  font-size: var(--zc-collapse-header-font-size, var(--text-zc-md, 16px));
  color: var(--zc-collapse-header-text-color, var(--color-zc-text-primary, #303133));
  cursor: pointer;
  user-select: none;
  gap: var(--spacing-zc-xs, 8px);
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-collapse-item__header:hover {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

/* Active header gets primary color */
.zc-collapse-item.is-active .zc-collapse-item__header {
  color: var(--zc-collapse-active-header-color, var(--color-zc-primary-500, #409eff));
  border-bottom-color: transparent;
}

/* Arrow on left side: title gets flex:1 */
.zc-collapse-item__header.is-arrow-left {
  flex-direction: row;
}

.zc-collapse-item__header-title {
  flex: 1;
}

/* ---- Icon slot ---- */
.zc-collapse-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-zc-text-secondary, #909399);
}

/* ---- Extra slot ---- */
.zc-collapse-item__extra {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-zc-text-secondary, #909399);
  font-size: var(--text-zc-sm, 14px);
}

/* ---- Disabled ---- */
.zc-collapse-item.is-disabled .zc-collapse-item__header {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
  background-color: transparent;
}

/* ---- Arrow ---- */
.zc-collapse-item__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-zc-text-secondary, #909399);
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-collapse-item.is-active .zc-collapse-item__arrow {
  color: var(--zc-collapse-active-header-color, var(--color-zc-primary-500, #409eff));
}

/* ---- Content ---- */
.zc-collapse-item__wrapper {
  overflow: hidden;
  will-change: height;
}

.zc-collapse-item__content {
  padding: 0 var(--spacing-zc-md, 16px) var(--spacing-zc-md, 16px);
  font-size: var(--text-zc-base, 14px);
  color: var(--zc-collapse-content-text-color, var(--color-zc-text-regular, #606266));
  line-height: 1.6;
}

/* ---- Size: small ---- */
.zc-collapse-item--small .zc-collapse-item__content {
  padding: 0 var(--spacing-zc-md, 16px) var(--spacing-zc-sm, 12px);
  font-size: var(--text-zc-sm, 14px);
}

/* ---- Size: large ---- */
.zc-collapse-item--large .zc-collapse-item__content {
  padding: 0 var(--spacing-zc-md, 16px) var(--spacing-zc-lg, 20px);
  font-size: var(--text-zc-base, 15px);
}

/* ---- Expand transition ---- */
.zc-collapse-expand-enter-active,
.zc-collapse-expand-leave-active {
  transition:
    height var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-collapse-expand-enter-from,
.zc-collapse-expand-leave-to {
  opacity: 0;
}
</style>
