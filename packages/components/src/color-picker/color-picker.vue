<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import type { ColorFormat } from './types'

defineOptions({ name: 'ZcColorPicker' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    size?: 'large' | 'medium' | 'small'
    format?: ColorFormat
    showAlpha?: boolean
    predefine?: string[]
  }>(),
  {
    modelValue: '#409eff',
    disabled: false,
    size: 'medium',
    format: 'hex',
    showAlpha: false,
    predefine: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'active-change', value: string): void
}>()

const ns = useNamespace('color-picker')
const { t } = useLocale()
const containerRef = shallowRef<HTMLElement>()
const svRef = shallowRef<HTMLElement>()

const visible = ref(false)
const color = ref({ h: 220, s: 100, v: 100, a: 1 })
const history = ref<string[]>([])

useClickOutside(containerRef, () => {
  if (visible.value) closePicker()
})

// ---- Color conversions ----
function hsvToRgb(h: number, s: number, v: number) {
  s /= 100
  v /= 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0,
    g = 0,
    b = 0
  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsv(hex: string) {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : (d / max) * 100
  const v = max * 100
  return { h, s, v, a: 1 }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function getCurrentColorStr(): string {
  const { r, g, b } = hsvToRgb(color.value.h, color.value.s, color.value.v)
  const hasAlpha = props.showAlpha && color.value.a < 1

  switch (props.format) {
    case 'rgb':
      return hasAlpha
        ? `rgba(${r}, ${g}, ${b}, ${color.value.a.toFixed(2)})`
        : `rgb(${r}, ${g}, ${b})`
    case 'hsl': {
      const { h, s, l } = rgbToHsl(r, g, b)
      return hasAlpha
        ? `hsla(${h}, ${s}%, ${l}%, ${color.value.a.toFixed(2)})`
        : `hsl(${h}, ${s}%, ${l}%)`
    }
    case 'hex':
    default:
      if (hasAlpha) {
        return `rgba(${r}, ${g}, ${b}, ${color.value.a.toFixed(2)})`
      }
      return rgbToHex(r, g, b)
  }
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : (d / max) * 100
  const v = max * 100
  return { h, s, v, a: 1 }
}

function hslToHsv(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return { h, s: Math.round(sv * 100), v: Math.round(v * 100), a: 1 }
}

function parseAnyToHsv(colorStr: string) {
  const lower = colorStr.trim().toLowerCase()
  // rgba / rgb format
  if (lower.startsWith('rgb')) {
    const match = lower.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/)
    if (match) {
      const r = parseInt(match[1], 10)
      const g = parseInt(match[2], 10)
      const b = parseInt(match[3], 10)
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1
      return { ...rgbToHsv(r, g, b), a }
    }
  }
  // hsla / hsl format
  if (lower.startsWith('hsl')) {
    const match = lower.match(
      /hsla?\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)/
    )
    if (match) {
      const h = parseInt(match[1], 10)
      const s = parseFloat(match[2])
      const l = parseFloat(match[3])
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1
      return { ...hslToHsv(h, s, l), a }
    }
  }
  // fallback to hex parsing
  return hexToHsv(colorStr)
}

function syncFromModel() {
  if (props.modelValue) {
    const hsv = parseAnyToHsv(props.modelValue)
    color.value = hsv
  }
}

syncFromModel()

// ---- Computed ----
const displayColor = computed(() => getCurrentColorStr())
const hueColor = computed(() => {
  const { r, g, b } = hsvToRgb(color.value.h, 100, 100)
  return `rgb(${r}, ${g}, ${b})`
})

