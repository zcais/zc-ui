<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref } from 'vue'
import { useNamespace, useOptionalRouter } from '@zc-ui/hooks'
import { MENU_KEY, SUBMENU_KEY, type MenuContext, type SubmenuContext } from './types'

defineOptions({ name: 'ZcMenuItem' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier */
    index?: string
    /** Disable the item */
    disabled?: boolean
    /** Route location pushed by router mode (falls back to `index`) */
    route?: string | object
  }>(),
  {
    index: '',
    disabled: false,
    route: undefined,
  }
)

const ns = useNamespace('menu')

const menuCtx = inject<MenuContext | null>(MENU_KEY, null)
const submenuCtx = inject<SubmenuContext | null>(SUBMENU_KEY, null)

const router = useOptionalRouter()

const isActive = computed(() => menuCtx?.activeIndex.value === props.index)

const indexPath = computed(() => {
  const parentPath = submenuCtx?.indexPath.value ?? []
  return [...parentPath, props.index]
})

const itemClasses = computed(() => [
  ns.e('item'),
  ns.is('active', isActive.value),
  ns.is('disabled', props.disabled),
])

function handleClick() {
  if (props.disabled) return
  if (props.index) {
    menuCtx?.selectItem(props.index, indexPath.value)
  }
  // Router mode: navigate after selection (route wins, index is the fallback)
  if (menuCtx?.routerEnabled.value) {
    const target = props.route ?? props.index
    if (target) router.value?.push(target)
  }
}

// ---- Register with the menu for the horizontal ellipsis measurement ----
const rootEl = ref<HTMLElement | null>(null)
const registeredKey = computed(() => (props.index && !submenuCtx ? props.index : ''))

onMounted(() => {
  if (!menuCtx?.registerItem || !registeredKey.value || !rootEl.value) return
  menuCtx.registerItem(registeredKey.value, rootEl.value)
})

onBeforeUnmount(() => {
  if (!menuCtx?.unregisterItem || !registeredKey.value) return
  menuCtx.unregisterItem(registeredKey.value)
})
</script>

<template>
  <li
    ref="rootEl"
    :class="itemClasses"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <slot />
  </li>
</template>

<style scoped>
.zc-menu__item {
  /* Component-level CSS variables (global token defaults) */
  --zc-menu-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-menu-hover-text-color: var(--color-zc-text-primary, #303133);
  --zc-menu-active-color: var(--color-zc-primary-500, #409eff);

  display: flex;
  align-items: center;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  font-size: var(--text-zc-base, 14px);
  color: var(--zc-menu-text-color, var(--color-zc-text-primary, #303133));
  cursor: pointer;
  list-style: none;
  white-space: nowrap;
  transition:
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  box-sizing: border-box;
}

.zc-menu__item:not(.is-disabled):hover {
  background-color: var(--zc-menu-hover-bg-color);
  color: var(--zc-menu-hover-text-color);
}

.zc-menu__item.is-active {
  color: var(--zc-menu-active-color);
}

.zc-menu--horizontal > .zc-menu__item {
  border-bottom: 2px solid transparent;
  height: 60px;
  line-height: 60px;
  flex-shrink: 0;
}

.zc-menu--horizontal > .zc-menu__item.is-active {
  border-bottom-color: var(--color-zc-primary-500, #409eff);
}

.zc-menu__item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zc-menu__item.is-disabled:hover {
  background: none;
}
</style>
