<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useZIndex } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import type { ContextMenuItem } from './types'

defineOptions({ name: 'ZcContextMenu' })

const props = withDefaults(
  defineProps<{
    /** Menu items */
    items?: ContextMenuItem[]
    /** Whether visible (v-model) */
    visible?: boolean
    /** X position */
    x?: number
    /** Y position */
    y?: number
    /** Min width */
    minWidth?: number
    /** Max width */
    maxWidth?: number
  }>(),
  {
    items: () => [],
    visible: false,
    x: 0,
    y: 0,
    minWidth: 160,
    maxWidth: 300,
  }
)

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'select', item: ContextMenuItem): void
}>()

const ns = useNamespace('context-menu')
const { nextZIndex } = useZIndex()

const menuRef = ref<HTMLElement>()
const actualX = ref(props.x)
const actualY = ref(props.y)
const zIndex = ref(nextZIndex())

const menuStyle = computed(() => ({
  left: `${actualX.value}px`,
  top: `${actualY.value}px`,
  minWidth: `${props.minWidth}px`,
  maxWidth: `${props.maxWidth}px`,
  zIndex: zIndex.value,
}))

/** Adjust position to keep menu within viewport */
function adjustPosition() {
  if (!menuRef.value) return
  const rect = menuRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (actualX.value + rect.width > vw) {
    actualX.value = Math.max(0, vw - rect.width - 8)
  }
  if (actualY.value + rect.height > vh) {
    actualY.value = Math.max(0, vh - rect.height - 8)
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      actualX.value = props.x
      actualY.value = props.y
      zIndex.value = nextZIndex()
      // Adjust after render
      setTimeout(adjustPosition, 0)
    }
  }
)

/** Click outside to close */
useClickOutside(menuRef, () => {
  if (props.visible) {
    emit('update:visible', false)
  }
})

function handleItemClick(item: ContextMenuItem) {
  if (item.disabled) return
  emit('select', item)
  emit('update:visible', false)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('update:visible', false)
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body" :disabled="!visible">
    <Transition name="zc-context-menu">
      <div
        v-if="visible"
        ref="menuRef"
        :class="ns.e('wrapper')"
        :style="menuStyle"
        @keydown="handleKeydown"
        @click.stop
        @contextmenu.prevent
      >
        <template v-for="item in items" :key="item.key">
          <!-- Divider -->
          <div v-if="item.divided" :class="ns.e('divider')" />
          <!-- Menu item -->
          <div
            :class="[ns.e('item'), ns.is('disabled', item.disabled), ns.is('danger', item.danger)]"
            @click="handleItemClick(item)"
          >
            <span v-if="item.icon" :class="ns.e('item-icon')">
              <i v-if="item.icon.startsWith('zc')" :class="item.icon" />
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span :class="ns.e('item-label')">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zc-context-menu__wrapper {
  position: fixed;
  background: var(--color-zc-bg-base, #fff);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  user-select: none;
}

.zc-context-menu__divider {
  height: 1px;
  background: var(--color-zc-border-light, #e4e7ed);
  margin: 4px 0;
}

.zc-context-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-regular, #606266);
  cursor: pointer;
  transition: background 0.15s;
}

.zc-context-menu__item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-context-menu__item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-context-menu__item.is-disabled:hover {
  background: transparent;
}

.zc-context-menu__item.is-danger {
  color: var(--color-zc-danger, #f56c6c);
}

.zc-context-menu__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.zc-context-menu__item-icon svg {
  width: 14px;
  height: 14px;
}

.zc-context-menu__item-label {
  flex: 1;
}

/* Transition */
.zc-context-menu-enter-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.zc-context-menu-leave-active {
  transition: opacity 0.1s;
}
.zc-context-menu-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.zc-context-menu-leave-to {
  opacity: 0;
}
</style>
