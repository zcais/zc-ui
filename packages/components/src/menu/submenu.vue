<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, watch, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { usePopper } from '../popper/usePopper'
import { MENU_KEY, SUBMENU_KEY, type MenuContext, type SubmenuContext } from './types'

defineOptions({ name: 'ZcSubmenu' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier */
    index?: string
    /** Popup class for popup mode */
    popperClass?: string
    /** Show/hide delay (ms) for popup mode */
    showTimeout?: number
    /** Hide delay (ms) for popup mode */
    hideTimeout?: number
    /** Disable the submenu */
    disabled?: boolean
    /** Teleport the popup to body (popup mode only) */
    teleported?: boolean
  }>(),
  {
    index: '',
    popperClass: '',
    showTimeout: 300,
    hideTimeout: 300,
    disabled: false,
    teleported: false,
  }
)

const ns = useNamespace('submenu')

const menuCtx = inject<MenuContext | null>(MENU_KEY, null)
const parentSubmenuCtx = inject<SubmenuContext | null>(SUBMENU_KEY, null)

/** True when the submenu expands inline (vertical, not collapsed) */
const isInline = computed(
  () => !!menuCtx && menuCtx.mode.value === 'vertical' && !menuCtx.collapse.value
)

/** True when the submenu opens as a floating popup (horizontal or collapsed) */
const isPopup = computed(
  () => !!menuCtx && (menuCtx.mode.value === 'horizontal' || menuCtx.collapse.value)
)

/** True when popups open on hover (default) rather than click */
const hoverTrigger = computed(() => isPopup.value && menuCtx?.menuTrigger.value !== 'click')

const isOpened = computed(() => {
  return menuCtx?.isMenuOpened ? menuCtx.isMenuOpened(props.index) : false
})

// Full chain from the root menu down to this submenu, e.g. ['2', '2-1'].
const indexPath = computed(() => {
  const parentPath = parentSubmenuCtx?.indexPath.value ?? []
  return [...parentPath, props.index]
})

const level = computed(() => (parentSubmenuCtx ? parentSubmenuCtx.level.value + 1 : 0))

provide<SubmenuContext>(SUBMENU_KEY, { indexPath, level })

// A submenu title is highlighted when any descendant item is active
const isActive = computed(() => {
  const active = menuCtx?.activeIndex.value
  if (!active || !menuCtx) return false
  if (active === props.index) return true
  return menuCtx.activeIndexPath.value.some((seg) => seg === props.index && active.startsWith(seg))
})

const submenuClasses = computed(() => [
  ns.b(),
  ns.is('active', isActive.value),
  ns.is('opened', isOpened.value),
  ns.is('disabled', props.disabled),
])

const titleClasses = computed(() => [ns.e('title'), ns.is('disabled', props.disabled)])

const arrowClasses = computed(() => [ns.e('icon-arrow'), ns.is('open', isOpened.value)])

function open() {
  if (props.disabled) return
  menuCtx?.openMenu(props.index, indexPath.value)
}

function close() {
  if (props.disabled) return
  menuCtx?.closeMenu(props.index, indexPath.value)
}

function handleClick() {
  if (props.disabled) return
  // Inline submenus always toggle on click. Horizontal hover-triggered
  // popups ignore title clicks (Element Plus behavior); collapsed popups and
  // click-triggered popups do toggle so touch devices can open them.
  if (isPopup.value && menuCtx?.mode.value === 'horizontal' && hoverTrigger.value) {
    return
  }
  if (isOpened.value) close()
  else open()
}

let timeout: ReturnType<typeof setTimeout> | null = null

function handleMouseenter() {
  if (props.disabled) return
  if (!hoverTrigger.value) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(open, props.showTimeout)
}

function handleMouseleave() {
  if (props.disabled) return
  if (!hoverTrigger.value) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(close, props.hideTimeout)
}

// The popup may be teleported to <body>, so moving the pointer from the title
// into the panel fires a mouseleave on the <li>. The panel shares the same
// open/close timers so the hover chain stays alive across the teleport gap.
function handlePopupMouseenter() {
  if (timeout) clearTimeout(timeout)
}

function handlePopupMouseleave() {
  if (!hoverTrigger.value) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(close, props.hideTimeout)
}

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
})

// ---- Popup positioning via the shared popper engine ----
const titleRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)

// Top-level submenus in a horizontal bar drop down; everything else (nested
// submenus, collapsed side-bar submenus) flies out to the right of the title.
const placement = computed(() => {
  if (!menuCtx) return 'bottom-start' as const
  if (menuCtx.mode.value === 'horizontal' && level.value === 0) return 'bottom-start' as const
  return 'right-start' as const
})

