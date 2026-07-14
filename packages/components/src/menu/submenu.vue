<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { MENU_KEY } from './types'

defineOptions({ name: 'ZcSubmenu' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier */
    index?: string
    /** Popup class for collapsed mode */
    popperClass?: string
    /** Show/hide delay (ms) for horizontal mode */
    showTimeout?: number
    hideTimeout?: number
    /** Disable the submenu */
    disabled?: boolean
  }>(),
  {
    index: '',
    popperClass: '',
    showTimeout: 300,
    hideTimeout: 300,
    disabled: false,
  }
)

const ns = useNamespace('submenu')

const menuCtx = inject(MENU_KEY, null)!

const isOpened = computed(() => {
  return menuCtx?.isMenuOpened ? menuCtx.isMenuOpened(props.index) : false
})

const submenuClasses = computed(() => [
  ns.b(),
  ns.is('active', menuCtx.activeIndex?.value === props.index || false),
  ns.is('opened', isOpened.value),
  ns.is('disabled', props.disabled),
])

const titleClasses = computed(() => [ns.e('title'), ns.is('disabled', props.disabled)])

const arrowClasses = computed(() => [ns.e('icon-arrow'), ns.is('open', isOpened.value)])

function handleClick() {
  if (props.disabled) return
  if (menuCtx.mode?.value === 'horizontal') return
  if (menuCtx.collapse?.value) return

  if (isOpened.value) {
    menuCtx.closeMenu?.(props.index, [props.index])
  } else {
    menuCtx.openMenu?.(props.index, [props.index])
  }
}

let timeout: ReturnType<typeof setTimeout> | null = null

function handleMouseenter() {
  if (props.disabled) return
  if (menuCtx.mode?.value !== 'horizontal') return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    menuCtx.openMenu?.(props.index, [props.index])
  }, props.showTimeout)
}

function handleMouseleave() {
  if (props.disabled) return
  if (menuCtx.mode?.value !== 'horizontal') return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    menuCtx.closeMenu?.(props.index, [props.index])
  }, props.hideTimeout)
}

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
})
</script>

<template>
  <li
    :class="submenuClasses"
    role="menuitem"
    :aria-haspopup="'menu'"
    :aria-expanded="isOpened"
    :aria-disabled="props.disabled"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div
      :class="titleClasses"
      :tabindex="props.disabled ? -1 : 0"
      @click="handleClick"
      @keydown.enter.prevent="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <slot name="title" />
      <span :class="arrowClasses">
        <svg
          v-if="menuCtx.mode?.value === 'horizontal'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="width: 12px; height: 12px"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="width: 12px; height: 12px"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>
    </div>
    <Transition v-if="menuCtx.mode?.value !== 'horizontal'" name="zc-menu-collapse">
      <ul v-show="isOpened" :class="ns.e('children')" role="menu">
        <slot />
      </ul>
    </Transition>
    <Transition v-else name="zc-submenu-dropdown">
      <ul
        v-show="isOpened"
        :class="[ns.e('children'), ns.e('children--popup'), popperClass]"
        role="menu"
      >
        <slot />
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.zc-submenu {
  --zc-submenu-bg-color: var(--color-zc-bg-base, #fff);
  --zc-submenu-text-color: var(--color-zc-text-primary, #303133);
  --zc-submenu-title-color: var(--color-zc-text-primary, #303133);
  --zc-submenu-title-height: 56px;
  --zc-submenu-title-padding: 0 20px;
  --zc-submenu-icon-color: var(--color-zc-text-secondary, #909399);

  list-style: none;
  position: relative;
}

.zc-submenu__title {
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
  gap: 4px;
}

.zc-submenu__title:hover {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

.zc-submenu__title.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zc-submenu__icon-arrow {
  margin-left: auto;
  display: inline-flex;
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-submenu__icon-arrow.is-open {
  transform: rotate(90deg);
}

.zc-menu--horizontal > .zc-submenu {
  flex-shrink: 0;
}

.zc-menu--horizontal > .zc-submenu .zc-submenu__title {
  border-bottom: 2px solid transparent;
  height: 60px;
  line-height: 60px;
}

.zc-menu--horizontal > .zc-submenu .zc-submenu__icon-arrow {
  transform: rotate(0deg);
}

.zc-menu--horizontal > .zc-submenu .zc-submenu__icon-arrow.is-open {
  transform: rotate(180deg);
}

.zc-submenu__children {
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 200px;
  background-color: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
}

.zc-submenu__children--popup {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--z-zc-dropdown, 1000);
}

.zc-submenu__children .zc-menu__item {
  height: 40px;
  line-height: 40px;
}

/* Reset VitePress `.vp-doc li + li { margin-top: 8px }` on nested submenu
   children. :deep() is required because the <li> items are slotted children
   that don't carry this component's scoped data-v attribute. */
.zc-submenu__children :deep(li + li) {
  margin-top: 0;
}

/* Vertical collapse transitions */
.zc-menu-collapse-enter-active,
.zc-menu-collapse-leave-active {
  transition: height var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  overflow: hidden;
}

.zc-submenu-dropdown-enter-active,
.zc-submenu-dropdown-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-submenu-dropdown-enter-from,
.zc-submenu-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.zc-menu--horizontal > .zc-submenu:focus {
  outline: none;
}

.zc-menu--horizontal > .zc-submenu:focus .zc-submenu__title {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-submenu.is-active > .zc-submenu__title {
  color: var(--color-zc-primary-500, #409eff);
}
</style>
