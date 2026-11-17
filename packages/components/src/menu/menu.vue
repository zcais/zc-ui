<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onBeforeUnmount, useSlots } from 'vue'
import { useNamespace, useClickOutside } from '@zc-ui/hooks'
import { usePopper } from '../popper/usePopper'
import type { MenuMode, MenuTrigger, MenuPopperEffect } from './types'
import { MENU_KEY, type MenuContext } from './types'

defineOptions({ name: 'ZcMenu' })

const props = withDefaults(
  defineProps<{
    /** Horizontal or vertical menu */
    mode?: MenuMode
    /** Currently active menu item index (Element Plus compatible name) */
    defaultActive?: string
    /** @deprecated use `default-active` instead */
    activeIndex?: string
    /** Whether the menu is collapsed (vertical mode only) */
    collapse?: boolean
    /** Whether to enable collapse transition animation */
    collapseTransition?: boolean
    /** How popup submenus are opened in horizontal mode */
    menuTrigger?: MenuTrigger
    /** Show the «more» trigger and collapse overflowing items into it (horizontal only) */
    ellipsis?: boolean
    /** Background color */
    backgroundColor?: string
    /** Text color */
    textColor?: string
    /** Active text color */
    activeTextColor?: string
    /** Unique key for opened submenus */
    uniqueOpened?: boolean
    /** Popup theme for popup-mode submenus */
    popperEffect?: MenuPopperEffect
    /** Gap (px) between a popup trigger and its floating panel */
    popperOffset?: number
    /** Whether selecting an item navigates via vue-router */
    router?: boolean
  }>(),
  {
    mode: 'vertical',
    defaultActive: '',
    activeIndex: '',
    collapse: false,
    collapseTransition: true,
    menuTrigger: 'hover',
    ellipsis: false,
    backgroundColor: '',
    textColor: '',
    activeTextColor: '',
    uniqueOpened: false,
    popperEffect: 'light',
    popperOffset: 6,
    router: false,
  }
)

const emit = defineEmits<{
  (e: 'select', index: string, indexPath: string[]): void
  (e: 'open', index: string, indexPath: string[]): void
  (e: 'close', index: string, indexPath: string[]): void
}>()

const ns = useNamespace('menu')

// `default-active` wins; `active-index` is the deprecated alias (both reactive).
const activeIndexRef = ref(props.defaultActive || props.activeIndex)
const activeIndexPathRef = ref<string[]>([])
const openedMenus = ref<Set<string>>(new Set())

watch(
  () => [props.defaultActive, props.activeIndex],
  ([defaultActive, activeIndex]) => {
    const next = defaultActive || activeIndex
    if (next !== activeIndexRef.value) {
      activeIndexRef.value = next
    }
  }
)

const rootClasses = computed(() => [
  ns.b(),
  ns.m(props.mode),
  ns.is('collapse', props.collapse),
  ns.is('collapse-transition', props.collapseTransition),
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
    // Element Plus parity: hovering an item on a custom-colored menu tints
    // the background 20% darker instead of flashing the light theme hover.
    style['--zc-menu-hover-bg-color'] = shadeColor(props.backgroundColor, 0.2)
  }
  if (props.textColor) {
    style['--zc-menu-text-color'] = props.textColor
    // keep hover text readable on custom-colored menus (EP parity:
    // hover-text-color === text-color; the light-theme hover token would
    // flash dark text over a dark sidebar)
    style['--zc-menu-hover-text-color'] = props.textColor
  }
  if (props.activeTextColor) {
    style['--zc-menu-active-color'] = props.activeTextColor
  }
  return style
})

/** Darken `color` by `amount` (0-1), mirroring TinyColor's shade(). */
function shadeColor(color: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim())
  if (!m) return color
  const rgb = Number.parseInt(m[1], 16)
  const mix = (channel: number) => Math.round(channel * (1 - amount))
  return `rgb(${mix(rgb >> 16)}, ${mix((rgb >> 8) & 0xff)}, ${mix(rgb & 0xff)})`
}

// ---- Horizontal ellipsis: measure top-level items, overflow the rest ----
// Items register their natural width (measured while fully laid out) keyed by
// index; overflow math uses these intrinsic widths so hidden items keep
// reporting their original size.
const rootRef = ref<HTMLElement | null>(null)
const itemWidths = new Map<string, number>()
const ellipsisIndex = ref(-1)

const isEllipsisActive = computed(
  () => props.mode === 'horizontal' && props.ellipsis && ellipsisIndex.value >= 0
)

const slots = useSlots()

