<script setup lang="ts">
import { computed, ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcTimePicker' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    format?: string
    size?: 'large' | 'medium' | 'small'
    disabledHours?: () => number[]
    disabledMinutes?: (hour: number) => number[]
    disabledSeconds?: (hour: number, minute: number) => number[]
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false,
    format: 'HH:mm:ss',
    size: 'medium',
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const ns = useNamespace('time-picker')
const { t } = useLocale()

const placeholderText = computed(() => props.placeholder || t('zc.timePicker.placeholder'))
const containerRef = shallowRef<HTMLElement>()
const visible = ref(false)
const isFocused = ref(false)

// Current panel selection
const currentHour = ref(0)
const currentMinute = ref(0)
const currentSecond = ref(0)

useClickOutside(containerRef, () => {
  if (visible.value) closePanel()
})

// ---- Helpers ----
function parseTime(str: string): { h: number; m: number; s: number } {
  const parts = str.split(':').map(Number)
  return {
    h: parts[0] || 0,
    m: parts[1] || 0,
    s: parts[2] || 0,
  }
}

function formatTime(h: number, m: number, s: number): string {
  return props.format
    .replace('HH', String(h).padStart(2, '0'))
    .replace('mm', String(m).padStart(2, '0'))
    .replace('ss', String(s).padStart(2, '0'))
}

// ---- Sync from model ----
function syncFromModel() {
  if (props.modelValue) {
    const { h, m, s } = parseTime(props.modelValue)
    currentHour.value = h
    currentMinute.value = m
    currentSecond.value = s
  }
}

syncFromModel()
watch(() => props.modelValue, syncFromModel)

// ---- Computed ----
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const { h, m, s } = parseTime(props.modelValue)
  return formatTime(h, m, s)
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('focused', isFocused.value),
  ns.is('open', visible.value),
])

// ---- Hours options ----
const hours = computed(() => {
  const disabled = props.disabledHours?.() || []
  return Array.from({ length: 24 }, (_, i) => ({
    value: i,
    disabled: disabled.includes(i),
  }))
})

const minutes = computed(() => {
  const disabled = props.disabledMinutes?.(currentHour.value) || []
  return Array.from({ length: 60 }, (_, i) => ({
    value: i,
    disabled: disabled.includes(i),
  }))
})

const seconds = computed(() => {
  const disabled = props.disabledSeconds?.(currentHour.value, currentMinute.value) || []
  return Array.from({ length: 60 }, (_, i) => ({
    value: i,
    disabled: disabled.includes(i),
  }))
})

// ---- Selection ----
function selectHour(h: number) {
  if (hours.value[h].disabled) return
  currentHour.value = h
  emitChange()
}

function selectMinute(m: number) {
  if (minutes.value[m].disabled) return
  currentMinute.value = m
  emitChange()
}

function selectSecond(s: number) {
  if (seconds.value[s].disabled) return
  currentSecond.value = s
  emitChange()
}

function emitChange() {
  const val = formatTime(currentHour.value, currentMinute.value, currentSecond.value)
  emit('update:modelValue', val)
  emit('change', val)
}

function handleConfirm() {
  emitChange()
  closePanel()
}

function closePanel() {
  visible.value = false
  isFocused.value = false
}

function togglePanel() {
  if (props.disabled || props.readonly) return
  visible.value = !visible.value
  isFocused.value = visible.value
}

function handleClear(event: Event) {
  event.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
}

// Scroll to selected when opened
let scrollTimer: ReturnType<typeof setTimeout> | null = null
watch(visible, (val) => {
  if (val) {
    scrollTimer = setTimeout(() => {
      scrollToSelected('hour')
      scrollToSelected('minute')
      scrollToSelected('second')
    }, 50)
  } else if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
})

onBeforeUnmount(() => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
})

function scrollToSelected(type: 'hour' | 'minute' | 'second') {
  const el = containerRef.value?.querySelector(`.zc-time-picker__spinner--${type}`)
  if (!el) return
  const selected = el.querySelector('.is-selected') as HTMLElement
  if (selected) {
    el.scrollTop = selected.offsetTop - el.clientHeight / 2 + selected.clientHeight / 2
  }
}

defineExpose({
  /** Toggle time picker panel */
  togglePanel,
  /** Close the panel */
  closePanel,
  /** Confirm the selected time */
  handleConfirm,
  /** Current visible state */
  visible,
})
</script>