const svBackground = computed(() => {
  const { r, g, b } = hsvToRgb(color.value.h, 100, 100)
  return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, rgb(${r},${g},${b}))`
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.size),
  ns.is('disabled', props.disabled),
  ns.is('open', visible.value),
])

// ---- SV panel interaction ----
function handleSVMouseDown(event: MouseEvent) {
  if (props.disabled) return
  handleSVMove(event)
  document.addEventListener('mousemove', handleSVMove)
  document.addEventListener('mouseup', handleSVMouseUp)
}

function handleSVMouseUp() {
  document.removeEventListener('mousemove', handleSVMove)
  document.removeEventListener('mouseup', handleSVMouseUp)
}

function handleSVMove(event: MouseEvent) {
  const el = svRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  let x = (event.clientX - rect.left) / rect.width
  let y = (event.clientY - rect.top) / rect.height
  x = Math.max(0, Math.min(1, x))
  y = Math.max(0, Math.min(1, y))
  color.value.s = Math.round(x * 100)
  color.value.v = Math.round((1 - y) * 100)
  emit('active-change', getCurrentColorStr())
}

// ---- Hue slider ----
function handleHueChange(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  let x = (event.clientX - rect.left) / rect.width
  x = Math.max(0, Math.min(1, x))
  color.value.h = Math.round(x * 360)
  emit('active-change', getCurrentColorStr())
}

// ---- Alpha slider ----
function handleAlphaChange(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  let x = (event.clientX - rect.left) / rect.width
  x = Math.max(0, Math.min(1, x))
  color.value.a = Math.round(x * 100) / 100
  emit('active-change', getCurrentColorStr())
}

// ---- Confirm ----
function confirmColor() {
  const str = getCurrentColorStr()
  emit('update:modelValue', str)
  emit('change', str)

  if (!history.value.includes(str)) {
    history.value = [str, ...history.value].slice(0, 8)
  }
  closePicker()
}

function closePicker() {
  visible.value = false
}

function togglePicker() {
  if (props.disabled) return
  visible.value = !visible.value
}

function selectPredefine(c: string) {
  const hsv = hexToHsv(c)
  color.value = hsv
  emit('active-change', getCurrentColorStr())
}

watch(
  () => props.modelValue,
  () => {
    syncFromModel()
  }
)
</script>

<template>
  <div ref="containerRef" :class="classes">
    <!-- Trigger -->
    <div :class="ns.e('trigger')" @click="togglePicker">
      <div :class="ns.e('color')" :style="{ background: displayColor }"></div>
    </div>

    <!-- Dropdown panel -->
    <transition name="zc-color-picker-dropdown">
      <div v-show="visible" :class="ns.e('panel')">
        <!-- Saturation-Value panel -->
        <div
          ref="svRef"
          :class="ns.e('sv-panel')"
          :style="{ background: svBackground }"
          @mousedown="handleSVMouseDown"
        >
          <div
            :class="ns.e('sv-cursor')"
            :style="{
              left: color.s + '%',
              top: 100 - color.v + '%',
            }"
          ></div>
        </div>

        <!-- Hue slider -->
        <div :class="ns.e('hue')" @click="handleHueChange">
          <div :class="ns.e('hue-thumb')" :style="{ left: (color.h / 360) * 100 + '%' }"></div>
        </div>

        <!-- Alpha slider -->
        <div v-if="showAlpha" :class="ns.e('alpha')" @click="handleAlphaChange">
          <div
            :class="ns.e('alpha-track')"
            :style="{ background: `linear-gradient(to right, transparent, ${hueColor})` }"
          ></div>
          <div :class="ns.e('alpha-thumb')" :style="{ left: color.a * 100 + '%' }"></div>
        </div>

        <!-- Input + buttons -->
        <div :class="ns.e('footer')">
          <input
            :class="ns.e('input')"
            :value="displayColor"
            @input="
              (e) => {
                const v = (e.target as HTMLInputElement).value
                const hsv = parseAnyToHsv(v)
                color.value = hsv
              }
            "
          />
          <button :class="ns.e('btn')" @click="confirmColor">{{ t('common.confirm') }}</button>
        </div>

        <!-- Predefine colors -->
        <div v-if="predefine.length > 0" :class="ns.e('predefine')">
          <span
            v-for="(c, i) in predefine"
            :key="i"
            :class="ns.e('predefine-item')"
            :style="{ background: c }"
            @click="selectPredefine(c)"
          ></span>
        </div>

        <!-- History -->
        <div v-if="history.length > 0" :class="ns.e('history')">
          <span
            v-for="(c, i) in history"
            :key="i"
            :class="ns.e('history-item')"
            :style="{ background: c }"
            @click="selectPredefine(c)"
          ></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcColorPicker styles
 * ============================================================ */

.zc-color-picker {
  --zc-color-picker-bg-color: var(--color-zc-bg-base, #fff);
  --zc-color-picker-text-color: var(--color-zc-text-primary, #303133);
  --zc-color-picker-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-color-picker-hover-border-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-color-picker-border-radius: var(--radius-zc-base, 4px);
  --zc-color-picker-font-size: var(--text-zc-base, 14px);
  --zc-color-picker-panel-bg-color: var(--color-zc-bg-base, #fff);
  --zc-color-picker-panel-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-color-picker-swatch-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-color-picker-swatch-border-radius: var(--radius-zc-sm, 2px);

  position: relative;
  display: inline-block;
}

/* Trigger */
.zc-color-picker__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  padding: 4px;
  box-sizing: border-box;
  background: var(--color-zc-white, #fff);
  transition: border-color var(--transition-duration-zc-base, 0.25s);
}

.zc-color-picker__trigger:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-color-picker.is-disabled .zc-color-picker__trigger {
  cursor: not-allowed;
  opacity: 0.6;
}

.zc-color-picker__color {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

/* Sizes */
.zc-color-picker--large .zc-color-picker__trigger {
  width: 42px;
  height: 42px;
}
.zc-color-picker--small .zc-color-picker__trigger {
  width: 28px;
  height: 28px;
}

/* Panel */
.zc-color-picker__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-zc-dropdown, 1000);
  width: 240px;
  padding: 12px;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  box-sizing: border-box;
}

/* SV panel */
.zc-color-picker__sv-panel {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: var(--zc-color-picker-border-radius);
  cursor: crosshair;
  margin-bottom: 12px;
}

.zc-color-picker__sv-cursor {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-zc-white, #fff);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

/* Hue slider */
.zc-color-picker__hue {
  position: relative;
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
  cursor: pointer;
  margin-bottom: 10px;
}

.zc-color-picker__hue-thumb {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 16px;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

/* Alpha slider */
.zc-color-picker__alpha {
  position: relative;
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;
  cursor: pointer;
  margin-bottom: 10px;
  overflow: hidden;
}

.zc-color-picker__alpha-track {
  position: absolute;
  inset: 0;
  border-radius: 6px;
}

.zc-color-picker__alpha-thumb {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 16px;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: 2px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

/* Footer */
.zc-color-picker__footer {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.zc-color-picker__input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-xs, 12px);
  outline: none;
  color: var(--color-zc-text-primary, #303133);
}

.zc-color-picker__btn {
  height: 28px;
  padding: 0 12px;
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
  border: none;
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  font-size: var(--text-zc-xs, 12px);
}

.zc-color-picker__btn:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

/* Predefine */
.zc-color-picker__predefine,
.zc-color-picker__history {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-color-picker__predefine-item,
.zc-color-picker__history-item {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid var(--zc-color-picker-swatch-border-color);
  transition: transform var(--transition-duration-zc-fast, 0.15s);
}

.zc-color-picker__predefine-item:hover,
.zc-color-picker__history-item:hover {
  transform: scale(1.15);
}

/* Dropdown transition */
.zc-color-picker-dropdown-enter-active,
.zc-color-picker-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}
.zc-color-picker-dropdown-enter-from,
.zc-color-picker-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