// Split the default-slot vnodes: the bar renders [0, ellipsisIndex), the
// popup renders the rest. A vnode can only be mounted once, so the two
// ranges never overlap.
const slotItems = computed(() => (slots.default ? slots.default() : []))
// Width-map key sequence aligned 1:1 with slotItems (vnodes without an index
// get a positional key and simply contribute 0 width).
const itemOrder = computed(() =>
  slotItems.value.map((v, i) => (v.props?.index as string) || `@${i}`)
)
const barItems = computed(() =>
  ellipsisIndex.value < 0 ? slotItems.value : slotItems.value.slice(0, ellipsisIndex.value)
)
const overflowItems = computed(() =>
  ellipsisIndex.value < 0 ? [] : slotItems.value.slice(ellipsisIndex.value)
)

function registerItem(index: string, el: HTMLElement) {
  // Record the intrinsic bar width only while the element is a direct child
  // of the menu root — items re-mounted inside the ellipsis popup must not
  // overwrite their bar measurement with the popup list width.
  if (el.offsetWidth > 0 && el.parentElement === rootRef.value) {
    itemWidths.set(index, el.offsetWidth)
  }
  scheduleMeasure()
}

function unregisterItem(index: string) {
  itemWidths.delete(index)
  scheduleMeasure()
}

let measureFrame: number | null = null

function scheduleMeasure() {
  if (measureFrame !== null) return
  measureFrame = requestAnimationFrame(() => {
    measureFrame = null
    calcEllipsis()
  })
}

// Fallback before the «more» trigger is mounted (matches
// --zc-menu-ellipsis-trigger-width in CSS); once rendered, the live
// offsetWidth is used so custom-theme widths stay correct.
const ELLIPSIS_TRIGGER_FALLBACK_WIDTH = 48
// Slack so rounding/sub-pixel gaps never make the trigger overflow.
const ELLIPSIS_SAFETY_MARGIN = 12

function getEllipsisTriggerWidth(): number {
  const live = ellipsisTriggerRef.value?.offsetWidth ?? 0
  return (live || ELLIPSIS_TRIGGER_FALLBACK_WIDTH) + ELLIPSIS_SAFETY_MARGIN
}

function calcEllipsis() {
  if (props.mode !== 'horizontal' || !props.ellipsis || !rootRef.value) {
    ellipsisIndex.value = -1
    return
  }
  const menuWidth = rootRef.value.clientWidth
  const indexes = itemOrder.value
  if (!indexes.length) {
    ellipsisIndex.value = -1
    return
  }
  // Reserve space for the «more» trigger before deciding what overflows.
  let used = getEllipsisTriggerWidth()
  let overflowAt = -1
  for (let i = 0; i < indexes.length; i++) {
    const w = itemWidths.get(indexes[i]) ?? 0
    used += w
    if (used > menuWidth) {
      overflowAt = i
      break
    }
  }
  ellipsisIndex.value = overflowAt
}

// ---- Ellipsis popup ----
const ellipsisVisible = ref(false)
const ellipsisTriggerRef = ref<HTMLElement | null>(null)
const ellipsisPopperRef = ref<HTMLElement | null>(null)

const { styles: ellipsisStyles } = usePopper({
  reference: ellipsisTriggerRef,
  popper: ellipsisPopperRef,
  placement: 'bottom-end',
  offset: computed(() => props.popperOffset),
  strategy: 'fixed',
  visible: ellipsisVisible,
})

useClickOutside(ellipsisTriggerRef, () => {
  ellipsisVisible.value = false
})

function toggleEllipsis() {
  ellipsisVisible.value = !ellipsisVisible.value
}

let resizeObserver: ResizeObserver | null = null

// mode / ellipsis toggles change the layout completely — re-measure.
watch(
  () => [props.mode, props.ellipsis] as const,
  () => scheduleMeasure()
)

onMounted(() => {
  scheduleMeasure()
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => scheduleMeasure())
  if (rootRef.value) resizeObserver.observe(rootRef.value)
})

onBeforeUnmount(() => {
  if (measureFrame !== null) cancelAnimationFrame(measureFrame)
  resizeObserver?.disconnect()
  resizeObserver = null
})