const { styles: popupStyles, update: updatePopper } = usePopper({
  reference: titleRef,
  popper: popupRef,
  placement,
  offset: computed(() => menuCtx?.popperOffset.value ?? 6),
  strategy: 'fixed',
  visible: isOpened,
})

// 'dark' popper effect paints the floating panel with dark tokens.
const effectClass = computed(() =>
  menuCtx && menuCtx.popperEffect.value === 'dark' ? ns.m('dark') : ''
)

watch(isOpened, (opened) => {
  if (opened) nextTick(() => updatePopper())
})
</script>

<template>
  <li
    :class="submenuClasses"
    role="menuitem"
    :aria-haspopup="'menu'"
    :aria-expanded="isOpened"
    :aria-disabled="disabled"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div
      ref="titleRef"
      :class="titleClasses"
      :tabindex="disabled ? -1 : 0"
      @click="handleClick"
      @keydown.enter.prevent="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <slot name="title" />
      <span :class="arrowClasses">
        <svg
          v-if="menuCtx?.mode?.value === 'horizontal'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
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
          style="width: 12px; height: 12px"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>
    </div>
    <Transition v-if="isInline" name="zc-menu-collapse">
      <ul
        v-show="isOpened"
        :class="ns.e('children')"
        :style="{ '--zc-submenu-level': level }"
        role="menu"
      >
        <slot />
      </ul>
    </Transition>
    <Teleport v-else-if="props.teleported" to="body">
      <Transition name="zc-submenu-dropdown">
        <ul
          v-show="isOpened"
          ref="popupRef"
          :class="[ns.e('children'), ns.e('children--popup'), effectClass, popperClass]"
          :style="[popupStyles, { '--zc-submenu-level': level }]"
          role="menu"
          @mouseenter="handlePopupMouseenter"
          @mouseleave="handlePopupMouseleave"
        >
          <slot />
        </ul>
      </Transition>
    </Teleport>
    <Transition v-else name="zc-submenu-dropdown">
      <ul
        v-show="isOpened"
        ref="popupRef"
        :class="[ns.e('children'), ns.e('children--popup'), effectClass, popperClass]"
        :style="[popupStyles, { '--zc-submenu-level': level }]"
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
  /* Colors resolve from the menu-root CSS variables so text-color /
     active-text-color (e.g. dark sidebars) apply to submenu titles too;
     unset props fall back to the light-theme tokens defined on .zc-menu. */
  color: var(--zc-menu-text-color, var(--color-zc-text-primary, #303133));
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

.zc-submenu__title:not(.is-disabled):hover {
  background-color: var(--zc-menu-hover-bg-color, var(--color-zc-fill-light, #f5f7fa));
}

.zc-submenu__title.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zc-submenu__title.is-disabled:hover {
  background: none;
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

/* Inline children (vertical, not collapsed) flatten into the sidebar: no
   border/shadow/radius, transparent background so custom menu backgrounds
   (e.g. dark sidebars) show through. Hierarchy is expressed by indentation
   below instead of a floating card. */
.zc-submenu__children {
  list-style: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
}

/* Popup children (horizontal dropdown / collapsed flyout) are real floating
   cards. border-box keeps min-width inclusive of the border so the panel
   never exceeds the 200px sidebar. */
.zc-submenu__children--popup {
  z-index: var(--z-zc-dropdown, 1000);
  min-width: 200px;
  box-sizing: border-box;
  padding: 4px 0;
  background-color: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
}

/* 'dark' popper effect */
.zc-submenu--dark {
  background-color: var(--color-zc-bg-inverse, #1f2329);
  border-color: var(--color-zc-border-dark, #364152);
}

.zc-submenu--dark :deep(.zc-menu__item) {
  color: var(--color-zc-text-inverse, #e5eaf3);
  background-color: transparent;
}

.zc-submenu--dark :deep(.zc-menu__item:not(.is-disabled):hover) {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--color-zc-text-inverse, #e5eaf3);
}

.zc-submenu--dark :deep(.zc-menu__item.is-active) {
  color: var(--color-zc-primary-400, #79bbff);
}

/* Indent children by nesting depth (inline mode only; popup items keep flat
   padding). --zc-submenu-level is bound on the children <ul> by the template
   (0 for a top-level submenu), each nesting step adds 20px. :deep() is
   required — the items/titles are slotted children without this component's
   scoped data-v attribute. */
.zc-submenu__children:not(.zc-submenu__children--popup) :deep(.zc-menu__item),
.zc-submenu__children:not(.zc-submenu__children--popup) :deep(.zc-submenu__title) {
  padding-left: calc(20px + (var(--zc-submenu-level, 0) + 1) * 20px);
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
  color: var(--zc-menu-active-color, var(--color-zc-primary-500, #409eff));
}
</style>
