<script setup lang="ts">
import { ref, computed, provide, reactive } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { MenuMode } from './types'
import { MENU_KEY, type MenuContext } from './types'

defineOptions({ name: 'ZcMenu' })

const props = withDefaults(
  defineProps<{
    /** Horizontal or vertical menu */
    mode?: MenuMode
    /** Currently active menu item index */
    activeIndex?: string
    /** Whether the menu is collapsed (vertical mode only) */
    collapse?: boolean
    /** Background color */
    backgroundColor?: string
    /** Text color */
    textColor?: string
    /** Active text color */
    activeTextColor?: string
    /** Unique key for opened submenus */
    uniqueOpened?: boolean
  }>(),
  {
    mode: 'vertical',
    activeIndex: '',
    collapse: false,
    backgroundColor: '',
    textColor: '',
    activeTextColor: '',
    uniqueOpened: false,
  }
)

const emit = defineEmits<{
  (e: 'select', index: string, indexPath: string[]): void
  (e: 'open', index: string, indexPath: string[]): void
  (e: 'close', index: string, indexPath: string[]): void
}>()

const ns = useNamespace('menu')

const activeIndexRef = ref(props.activeIndex)
const openedMenus = ref<Set<string>>(new Set())

const rootClasses = computed(() => [ns.b(), ns.m(props.mode), ns.is('collapse', props.collapse)])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  }
  return style
})

// Menu context provided to children
const menuContext = reactive({
  activeIndex: activeIndexRef,
  mode: computed(() => props.mode),
  collapse: computed(() => props.collapse),
  backgroundColor: computed(() => props.backgroundColor),
  textColor: computed(() => props.textColor),
  activeTextColor: computed(() => props.activeTextColor),
  uniqueOpened: computed(() => props.uniqueOpened),
  openedMenus,
  selectItem: (index: string, indexPath: string[]) => {
    activeIndexRef.value = index
    emit('select', index, indexPath)
  },
  openMenu: (index: string, indexPath: string[]) => {
    if (props.uniqueOpened) {
      openedMenus.value.clear()
    }
    openedMenus.value.add(index)
    emit('open', index, indexPath)
  },
  closeMenu: (index: string, indexPath: string[]) => {
    openedMenus.value.delete(index)
    emit('close', index, indexPath)
  },
  isMenuOpened: (index: string) => openedMenus.value.has(index),
})

provide(MENU_KEY, menuContext as unknown as MenuContext)
</script>

<template>
  <ul :class="rootClasses" :style="rootStyle" role="menubar">
    <slot />
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

.zc-menu--vertical.is-collapse > .zc-menu-item span,
.zc-menu--vertical.is-collapse > .zc-submenu__title span {
  display: none;
}
</style>