// Menu context provided to children.
// NOTE: must be a plain object — wrapping it in reactive() would unwrap the
// nested refs/computeds and break every `menuCtx.xxx.value` access in children.
const menuContext: MenuContext = {
  activeIndex: activeIndexRef,
  activeIndexPath: activeIndexPathRef,
  mode: computed(() => props.mode),
  collapse: computed(() => props.collapse),
  backgroundColor: computed(() => props.backgroundColor),
  textColor: computed(() => props.textColor),
  activeTextColor: computed(() => props.activeTextColor),
  uniqueOpened: computed(() => props.uniqueOpened),
  menuTrigger: computed(() => props.menuTrigger),
  popperEffect: computed(() => props.popperEffect),
  popperOffset: computed(() => props.popperOffset),
  routerEnabled: computed(() => props.router),
  openedMenus,
  selectItem: (index: string, indexPath: string[]) => {
    activeIndexRef.value = index
    activeIndexPathRef.value = indexPath
    // Popup-style submenus (horizontal / collapsed) close after a selection
    if (props.mode === 'horizontal' || props.collapse) {
      openedMenus.value.clear()
    }
    ellipsisVisible.value = false
    emit('select', index, indexPath)
  },
  openMenu: (index: string, indexPath: string[]) => {
    // Popup submenus (horizontal bar / collapsed sidebar) overlap each other
    // when more than one is open, so opening one closes every popup outside
    // its own ancestor chain — mirrors how hover mode dismisses the previous
    // panel when the pointer moves to a sibling. Inline (vertical expanded)
    // submenus coexist instead, accordion-style unless unique-opened.
    const isPopupMode = props.mode === 'horizontal' || props.collapse
    if (props.uniqueOpened || isPopupMode) {
      for (const open of [...openedMenus.value]) {
        if (open !== index && !indexPath.includes(open)) {
          openedMenus.value.delete(open)
          emit('close', open, [open])
        }
      }
    }
    if (!openedMenus.value.has(index)) {
      openedMenus.value.add(index)
      emit('open', index, indexPath)
    }
  },
  closeMenu: (index: string, indexPath: string[]) => {
    openedMenus.value.delete(index)
    emit('close', index, indexPath)
  },
  isMenuOpened: (index: string) => openedMenus.value.has(index),
  registerItem,
  unregisterItem,
}

provide(MENU_KEY, menuContext)

/** Open a submenu programmatically (Element Plus compatible) */
function open(index: string) {
  if (!index) return
  openedMenus.value.add(index)
}

/** Close a submenu programmatically (Element Plus compatible) */
function close(index: string) {
  if (!index) return
  openedMenus.value.delete(index)
}

defineExpose({ open, close })
</script>

<template>
  <ul
    ref="rootRef"
    :class="rootClasses"
    :style="rootStyle"
    :role="mode === 'horizontal' ? 'menubar' : 'menu'"
  >
    <slot v-if="!isEllipsisActive" />
    <template v-else>
      <component :is="item" v-for="(item, i) in barItems" :key="i" />
    </template>
    <li v-if="isEllipsisActive" :class="ns.e('ellipsis')">
      <div
        ref="ellipsisTriggerRef"
        :class="[ns.e('ellipsis-trigger'), ns.is('active', ellipsisVisible)]"
        role="menuitem"
        :tabindex="0"
        aria-haspopup="menu"
        :aria-expanded="ellipsisVisible"
        @click="toggleEllipsis"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </div>
      <Teleport to="body" :disabled="false">
        <Transition name="zc-submenu-dropdown">
          <ul
            v-show="ellipsisVisible"
            ref="ellipsisPopperRef"
            :class="ns.e('ellipsis-popup')"
            :style="ellipsisStyles"
            role="menu"
          >
            <component :is="item" v-for="(item, i) in overflowItems" :key="i" />
          </ul>
        </Transition>
      </Teleport>
    </li>
  </ul>
</template>

