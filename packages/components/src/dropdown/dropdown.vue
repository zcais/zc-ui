<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, provide, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { DropdownTrigger, DropdownPlacement } from './types'
import { DROPDOWN_KEY } from './types'

defineOptions({ name: 'ZcDropdown' })

const props = withDefaults(
  defineProps<{
    /** Trigger method */
    trigger?: DropdownTrigger
    /** Visibility (v-model) */
    visible?: boolean
    /** Placement relative to trigger */
    placement?: DropdownPlacement
    /** Disable the dropdown */
    disabled?: boolean
    /** Show/hide delay (ms) */
    showTimeout?: number
    hideTimeout?: number
    /** Custom popper class */
    popperClass?: string
    /** Hide on click outside */
    hideOnClick?: boolean
    /** Maximum height of the dropdown menu */
    maxHeight?: string
  }>(),
  {
    trigger: 'hover',
    visible: false,
    placement: 'bottom',
    disabled: false,
    showTimeout: 250,
    hideTimeout: 150,
    popperClass: '',
    hideOnClick: true,
    maxHeight: '',
  }
)

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
  (e: 'command', command: string | number | object): void
  (e: 'click', event: MouseEvent): void
}>()

const ns = useNamespace('dropdown')

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const internalVisible = ref(props.visible)
let timeout: ReturnType<typeof setTimeout> | null = null

const GAP = 8 // px gap between trigger and dropdown

/** Dynamically compute dropdown position based on trigger element rect */
const popperPosition = ref<Record<string, string>>({})

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const winH = window.innerHeight
  const winW = window.innerWidth

  const placements: Record<string, Record<string, string>> = {
    top: {
      left: `${rect.left + rect.width / 2}px`,
      bottom: `${winH - rect.top + GAP}px`,
      transform: 'translateX(-50%)',
    },
    'top-start': {
      left: `${rect.left}px`,
      bottom: `${winH - rect.top + GAP}px`,
    },
    'top-end': {
      right: `${winW - rect.right}px`,
      bottom: `${winH - rect.top + GAP}px`,
    },
    bottom: {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + GAP}px`,
      transform: 'translateX(-50%)',
    },
    'bottom-start': {
      left: `${rect.left}px`,
      top: `${rect.bottom + GAP}px`,
    },
    'bottom-end': {
      right: `${winW - rect.right}px`,
      top: `${rect.bottom + GAP}px`,
    },
  }
  const result = { ...(placements[props.placement] || placements.bottom) }
  if (props.maxHeight) result.maxHeight = props.maxHeight
  popperPosition.value = result
}

function show() {
  if (props.disabled) return
  if (timeout) clearTimeout(timeout)
  internalVisible.value = true
  emit('update:visible', true)
  emit('show')
}

function hide() {
  if (timeout) clearTimeout(timeout)
  internalVisible.value = false
  emit('update:visible', false)
  emit('hide')
}

function handleShowDelayed() {
  if (props.disabled) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => show(), props.showTimeout)
}

function handleHideDelayed() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => hide(), props.hideTimeout)
}

function handleToggle() {
  if (props.disabled) return
  if (internalVisible.value) hide()
  else show()
}

function handleContextmenu(e: MouseEvent) {
  if (props.trigger !== 'contextmenu') return
  e.preventDefault()
  show()
}

function handleClick(e: MouseEvent) {
  emit('click', e)
  if (props.trigger === 'click') {
    handleToggle()
  }
}

// Document click handler
function onDocumentClick(e: MouseEvent) {
  if (!props.hideOnClick) return
  if (props.trigger === 'contextmenu') return
  if (props.trigger !== 'click') return
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || popperRef.value?.contains(target)) return
  if (internalVisible.value) hide()
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onDocumentClick, true)
}

watch(
  () => props.visible,
  (val) => {
    internalVisible.value = val
  }
)

// Update position whenever the dropdown becomes visible
watch(internalVisible, async (visible) => {
  if (visible) {
    await nextTick()
    updatePosition()
  }
})

onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick, true)
  }
})

// Provide command handler to dropdown items
provide(DROPDOWN_KEY, {
  handleCommand: (command: string | number | object) => {
    emit('command', command)
    if (props.hideOnClick) hide()
  },
  hide,
})

const triggerEvents = computed(() => {
  const events: Record<string, (e: Event) => void> = {}
  if (props.trigger === 'hover') {
    events.onMouseenter = handleShowDelayed as (e: Event) => void
    events.onMouseleave = handleHideDelayed as (e: Event) => void
  }
  if (props.trigger === 'click') {
    events.onClick = handleClick as (e: Event) => void
  }
  if (props.trigger === 'contextmenu') {
    events.onContextmenu = handleContextmenu as (e: Event) => void
  }
  return events
})
</script>

<template>
  <div
    ref="triggerRef"
    :class="ns.b()"
    :aria-haspopup="'menu'"
    :aria-expanded="internalVisible"
    v-bind="triggerEvents"
  >
    <slot />
    <Teleport to="body" :disabled="!internalVisible">
      <Transition name="zc-dropdown">
        <div
          v-if="internalVisible"
          ref="popperRef"
          :class="[ns.e('menu'), ns.e('menu--' + placement), popperClass]"
          :style="popperPosition"
          role="menu"
          @mouseenter="trigger === 'hover' && handleShowDelayed()"
          @mouseleave="trigger === 'hover' && handleHideDelayed()"
        >
          <slot name="dropdown" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.zc-dropdown {
  --zc-dropdown-menu-bg-color: var(--color-zc-bg-base, #fff);
  --zc-dropdown-menu-border-color: var(--color-zc-border-lighter, #ebeef5);
  --zc-dropdown-menu-border-radius: var(--radius-zc-base, 4px);
  --zc-dropdown-menu-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-dropdown-menu-padding: 6px 0;
  --zc-dropdown-item-text-color: var(--color-zc-text-regular, #606266);
  --zc-dropdown-item-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-dropdown-item-hover-text-color: var(--color-zc-primary-500, #409eff);
  --zc-dropdown-item-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-dropdown-item-font-size: var(--text-zc-base, 14px);
  --zc-dropdown-item-padding: 0 16px;
  --zc-dropdown-item-height: 36px;
  --zc-dropdown-divider-color: var(--color-zc-border-lighter, #ebeef5);

  display: inline-flex;
  position: relative;
  color: inherit;
}

.zc-dropdown__menu {
  position: fixed;
  z-index: var(--z-zc-dropdown, 1000);
  min-width: 160px;
  padding: var(--zc-dropdown-menu-padding);
  background: var(--zc-dropdown-menu-bg-color);
  border: 1px solid var(--zc-dropdown-menu-border-color);
  border-radius: var(--zc-dropdown-menu-border-radius);
  box-shadow: var(--zc-dropdown-menu-box-shadow);
  overflow-y: auto;
}

.zc-dropdown-enter-active,
.zc-dropdown-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-dropdown-enter-from,
.zc-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
