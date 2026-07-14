<script setup lang="ts">
import { ref, computed, provide, watch, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTabs' })

import type { TabsType, TabsPosition, PaneData } from './types'

const props = withDefaults(
  defineProps<{
    /** Currently active tab (v-model) */
    modelValue?: string | number
    /** Tab style */
    type?: TabsType
    /** Tab header position */
    position?: TabsPosition
    /** Whether tabs are closable */
    closable?: boolean
    /** Whether tabs can be added */
    addable?: boolean
    /** Whether tabs are editable (add + close) */
    editable?: boolean
    /** Show tabs as sliding (no card) */
    beforeLeave?: (
      activeName: string | number,
      oldActiveName: string | number
    ) => boolean | Promise<boolean>
  }>(),
  {
    modelValue: '',
    type: '',
    position: 'top',
    closable: false,
    addable: false,
    editable: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', name: string | number): void
  (e: 'tab-click', name: string | number, event: MouseEvent): void
  (e: 'tab-remove', name: string | number): void
  (e: 'tab-add'): void
  (e: 'edit', name: string | number | undefined, action: 'remove' | 'add'): void
}>()

const ns = useNamespace('tabs')

const currentName = ref<string | number>(props.modelValue)

const panes = ref<PaneData[]>([])

function registerPane(pane: PaneData) {
  const idx = panes.value.findIndex((p) => p.uid === pane.uid)
  if (idx > -1) {
    panes.value[idx] = pane
  } else {
    panes.value.push(pane)
  }
}

function unregisterPane(uid: number) {
  const idx = panes.value.findIndex((p) => p.uid === uid)
  if (idx > -1) panes.value.splice(idx, 1)
}

provide('zcTabs', {
  currentName,
  closable: computed(() => props.closable),
  registerPane,
  unregisterPane,
})

watch(
  () => props.modelValue,
  (val) => {
    currentName.value = val
  }
)

async function handleClick(name: string | number, e: MouseEvent, disabled?: boolean) {
  if (disabled) return
  emit('tab-click', name, e)
  if (name !== currentName.value) {
    try {
      const result = props.beforeLeave ? await props.beforeLeave(name, currentName.value) : true
      if (result !== false) {
        currentName.value = name
        emit('update:modelValue', name)
      }
    } catch (err) {
      // beforeLeave rejected or threw — stay on current tab
      console.error('[ZcTabs] beforeLeave error:', err)
    }
  }
}

function handleRemove(name: string | number, e: MouseEvent) {
  e.stopPropagation()
  emit('tab-remove', name)
  emit('edit', name, 'remove')
}

function handleAdd() {
  emit('tab-add')
  emit('edit', undefined, 'add')
}

const rootClasses = computed(() => [
  ns.b(),
  ns.m(props.type || 'default'),
  ns.m(`position-${props.position}`),
])

const navClasses = computed(() => [ns.e('nav-wrap'), ns.is(props.position)])

// ---- Keyboard navigation ----
const navRef = shallowRef<HTMLElement>()

function getEnabledTabs(): HTMLElement[] {
  if (!navRef.value) return []
  return Array.from(navRef.value.querySelectorAll<HTMLElement>('[role="tab"]:not(.is-disabled)'))
}

function focusTab(tab: HTMLElement) {
  tab.focus()
  const name = tab.getAttribute('data-name')
  if (name !== null) {
    const nameVal = isNaN(Number(name)) ? name : Number(name)
    const pane = panes.value.find((p) => String(p.name) === String(nameVal))
    if (pane) handleClick(nameVal as string | number, new MouseEvent('click'), pane.disabled)
  }
}

function handleKeydown(event: KeyboardEvent) {
  const tabs = getEnabledTabs()
  if (tabs.length === 0) return

  const currentIndex = tabs.findIndex((t) => t === document.activeElement)
  const isHorizontal = props.position === 'top' || props.position === 'bottom'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

  switch (event.key) {
    case nextKey: {
      event.preventDefault()
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length
      focusTab(tabs[nextIndex])
      break
    }
    case prevKey: {
      event.preventDefault()
      const nextIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1
      focusTab(tabs[nextIndex])
      break
    }
    case 'Home': {
      event.preventDefault()
      focusTab(tabs[0])
      break
    }
    case 'End': {
      event.preventDefault()
      focusTab(tabs[tabs.length - 1])
      break
    }
    case 'Delete': {
      const tab = tabs[currentIndex]
      const name = tab?.getAttribute('data-name')
      if (name !== null && (props.closable || props.editable)) {
        const nameVal = isNaN(Number(name)) ? name : Number(name)
        emit('tab-remove', nameVal as string | number)
        emit('edit', nameVal as string | number, 'remove')
      }
      break
    }
  }
}
</script>

<template>
  <div :class="rootClasses">
    <div :class="navClasses">
      <div ref="navRef" :class="ns.e('nav')" role="tablist" @keydown="handleKeydown">
        <div
          v-for="pane in panes"
          :id="`zc-tab-${pane.uid}`"
          :key="pane.uid"
          role="tab"
          :class="[
            ns.e('tab'),
            ns.is('active', pane.name === currentName),
            ns.is('disabled', pane.disabled),
            ns.is('closable', pane.closable || closable),
          ]"
          :data-name="pane.name"
          :aria-selected="pane.name === currentName"
          :aria-controls="`zc-tabpane-${pane.uid}`"
          :aria-disabled="pane.disabled ? 'true' : undefined"
          :tabindex="pane.disabled ? -1 : pane.name === currentName ? 0 : -1"
          @click="handleClick(pane.name, $event, pane.disabled)"
          @keydown.enter.prevent="
            handleClick(pane.name, $event as unknown as MouseEvent, pane.disabled)
          "
          @keydown.space.prevent="
            handleClick(pane.name, $event as unknown as MouseEvent, pane.disabled)
          "
        >
          <span :class="ns.e('tab-label')">{{ pane.title }}</span>
          <span
            v-if="pane.closable || closable"
            :class="ns.e('tab-close')"
            role="button"
            aria-label="关闭标签页"
            @click="handleRemove(pane.name, $event)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              style="width: 12px; height: 12px"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </div>
        <div
          v-if="editable || addable"
          :class="[ns.e('tab'), ns.e('new-tab')]"
          role="button"
          tabindex="0"
          @click="handleAdd"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            style="width: 14px; height: 14px"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </div>
    </div>
    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.zc-tabs {
  display: flex;
  flex-direction: column;
  --zc-tabs-header-color: var(--color-zc-text-primary, #303133);
  --zc-tabs-active-color: var(--color-zc-primary-500, #409eff);
  --zc-tabs-hover-color: var(--color-zc-primary-500, #409eff);
  --zc-tabs-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-tabs-item-padding: 20px;
  --zc-tabs-item-height: 40px;
  --zc-tabs-font-size: var(--text-zc-base, 14px);
  --zc-tabs-active-bar-color: var(--color-zc-primary-500, #409eff);
  --zc-tabs-content-padding: 15px;
  --zc-tabs-card-bg-color: var(--color-zc-bg-base, #fff);
  --zc-tabs-card-active-bg-color: var(--color-zc-bg-base, #fff);
  --zc-tabs-card-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-tabs-tab-gap: 4px;
  --zc-tabs-close-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-tabs-close-hover-color: var(--color-zc-text-primary, #303133);
}

.zc-tabs--position-left {
  flex-direction: row;
}

.zc-tabs--position-right {
  flex-direction: row-reverse;
}

.zc-tabs--position-bottom {
  flex-direction: column-reverse;
}

.zc-tabs__nav-wrap {
  overflow: hidden;
  margin-bottom: -1px;
  position: relative;
}

.zc-tabs--position-bottom .zc-tabs__nav-wrap {
  margin-bottom: 0;
  margin-top: -1px;
}

.zc-tabs--position-left .zc-tabs__nav-wrap,
.zc-tabs--position-right .zc-tabs__nav-wrap {
  flex-shrink: 0;
  margin-bottom: 0;
}

.zc-tabs__nav {
  display: flex;
  border-bottom: 1px solid var(--zc-tabs-border-color);
  position: relative;
}

.zc-tabs--position-bottom .zc-tabs__nav {
  border-bottom: none;
  border-top: 1px solid var(--zc-tabs-border-color);
}

.zc-tabs--position-left .zc-tabs__nav,
.zc-tabs--position-right .zc-tabs__nav {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid var(--zc-tabs-border-color);
}

.zc-tabs--position-right .zc-tabs__nav {
  border-right: none;
  border-left: 1px solid var(--zc-tabs-border-color);
}

.zc-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: var(--zc-tabs-tab-gap);
  padding: 0 var(--zc-tabs-item-padding);
  height: var(--zc-tabs-item-height);
  line-height: var(--zc-tabs-item-height);
  font-size: var(--zc-tabs-font-size);
  color: var(--zc-tabs-header-color);
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--radius-zc-base, 4px) var(--radius-zc-base, 4px) 0 0;
  transition: color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  user-select: none;
  position: relative;
}

.zc-tabs__tab:hover {
  color: var(--zc-tabs-hover-color);
}

.zc-tabs__tab.is-active {
  color: var(--zc-tabs-active-color);
}

.zc-tabs__tab.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-tabs__tab.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--zc-tabs-active-bar-color);
  border-radius: 2px;
}

.zc-tabs--position-bottom .zc-tabs__tab.is-active::after {
  bottom: auto;
  top: -1px;
}

.zc-tabs--position-left .zc-tabs__tab,
.zc-tabs--position-right .zc-tabs__tab {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 0;
}

.zc-tabs--position-left .zc-tabs__tab.is-active::after,
.zc-tabs--position-right .zc-tabs__tab.is-active::after {
  left: auto;
  right: -1px;
  top: 0;
  bottom: 0;
  width: 2px;
  height: auto;
}

.zc-tabs--position-left .zc-tabs__tab.is-active::after {
  left: -1px;
  right: auto;
}

.zc-tabs__tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-zc-text-placeholder, #a8abb2);
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-tabs__tab-close:hover {
  color: var(--color-zc-text-primary, #303133);
  background-color: var(--color-zc-fill-base, #f0f2f5);
}

.zc-tabs__new-tab {
  color: var(--color-zc-text-regular, #606266);
  border: 1px dashed var(--color-zc-border-base, #dcdfe6);
  height: 28px;
  line-height: 28px;
  border-radius: var(--radius-zc-base, 4px);
  margin: 6px 0 0 6px;
}

.zc-tabs__new-tab:hover {
  color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
}

/* Card type */
.zc-tabs--card > .zc-tabs__nav-wrap .zc-tabs__nav {
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-bottom: none;
  border-radius: var(--radius-zc-base, 4px) var(--radius-zc-base, 4px) 0 0;
}

.zc-tabs--card .zc-tabs__tab {
  border-left: 1px solid var(--color-zc-border-light, #e4e7ed);
}

.zc-tabs--card .zc-tabs__tab:first-child {
  border-left: none;
}

.zc-tabs--card .zc-tabs__tab.is-active {
  background-color: var(--color-zc-bg-base, #fff);
  border-bottom-color: #fff !important;
}

.zc-tabs--card .zc-tabs__tab.is-active::after {
  display: none;
}

/* Border card type */
.zc-tabs--border-card {
  background: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  border-radius: var(--radius-zc-base, 4px);
  overflow: hidden;
}

.zc-tabs--border-card > .zc-tabs__nav-wrap {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-bottom: 1px solid var(--color-zc-border-light, #e4e7ed);
  margin-bottom: 0;
}

.zc-tabs--border-card .zc-tabs__nav {
  border: none;
}

.zc-tabs--border-card .zc-tabs__tab {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0;
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-tabs--border-card .zc-tabs__tab.is-active {
  background-color: var(--color-zc-bg-base, #fff);
  border-color: var(--color-zc-border-light, #e4e7ed);
}

.zc-tabs--border-card .zc-tabs__tab.is-active::after {
  display: none;
}

.zc-tabs__content {
  overflow: hidden;
  position: relative;
  flex: 1;
}

.zc-tabs--border-card > .zc-tabs__content {
  padding: 15px;
}
</style>