<style scoped>
.zc-menu {
  /* Component-level CSS variables */
  --zc-menu-bg-color: var(--color-zc-bg-base, #fff);
  --zc-menu-text-color: var(--color-zc-text-regular, #606266);
  --zc-menu-active-color: var(--color-zc-primary-500, #409eff);
  --zc-menu-active-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-menu-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-menu-hover-text-color: var(--color-zc-text-primary, #303133);
  --zc-menu-item-height: 56px;
  --zc-menu-item-padding: 0 20px;
  --zc-menu-font-size: var(--text-zc-base, 14px);
  --zc-menu-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-menu-submenu-bg-color: var(--color-zc-fill-lighter, #fafafa);
  --zc-menu-collapsed-width: 64px;
  --zc-menu-icon-color: var(--color-zc-text-secondary, #909399);
  --zc-menu-icon-size: 18px;

  list-style: none;
  margin: 0;
  padding: 0;
  background-color: var(--zc-menu-bg-color);
  border-right: 1px solid var(--zc-menu-border-color);
  box-sizing: border-box;
}

/* Reset VitePress `.vp-doc li + li { margin-top: 8px }` so menu items align.
   Must use :deep() — the <li> items are rendered by slotted child components
   (ZcMenuItem/ZcSubmenu) and don't carry this component's scoped data-v
   attribute, so a plain `.zc-menu > .zc-menu__item` selector never matches. */
.zc-menu :deep(li + li) {
  margin-top: 0;
}

.zc-menu--horizontal {
  display: flex;
  flex-wrap: nowrap;
  border-right: none;
  border-bottom: 1px solid var(--zc-menu-border-color);
}

.zc-menu--vertical:not(.is-collapse) {
  width: 200px;
}

.zc-menu--vertical.is-collapse {
  width: var(--zc-menu-collapsed-width);
}

/* ---- Collapse transition animation ---- */
/* NOTE: the item <li>s and title <div>s are rendered by slotted child
  components (ZcMenuItem / ZcSubmenu) and don't carry this component's
scoped data-v attribute, so :deep() is required in every selector below
(same as the `li + li` reset above). */
.zc-menu--vertical.is-collapse-transition {
  transition: width var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-menu--vertical.is-collapse-transition > :deep(.zc-menu__item),
.zc-menu--vertical.is-collapse-transition > :deep(.zc-submenu) .zc-submenu__title {
  transition: padding var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* Fade text/icons during collapse */
.zc-menu--vertical.is-collapse-transition > :deep(.zc-menu__item span),
.zc-menu--vertical.is-collapse-transition > :deep(.zc-submenu) .zc-submenu__title span {
  transition: opacity var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

/* Hide item/title text in collapsed mode. Keep the arrow icon visible.
  font-size: 0 also hides unwrapped text nodes; icons carry their own fixed
px size (inline SVG size attr / ZcIcon size prop) so they are unaffected.
:not(:has(svg, i, img)) keeps span-wrapped icons (e.g. ZcIconName) alive. */
.zc-menu--vertical.is-collapse > :deep(.zc-menu__item),
.zc-menu--vertical.is-collapse > :deep(.zc-submenu) .zc-submenu__title {
  font-size: 0;
}

.zc-menu--vertical.is-collapse
  > :deep(.zc-menu__item span:not(.zc-submenu__icon-arrow):not(:has(svg, i, img))),
.zc-menu--vertical.is-collapse
  > :deep(.zc-submenu)
  .zc-submenu__title
  span:not(.zc-submenu__icon-arrow):not(:has(svg, i, img)) {
  display: none;
}

/* Center the remaining icon inside the collapsed column. Submenu titles are
handled below (arrow hidden + centered) — see that block for why. */
.zc-menu--vertical.is-collapse > :deep(.zc-menu__item) {
  padding-left: 0;
  padding-right: 0;
  justify-content: center;
}

/* ---- Collapsed mode: submenu titles ---- */
/* Element Plus behavior: when the menu is collapsed, submenu titles show only
the leading icon, centered like plain items; the expand arrow is hidden (it
would otherwise sit at the far right via margin-left:auto and push the icon
off-center). The popup still opens on hover/click. */
.zc-menu--vertical.is-collapse > :deep(.zc-submenu) .zc-submenu__title .zc-submenu__icon-arrow {
  display: none;
}

.zc-menu--vertical.is-collapse > :deep(.zc-submenu) .zc-submenu__title {
  padding-left: 0;
  padding-right: 0;
  justify-content: center;
}

/* ---- Ellipsis overflow (horizontal) ---- */
.zc-menu__ellipsis {
  list-style: none;
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
}

.zc-menu__ellipsis-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Keep in sync with ELLIPSIS_TRIGGER_FALLBACK_WIDTH in script */
  width: var(--zc-menu-ellipsis-trigger-width, 48px);
  height: 60px;
  cursor: pointer;
  color: var(--color-zc-text-regular, #606266);
}

.zc-menu__ellipsis-trigger.is-active,
.zc-menu__ellipsis-trigger:hover {
  color: var(--color-zc-primary-500, #409eff);
}
</style>

<style>
/* Global (non-scoped): the ellipsis popup is teleported to <body>, so it must
   not rely on the scoped data-v attribute. Hide the overflowed top-level
   items that have been re-rendered inside the popup. */
.zc-menu__ellipsis-popup {
  position: fixed;
  z-index: var(--z-zc-dropdown, 1000);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 180px;
  background-color: var(--color-zc-bg-base, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
}

.zc-menu__ellipsis-popup li {
  list-style: none;
}
</style>
