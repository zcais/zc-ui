<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'

defineOptions({ name: 'ZcSwitch' })

/** Size variants for the switch component. */
export type SwitchSize = 'large' | 'medium' | 'small'

const props = withDefaults(
  defineProps<{
    /** v-model binding for toggle state. */
    modelValue?: boolean
    /** Disables the switch when true. */
    disabled?: boolean
    /** Shows a loading spinner on the knob and disables interaction. */
    loading?: boolean
    /** Text shown on the left side when switch is on. */
    activeText?: string
    /** Text shown on the right side when switch is off. */
    inactiveText?: string
    /** Custom background color for the on state. */
    activeColor?: string
    /** Custom background color for the off state. */
    inactiveColor?: string
    /** Custom width of the switch track in pixels. */
    width?: number
    /** Size preset: 'large' | 'medium' | 'small'. */
    size?: SwitchSize
    /** Accessible label for screen readers */
    ariaLabel?: string
  }>(),
  {
    modelValue: false,
    disabled: false,
    loading: false,
    activeText: '',
    inactiveText: '',
    activeColor: '',
    inactiveColor: '',
    width: 40,
    size: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const ns = useNamespace('switch')

// ---- ConfigProvider size integration ----
// Priority: explicit prop > ConfigProvider global size > default 'medium'
// SwitchSize is 'large'|'medium'|'small' (no 'mini'), so 'mini' degrades to 'small'
const { size: globalSize } = useGlobalConfig()
const effectiveSize = computed<SwitchSize>(() => {
  const resolved = props.size ?? globalSize.value ?? 'medium'
  return resolved === 'mini' ? 'small' : (resolved as SwitchSize)
})

/** Size dimensions mapped from the size prop. */
const sizeMap: Record<SwitchSize, { trackHeight: number; knobSize: number; fontSize: string }> = {
  large: { trackHeight: 24, knobSize: 20, fontSize: '14px' },
  medium: { trackHeight: 20, knobSize: 16, fontSize: '12px' },
  small: { trackHeight: 16, knobSize: 12, fontSize: '10px' },
}

const activeSizeConf = computed(() => sizeMap[effectiveSize.value])

const isChecked = computed(() => props.modelValue === true)

/** BEM classes for the root element. */
const classes = computed(() => [
  ns.b(),
  ns.m(effectiveSize.value),
  ns.is('checked', isChecked.value),
  ns.is('disabled', props.disabled),
  ns.is('loading', props.loading),
])

/** Inline style for the track: width, height, and custom colors. */
const trackStyle = computed(() => {
  const style: Record<string, string> = {}
  const { trackHeight } = activeSizeConf.value

  style['width'] = `${props.width}px`
  style['height'] = `${trackHeight}px`

  if (props.activeColor && isChecked.value) {
    style['backgroundColor'] = props.activeColor
  } else if (props.inactiveColor && !isChecked.value) {
    style['backgroundColor'] = props.inactiveColor
  }

  return style
})

/** Inline style for the knob: dimensions and slide transform. */
const knobStyle = computed(() => {
  const { knobSize } = activeSizeConf.value
  const padding = 2
  const slideDistance = props.width - padding * 2 - knobSize

  return {
    width: `${knobSize}px`,
    height: `${knobSize}px`,
    transform: isChecked.value ? `translateX(${slideDistance}px)` : 'translateX(0)',
  }
})

/** Inline style for the text labels. */
const labelStyle = computed(() => ({
  fontSize: activeSizeConf.value.fontSize,
}))

function handleToggle() {
  if (props.disabled || props.loading) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleToggle()
  }
}
</script>

<template>
  <div
    :class="classes"
    role="switch"
    :aria-checked="isChecked"
    :aria-disabled="disabled || loading"
    :aria-label="ariaLabel || (isChecked ? '已开启' : '已关闭')"
    :tabindex="disabled || loading ? -1 : 0"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <!-- Active text label (left side) -->
    <span
      v-if="activeText || $slots.active"
      :class="[ns.e('label'), ns.em('label', 'active')]"
      :style="labelStyle"
    >
      <slot name="active">
        {{ activeText }}
      </slot>
    </span>

    <!-- Switch track -->
    <span :class="ns.e('track')" :style="trackStyle">
      <!-- Sliding knob -->
      <span :class="ns.e('knob')" :style="knobStyle">
        <!-- Loading spinner -->
        <svg
          v-if="loading"
          :class="ns.e('loading-icon')"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </span>

    <!-- Inactive text label (right side) -->
    <span
      v-if="inactiveText || $slots.inactive"
      :class="[ns.e('label'), ns.em('label', 'inactive')]"
      :style="labelStyle"
    >
      <slot name="inactive">
        {{ inactiveText }}
      </slot>
    </span>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcSwitch styles
 * BEM naming: zc-switch / zc-switch__track / zc-switch__knob
 * Toggle switch with sliding knob animation.
 * All colors reference CSS variables for global theming.
 * ============================================================ */

/* ---- Root block ---- */
.zc-switch {
  /* Component-level CSS variables */
  --zc-switch-on-color: var(--color-zc-primary-500, #409eff);
  --zc-switch-off-color: var(--color-zc-fill-lighter, #e9e9eb);
  --zc-switch-disabled-opacity: 0.5;
  --zc-switch-core-border-radius: 999px;
  --zc-switch-button-bg-color: var(--color-zc-white, #fff);
  --zc-switch-button-size: 16px;
  --zc-switch-height: 20px;
  --zc-switch-width: 40px;
  --zc-switch-label-color: var(--color-zc-text-primary, #303133);

  display: inline-flex;
  align-items: center;
  gap: var(--spacing-zc-xs, 4px);
  cursor: pointer;
  vertical-align: middle;
  user-select: none;
  outline: none;
}

/* Focus ring for keyboard navigation */
.zc-switch:focus-visible .zc-switch__track {
  box-shadow:
    0 0 0 2px var(--color-zc-white, #fff),
    0 0 0 4px var(--color-zc-primary-300, #a0cfff);
}

/* ---- Track ---- */
.zc-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: var(--zc-switch-core-border-radius);
  box-sizing: border-box;
  background-color: var(--zc-switch-off-color);
  transition: background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* ---- Checked state: track color ---- */
.zc-switch.is-checked .zc-switch__track {
  background-color: var(--zc-switch-on-color);
}

/* ---- Knob ---- */
.zc-switch__knob {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--zc-switch-button-bg-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

/* ---- Loading spinner inside knob ---- */
.zc-switch__loading-icon {
  width: 60%;
  height: 60%;
  color: var(--color-zc-text-secondary, #909399);
  animation: zc-switch-spin 0.6s linear infinite;
}

@keyframes zc-switch-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---- Labels ---- */
.zc-switch__label {
  color: var(--zc-switch-label-color);
  white-space: nowrap;
}

/* ---- Disabled state ---- */
.zc-switch.is-disabled {
  cursor: not-allowed;
}

.zc-switch.is-disabled .zc-switch__track {
  opacity: var(--zc-switch-disabled-opacity);
  cursor: not-allowed;
}

.zc-switch.is-disabled .zc-switch__label {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

/* ---- Loading state ---- */
.zc-switch.is-loading {
  cursor: not-allowed;
}

.zc-switch.is-loading .zc-switch__track {
  cursor: not-allowed;
}

/* ---- Size: large ---- */
.zc-switch--large .zc-switch__label {
  font-size: var(--text-zc-md, 16px);
}

/* ---- Size: medium ---- */
.zc-switch--medium .zc-switch__label {
  font-size: var(--text-zc-base, 14px);
}

/* ---- Size: small ---- */
.zc-switch--small .zc-switch__label {
  font-size: var(--text-zc-xs, 10px);
}
</style>
