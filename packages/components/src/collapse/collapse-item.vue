<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'
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
  }>(),
  {
    name: undefined,
    title: undefined,
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'item-click', name: string | number | undefined): void
}>()

const ns = useNamespace('collapse-item')

interface CollapseContext {
  activeNames: ComputedRef<Array<string | number>>
  toggleItem: (name: string | number | undefined) => void
}

const collapseCtx = inject<CollapseContext>('zcCollapse', {
  activeNames: computed(() => []),
  toggleItem: () => {},
} as CollapseContext)

const isActive = computed(() => {
  if (props.name === undefined) return false
  return collapseCtx.activeNames.value.includes(props.name)
})

function handleClick() {
  if (props.disabled) return
  emit('item-click', props.name)
  collapseCtx.toggleItem(props.name)
}

const classes = computed(() => [
  ns.b(),
  ns.is('active', isActive.value),
  ns.is('disabled', props.disabled),
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
      :class="ns.e('header')"
      role="tab"
      :id="`zc-collapse-header-${name ?? 'default'}`"
      :aria-expanded="isActive ? 'true' : 'false'"
      :aria-controls="`zc-collapse-content-${name ?? 'default'}`"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="disabled ? -1 : 0"
      @click="handleClick"
      @keydown.enter.prevent="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <span :class="ns.e('header-title')">
        <slot name="title">{{ title }}</slot>
      </span>
      <span :class="ns.e('arrow')" :style="{ transform: isActive ? 'rotate(90deg)' : 'none' }">
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
          :id="`zc-collapse-content-${name ?? 'default'}`"
          :aria-labelledby="`zc-collapse-header-${name ?? 'default'}`"
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

.zc-collapse-item:last-child {
  border-bottom: none;
}

/* ---- Header ---- */
.zc-collapse-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 var(--spacing-zc-md, 16px);
  font-size: var(--text-zc-md, 16px);
  color: var(--color-zc-text-primary, #303133);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-collapse-item__header:hover {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

.zc-collapse-item__header-title {
  flex: 1;
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
  color: var(--color-zc-text-secondary, #909399);
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* ---- Content ---- */
.zc-collapse-item__wrapper {
  overflow: hidden;
  will-change: height;
}

.zc-collapse-item__content {
  padding: 0 var(--spacing-zc-md, 16px) var(--spacing-zc-md, 16px);
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-regular, #606266);
  line-height: 1.5;
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
