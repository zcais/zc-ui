<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { MENU_KEY, type MenuContext } from './types'

defineOptions({ name: 'ZcMenuItem' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier */
    index?: string
    /** Disable the item */
    disabled?: boolean
  }>(),
  {
    index: '',
    disabled: false,
  }
)

const ns = useNamespace('menu')

const menuCtx = inject(MENU_KEY, {
  activeIndex: ref(''),
  mode: ref('vertical'),
  collapse: ref(false),
  backgroundColor: ref(''),
  textColor: ref(''),
  activeTextColor: ref(''),
  selectItem: () => {},
} as unknown as MenuContext)

const isActive = computed(() => menuCtx.activeIndex.value === props.index)

const itemClasses = computed(() => [
  ns.e('item'),
  ns.is('active', isActive.value),
  ns.is('disabled', props.disabled),
])

const itemStyle = computed(() => {
  const style: Record<string, string> = {}
  if (menuCtx.textColor.value) style.color = menuCtx.textColor.value
  if (isActive.value && menuCtx.activeTextColor.value) {
    style.color = menuCtx.activeTextColor.value
  }
  if (menuCtx.backgroundColor.value) {
    style.backgroundColor = menuCtx.backgroundColor.value
  }
  return style
})

function handleClick() {
  if (props.disabled) return
  if (props.index) {
    menuCtx.selectItem(props.index, [props.index])
  }
}
</script>

<template>
  <li
    :class="itemClasses"
    :style="itemStyle"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <slot />
  </li>
</template>

<style scoped>
.zc-menu__item {
  display: flex;
  align-items: center;
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-primary, #303133);
  cursor: pointer;
  list-style: none;
  white-space: nowrap;
  transition:
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  box-sizing: border-box;
}

.zc-menu__item:hover {
  background-color: var(--zc-menu-item-hover-bg-color);
}

.zc-menu__item.is-active {
  color: var(--zc-menu-item-active-color);
}

.zc-menu--horizontal > .zc-menu__item {
  border-bottom: 2px solid transparent;
  height: 60px;
  line-height: 60px;
}

.zc-menu--horizontal > .zc-menu__item.is-active {
  border-bottom-color: var(--color-zc-primary-500, #409eff);
}

.zc-menu__item.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: none !important;
}

.zc-menu--horizontal > .zc-menu__item {
  flex-shrink: 0;
}
</style>
