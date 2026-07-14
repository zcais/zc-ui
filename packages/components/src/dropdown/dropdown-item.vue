<script setup lang="ts">
import { computed, inject } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { DROPDOWN_KEY, type DropdownContext } from './types'

defineOptions({ name: 'ZcDropdownItem' })

const props = withDefaults(
  defineProps<{
    /** Command value emitted on click */
    command?: string | number | object
    /** Disable the item */
    disabled?: boolean
    /** Show a divider line */
    divided?: boolean
    /** Show an icon (slot) */
    icon?: string
  }>(),
  {
    command: '',
    disabled: false,
    divided: false,
    icon: '',
  }
)

const ns = useNamespace('dropdown')

const dropdownCtx: DropdownContext = inject(DROPDOWN_KEY, {
  handleCommand: () => {},
  hide: () => {},
})

const itemClasses = computed(() => [
  ns.e('menu__item'),
  ns.is('disabled', props.disabled),
  ns.is('divided', props.divided),
])

function handleClick() {
  if (props.disabled) return
  dropdownCtx.handleCommand(props.command)
}
</script>

<template>
  <li
    :class="itemClasses"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <slot name="icon" />
    <span :class="ns.e('menu__item-text')">
      <slot />
    </span>
  </li>
</template>

<style scoped>
.zc-dropdown__menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-regular, #606266);
  cursor: pointer;
  transition: background var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-dropdown__menu__item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
  color: var(--color-zc-primary-500, #409eff);
}

.zc-dropdown__menu__item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
  pointer-events: none;
}

.zc-dropdown__menu__item.is-disabled:hover {
  background: none;
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-dropdown__menu__item.is-divided {
  border-top: 1px solid var(--color-zc-border-lighter, #ebeef5);
  margin-top: 6px;
  padding-top: 0;
}

.zc-dropdown__menu__item.is-divided:first-child {
  border-top: none;
  margin-top: 0;
}

.zc-dropdown__menu__item-text {
  flex: 1;
  white-space: nowrap;
}
</style>