<template>
  <div ref="containerRef" :class="classes">
    <div :class="ns.e('wrapper')" @click="togglePanel">
      <span :class="[ns.e('display'), ns.is('placeholder', !displayValue)]">
        {{ displayValue || placeholderText }}
      </span>
      <span
        v-if="clearable && displayValue && !disabled"
        :class="ns.e('clear')"
        @click="handleClear"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 8l8 8M16 8l-8 8" stroke-linecap="round" />
        </svg>
      </span>
      <span :class="[ns.e('arrow'), ns.is('reverse', visible)]">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M12 3v4M12 21v-4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M3 12h4M21 12h-4M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
            stroke-linecap="round"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
    </div>

    <transition name="zc-time-picker-dropdown">
      <div v-show="visible" :class="ns.e('panel')">
        <div :class="ns.e('content')">
          <!-- Hours -->
          <div :class="[ns.e('spinner'), ns.em('spinner', 'hour')]">
            <div
              v-for="item in hours"
              :key="item.value"
              :class="[
                ns.e('spinner-item'),
                ns.is('selected', currentHour === item.value),
                ns.is('disabled', item.disabled),
              ]"
              @click="selectHour(item.value)"
            >
              {{ String(item.value).padStart(2, '0') }}
            </div>
          </div>
          <!-- Minutes -->
          <div :class="[ns.e('spinner'), ns.em('spinner', 'minute')]">
            <div
              v-for="item in minutes"
              :key="item.value"
              :class="[
                ns.e('spinner-item'),
                ns.is('selected', currentMinute === item.value),
                ns.is('disabled', item.disabled),
              ]"
              @click="selectMinute(item.value)"
            >
              {{ String(item.value).padStart(2, '0') }}
            </div>
          </div>
          <!-- Seconds -->
          <div :class="[ns.e('spinner'), ns.em('spinner', 'second')]">
            <div
              v-for="item in seconds"
              :key="item.value"
              :class="[
                ns.e('spinner-item'),
                ns.is('selected', currentSecond === item.value),
                ns.is('disabled', item.disabled),
              ]"
              @click="selectSecond(item.value)"
            >
              {{ String(item.value).padStart(2, '0') }}
            </div>
          </div>
        </div>
        <div :class="ns.e('footer')">
          <button :class="ns.e('confirm-btn')" @click="handleConfirm">
            {{ t('common.confirm') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcTimePicker styles
 * ============================================================ */

.zc-time-picker {
  --zc-time-picker-bg-color: var(--color-zc-bg-base, #fff);
  --zc-time-picker-text-color: var(--color-zc-text-primary, #303133);
  --zc-time-picker-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-time-picker-hover-border-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-time-picker-focus-border-color: var(--color-zc-primary-500, #409eff);
  --zc-time-picker-border-radius: var(--radius-zc-base, 4px);
  --zc-time-picker-font-size: var(--text-zc-base, 14px);
  --zc-time-picker-panel-bg-color: var(--color-zc-bg-base, #fff);
  --zc-time-picker-item-text-color: var(--color-zc-text-regular, #606266);
  --zc-time-picker-item-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-time-picker-item-selected-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-time-picker-item-selected-text-color: var(--color-zc-white, #fff);

  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--zc-time-picker-font-size);
}

.zc-time-picker__wrapper {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: 0 30px 0 11px;
  background: var(--zc-time-picker-bg-color);
  border: 1px solid var(--zc-time-picker-border-color);
  border-radius: var(--zc-time-picker-border-radius);
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-time-picker__wrapper:hover {
  border-color: var(--zc-time-picker-hover-border-color);
}

.zc-time-picker.is-focused .zc-time-picker__wrapper {
  border-color: var(--zc-time-picker-focus-border-color);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-time-picker.is-disabled .zc-time-picker__wrapper {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

.zc-time-picker__display {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-zc-text-primary, #303133);
}

.zc-time-picker__display.is-placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-time-picker__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-time-picker__arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-zc-text-secondary, #909399);
  transition: transform var(--transition-duration-zc-base, 0.25s);
  pointer-events: none;
}

.zc-time-picker__arrow.is-reverse {
  transform: translateY(-50%) rotate(180deg);
}

/* Sizes */
.zc-time-picker--large .zc-time-picker__wrapper {
  min-height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-time-picker--small .zc-time-picker__wrapper {
  min-height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

/* Panel */
.zc-time-picker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--zc-time-picker-panel-bg-color);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--zc-time-picker-border-radius);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  box-sizing: border-box;
}

.zc-time-picker__content {
  display: flex;
  gap: 1px;
}

.zc-time-picker__spinner {
  width: 56px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
  scrollbar-width: thin;
}

.zc-time-picker__spinner::-webkit-scrollbar {
  width: 4px;
}

.zc-time-picker__spinner::-webkit-scrollbar-thumb {
  background: var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
}

.zc-time-picker__spinner-item {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--zc-time-picker-item-text-color);
  font-size: var(--text-zc-sm, 13px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-time-picker__spinner-item:hover {
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-time-picker__spinner-item.is-selected {
  color: var(--color-zc-primary-500, #409eff);
  font-weight: 600;
  background: var(--color-zc-primary-50, #ecf5ff);
}

.zc-time-picker__spinner-item.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

.zc-time-picker__spinner-item.is-disabled:hover {
  background: transparent;
}

/* Footer */
.zc-time-picker__footer {
  padding: 8px;
  text-align: right;
  border-top: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-time-picker__confirm-btn {
  height: 28px;
  padding: 0 16px;
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
  border: none;
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  font-size: var(--text-zc-xs, 12px);
}

.zc-time-picker__confirm-btn:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

/* Dropdown transition */
.zc-time-picker-dropdown-enter-active,
.zc-time-picker-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}
.zc-time-picker-dropdown-enter-from,
.zc-time-picker-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
