<script setup lang="ts">
import { computed, ref, shallowRef, watch, type CSSProperties } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useClickOutside, useZIndex } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import { usePopper } from '../popper/usePopper'
import { useFormDisabled, useFormSize, useFormItem } from '../form/use-form'
import { formatDateWithTokens, parseDateWithTokens } from './date-format'

defineOptions({ name: 'ZcDatePicker' })

export type DatePickerType =
  | 'date'
  | 'daterange'
  | 'datetime'
  | 'datetimerange'
  | 'month'
  | 'year'
  | 'week'
export type DatePickerSize = 'large' | 'medium' | 'small'

/** A shortcut option that sets the date range. */
export interface DatePickerShortcut {
  text: string
  value: (() => Date | [Date, Date]) | Date | [Date, Date]
}

const props = withDefaults(
  defineProps<{
    modelValue?: Date | [Date, Date] | string | [string, string]
    type?: DatePickerType
    placeholder?: string
    startPlaceholder?: string
    endPlaceholder?: string
    size?: DatePickerSize
    disabled?: boolean
    clearable?: boolean
    /** Display format (tokens: YYYY MM DD HH mm ss). */
    format?: string
    /**
     * Output/input value format. When set, `v-model` exchanges formatted
     * strings instead of Date objects (Element Plus compatible).
     */
    valueFormat?: string
    /** Allow typing a date into the input (single-value types only). */
    editable?: boolean
    shortcuts?: DatePickerShortcut[]
    disabledDate?: (date: Date) => boolean
  }>(),
  {
    modelValue: '',
    type: 'date',
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    size: undefined,
    disabled: false,
    clearable: false,
    format: 'YYYY-MM-DD',
    valueFormat: undefined,
    editable: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | [Date, Date] | [string, string] | string | ''): void
  (e: 'change', value: Date | [Date, Date] | [string, string] | string | null): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const ns = useNamespace('date-picker')
const { t } = useLocale()

// ---- Form context integration ----
// Priority: explicit prop > ZcFormItem > ZcForm > default 'medium'
// DatePickerSize is 'large'|'medium'|'small' (no 'mini'), so 'mini' degrades to 'small'
const formSize = useFormSize(() => props.size)
const formDisabled = useFormDisabled(() => props.disabled)
const formItem = useFormItem()
const isDisabled = formDisabled
const effectiveSize = computed<DatePickerSize>(() => {
  const resolved = formSize.value ?? 'medium'
  return resolved === 'mini' ? 'small' : (resolved as DatePickerSize)
})

const placeholderText = computed(() => props.placeholder || t('zc.datePicker.placeholder'))
const startPlaceholderText = computed(
  () => props.startPlaceholder || t('zc.datePicker.startPlaceholder')
)
const endPlaceholderText = computed(() => props.endPlaceholder || t('zc.datePicker.endPlaceholder'))

const triggerRef = shallowRef<HTMLElement>()
const dropdownRef = shallowRef<HTMLElement>()
const visible = ref(false)
const isFocused = ref(false)

// ---- Dropdown positioning ----
// Teleported to body with fixed strategy so the panel is never clipped
// by ancestor `overflow: hidden` containers.
const { styles: dropdownStyles } = usePopper({
  reference: triggerRef,
  popper: dropdownRef,
  placement: 'bottom-start',
  offset: 4,
  strategy: 'fixed',
  visible,
})

// ---- Layering: allocate from the shared z-index manager on every open ----
const { nextZIndex } = useZIndex()
const dropdownZIndex = ref<number>()
const dropdownStyle = computed<CSSProperties>(() => ({
  ...dropdownStyles.value,
  zIndex: dropdownZIndex.value,
}))

// ---- Calendar state ----
const viewDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const rangeStart = ref<Date | null>(null)
const rangeEnd = ref<Date | null>(null)
const hoveringDate = ref<Date | null>(null)

const isRange = computed(() => props.type === 'daterange' || props.type === 'datetimerange')

// ---- Panel mode: 'date' | 'month' | 'year' ----
// Determines which panel is shown. Auto-set from props.type on open.
const panelMode = ref<'date' | 'month' | 'year'>('date')
const isDateTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')
const isWeek = computed(() => props.type === 'week')
const isMonth = computed(() => props.type === 'month')
const isYear = computed(() => props.type === 'year')

// Time state for datetime mode
const selectedHours = ref(0)
const selectedMinutes = ref(0)
const selectedSeconds = ref(0)

// Time state for datetimerange mode
const rangeStartHours = ref(0)
const rangeStartMinutes = ref(0)
const rangeStartSeconds = ref(0)
const rangeEndHours = ref(0)
const rangeEndMinutes = ref(0)
const rangeEndSeconds = ref(0)

// ---- Parse initial value ----
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    if (isRange.value) {
      const [start, end] = val as [Date | string, Date | string]
      rangeStart.value = toInternalDate(start)
      rangeEnd.value = toInternalDate(end)
    } else if (val instanceof Date) {
      selectedDate.value = val
      viewDate.value = new Date(val)
    } else if (typeof val === 'string' && props.valueFormat) {
      const parsed = parseDateWithTokens(val, props.valueFormat)
      if (parsed) {
        selectedDate.value = parsed
        viewDate.value = new Date(parsed)
      }
    }
  },
  { immediate: true }
)

/** Convert an incoming model value (Date or value-format string) to a Date. */
function toInternalDate(v: Date | string | undefined | null): Date | null {
  if (!v) return null
  if (v instanceof Date) return v
  if (props.valueFormat) {
    const parsed = parseDateWithTokens(v, props.valueFormat)
    return parsed
  }
  return null
}

/**
 * Map an internal Date (or range) to the emitted value: unchanged when no
 * `value-format` is configured, formatted strings when it is.
 */
function toOutput(
  value: Date | [Date, Date] | '' | null
): Date | [Date, Date] | [string, string] | string | '' {
  if (value === '' || value === null) return ''
  if (!props.valueFormat) return value
  if (Array.isArray(value)) {
    return [
      formatDateWithTokens(value[0], props.valueFormat),
      formatDateWithTokens(value[1], props.valueFormat),
    ]
  }
  return formatDateWithTokens(value, props.valueFormat)
}

/** Emit update:modelValue + change with consistent output mapping. */
function emitValue(value: Date | [Date, Date] | '' | null) {
  const out = toOutput(value)
  emit('update:modelValue', out)
  emit('change', value === '' || value === null ? null : out)
  formItem?.validate('change')
}

// ---- Click outside (panel is teleported, so ignore it explicitly) ----
useClickOutside(
  triggerRef,
  () => {
    if (visible.value) closePicker()
  },
  { ignore: [dropdownRef] }
)

// ---- Date helpers ----
const WEEKDAYS = computed(() => [
  t('zc.datePicker.weekdays.sun'),
  t('zc.datePicker.weekdays.mon'),
  t('zc.datePicker.weekdays.tue'),
  t('zc.datePicker.weekdays.wed'),
  t('zc.datePicker.weekdays.thu'),
  t('zc.datePicker.weekdays.fri'),
  t('zc.datePicker.weekdays.sat'),
])
const MONTHS = computed(() => [
  t('zc.datePicker.months.jan'),
  t('zc.datePicker.months.feb'),
  t('zc.datePicker.months.mar'),
  t('zc.datePicker.months.apr'),
  t('zc.datePicker.months.may'),
  t('zc.datePicker.months.jun'),
  t('zc.datePicker.months.jul'),
  t('zc.datePicker.months.aug'),
  t('zc.datePicker.months.sep'),
  t('zc.datePicker.months.oct'),
  t('zc.datePicker.months.nov'),
  t('zc.datePicker.months.dec'),
])

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Effective display format: datetime types append time tokens when the
 * user-provided format doesn't include them.
 */
const effectiveDisplayFormat = computed(() => {
  if (isDateTime.value && props.type !== 'datetimerange' && !/HH/.test(props.format)) {
    return `${props.format} HH:mm:ss`
  }
  if (props.type === 'month' && !/MM/.test(props.format)) {
    return 'YYYY-MM'
  }
  if (props.type === 'year' && !/YYYY/.test(props.format)) {
    return 'YYYY'
  }
  return props.format
})

function formatDate(date: Date): string {
  if (props.type === 'month') {
    return formatDateWithTokens(date, effectiveDisplayFormat.value)
  }
  if (props.type === 'year') {
    return formatDateWithTokens(date, effectiveDisplayFormat.value)
  }
  let result = formatDateWithTokens(date, effectiveDisplayFormat.value)
  if (isDateTime.value && props.type === 'datetimerange') {
    // datetimerange display is handled by formatDateTimeRange
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    result = `${y}-${m}-${d}`
  }
  return result
}

/** Format date with time for datetimerange display */
function formatDateTimeRange(date: Date, isStart: boolean): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(isStart ? rangeStartHours.value : rangeEndHours.value).padStart(2, '0')
  const min = String(isStart ? rangeStartMinutes.value : rangeEndMinutes.value).padStart(2, '0')
  const s = String(isStart ? rangeStartSeconds.value : rangeEndSeconds.value).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/** Get the Monday of the week containing the date */
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Check if two dates are in the same week */
function isSameWeek(a: Date, b: Date): boolean {
  return getWeekStart(a).getTime() === getWeekStart(b).getTime()
}

/** Check if two dates are in same month */
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function isDateDisabled(date: Date): boolean {
  if (props.disabledDate) return props.disabledDate(date)
  return false
}

// ---- Calendar grid ----
interface CalendarCell {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isDisabled: boolean
}

const calendarCells = computed<CalendarCell[]>(() => {
  const cells: CalendarCell[] = []
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()

  // Previous month's tail
  for (let i = startOffset - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    cells.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isDisabled: isDateDisabled(date),
    })
  }

  // Current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    cells.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      isDisabled: isDateDisabled(date),
    })
  }

  // Next month's head (fill to 42 cells)
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i)
    cells.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isDisabled: isDateDisabled(date),
    })
  }

  return cells
})

// ---- Navigation ----
// Note: build dates from year/month components (day fixed to 1) instead of
// setMonth/setFullYear on the current date — otherwise e.g. Oct 31 setMonth(-1)
// overflows (Sep 31 -> Oct 1) and the header appears not to change.
function prevMonth() {
  if (panelMode.value === 'year') {
    prevYearRange()
    return
  }
  if (panelMode.value === 'month') {
    prevYear()
    return
  }
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  if (panelMode.value === 'year') {
    nextYearRange()
    return
  }
  if (panelMode.value === 'month') {
    nextYear()
    return
  }
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

function prevYear() {
  viewDate.value = new Date(viewDate.value.getFullYear() - 1, viewDate.value.getMonth(), 1)
}

function nextYear() {
  viewDate.value = new Date(viewDate.value.getFullYear() + 1, viewDate.value.getMonth(), 1)
}

function prevYearRange() {
  viewDate.value = new Date(viewDate.value.getFullYear() - 10, viewDate.value.getMonth(), 1)
}

function nextYearRange() {
  viewDate.value = new Date(viewDate.value.getFullYear() + 10, viewDate.value.getMonth(), 1)
}

// ---- Range helpers ----
function isInRange(date: Date): boolean {
  if (!isRange.value) return false
  const start = rangeStart.value
  const end = rangeEnd.value || hoveringDate.value
  if (!start || !end) return false
  const t = date.getTime()
  const s = start.getTime()
  const e = end.getTime()
  return t >= Math.min(s, e) && t <= Math.max(s, e)
}

function isRangeStart(date: Date): boolean {
  return isSameDay(rangeStart.value, date)
}

function isRangeEnd(date: Date): boolean {
  return isSameDay(rangeEnd.value, date)
}

// ---- Display values ----
const displayValue = computed(() => {
  if (isRange.value) {
    if (props.type === 'datetimerange') {
      const start = rangeStart.value ? formatDateTimeRange(rangeStart.value, true) : ''
      const end = rangeEnd.value ? formatDateTimeRange(rangeEnd.value, false) : ''
      return { start, end }
    }
    const start = rangeStart.value ? formatDate(rangeStart.value) : ''
    const end = rangeEnd.value ? formatDate(rangeEnd.value) : ''
    return { start, end }
  }
  return selectedDate.value ? formatDate(selectedDate.value) : ''
})

// Narrowed computables for template type-safety
const rangeDisplayStart = computed(() =>
  isRange.value ? (displayValue.value as { start: string; end: string }).start : ''
)
const rangeDisplayEnd = computed(() =>
  isRange.value ? (displayValue.value as { start: string; end: string }).end : ''
)
const singleDisplayValue = computed(() => (!isRange.value ? (displayValue.value as string) : ''))

// ---- Picker control ----
function openPicker() {
  if (isDisabled.value) return
  // Set panel mode based on type
  if (isYear.value) panelMode.value = 'year'
  else if (isMonth.value) panelMode.value = 'month'
  else panelMode.value = 'date'
  visible.value = true
  isFocused.value = true
  dropdownZIndex.value = nextZIndex()
  emit('focus', new FocusEvent('focus'))
}

function closePicker() {
  visible.value = false
  isFocused.value = false
  emit('blur', new FocusEvent('blur'))
  // Bridge to form-item validation rules with trigger: 'blur'
  formItem?.validate('blur')
}

function togglePicker() {
  if (isDisabled.value) return
  if (visible.value) closePicker()
  else openPicker()
}

function focus() {
  const input = triggerRef.value?.querySelector('input')
  if (input) {
    input.focus()
  } else {
    triggerRef.value?.focus()
  }
}

function blur() {
  const input = triggerRef.value?.querySelector('input')
  input?.blur()
  if (visible.value) closePicker()
}

// ---- Manual input (editable) ----
const editingText = ref<string | null>(null)

function handleManualInput(event: Event) {
  editingText.value = (event.target as HTMLInputElement).value
}

/** Commit the typed text: parse with the display format and select. */
function commitManualInput(closePanel = false) {
  if (editingText.value == null) return
  const text = editingText.value.trim()
  editingText.value = null
  if (isRange.value) return // range typing is not supported yet

  if (!text) {
    handleClear()
    return
  }

  const parsed = parseDateWithTokens(text, effectiveDisplayFormat.value)
  if (!parsed || props.disabledDate?.(parsed)) return // invalid: restore display

  if (isDateTime.value) {
    selectedDate.value = parsed
    selectedHours.value = parsed.getHours()
    selectedMinutes.value = parsed.getMinutes()
    selectedSeconds.value = parsed.getSeconds()
  } else {
    selectedDate.value = parsed
  }
  viewDate.value = new Date(parsed)
  emitValue(parsed)
  if (closePanel && visible.value) {
    visible.value = false
  }
}

function handleInputFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleInputBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
  commitManualInput(false)
  formItem?.validate('blur')
}

// ---- Date selection ----
function selectDate(cell: CalendarCell) {
  if (cell.isDisabled) return

  if (isRange.value) {
    // Range mode
    if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
      // Start new range
      rangeStart.value = cell.date
      rangeEnd.value = null
      // Initialize times if datetimerange
      if (props.type === 'datetimerange') {
        if (rangeStartHours.value === 0 && rangeStartMinutes.value === 0) {
          setNowTime()
          rangeStartHours.value = selectedHours.value
          rangeStartMinutes.value = selectedMinutes.value
          rangeStartSeconds.value = selectedSeconds.value
        }
      }
    } else {
      // Set end date
      if (cell.date.getTime() < rangeStart.value.getTime()) {
        rangeEnd.value = rangeStart.value
        rangeStart.value = cell.date
      } else {
        rangeEnd.value = cell.date
      }
      // For datetimerange, don't auto-close — user needs to confirm time
      if (props.type !== 'datetimerange') {
        const range: [Date, Date] = [rangeStart.value!, rangeEnd.value]
        emitValue(range)
        closePicker()
      } else {
        // Initialize end time if not set
        if (rangeEndHours.value === 0 && rangeEndMinutes.value === 0) {
          rangeEndHours.value = 23
          rangeEndMinutes.value = 59
          rangeEndSeconds.value = 59
        }
      }
    }
  } else if (isWeek.value) {
    // Week mode: select the entire week
    const weekStart = getWeekStart(cell.date)
    selectedDate.value = weekStart
    emitValue(weekStart)
    closePicker()
  } else if (isDateTime.value) {
    // DateTime mode: store date, show time panel
    selectedDate.value = cell.date
    if (selectedHours.value === 0 && selectedMinutes.value === 0 && selectedSeconds.value === 0) {
      setNowTime()
    }
    // Don't auto-close, user needs to confirm time
  } else {
    // Single date mode
    selectedDate.value = cell.date
    emitValue(cell.date)
    closePicker()
  }
}

function handleCellHover(cell: CalendarCell) {
  if (isRange.value && rangeStart.value && !rangeEnd.value && !cell.isDisabled) {
    hoveringDate.value = cell.date
  }
}

function handleClear() {
  selectedDate.value = null
  rangeStart.value = null
  rangeEnd.value = null
  emitValue('')
}

// ---- Month / Year selection ----
function selectMonth(monthIndex: number) {
  const d = new Date(viewDate.value)
  d.setMonth(monthIndex)
  viewDate.value = new Date(d)
  if (isMonth.value) {
    // Month type: emit immediately
    selectedDate.value = new Date(d.getFullYear(), monthIndex, 1)
    emitValue(selectedDate.value)
    closePicker()
  } else {
    // Switch to date panel
    panelMode.value = 'date'
  }
}

function selectYear(year: number) {
  const d = new Date(viewDate.value)
  d.setFullYear(year)
  viewDate.value = new Date(d)
  if (isYear.value) {
    // Year type: emit immediately
    selectedDate.value = new Date(year, 0, 1)
    emitValue(selectedDate.value)
    closePicker()
  } else {
    // Switch to month panel
    panelMode.value = 'month'
  }
}

// ---- Year grid (12 years per page) ----
const yearRange = computed(() => {
  const currentYear = viewDate.value.getFullYear()
  const startYear = Math.floor(currentYear / 10) * 10
  return Array.from({ length: 12 }, (_, i) => startYear + i - 1)
})

const yearRangeLabel = computed(() => {
  const years = yearRange.value
  return `${years[1]} - ${years[10]}`
})

// ---- Time handling for datetime ----
function setNowTime() {
  const now = new Date()
  selectedHours.value = now.getHours()
  selectedMinutes.value = now.getMinutes()
  selectedSeconds.value = now.getSeconds()
}

function confirmDateTime() {
  if (selectedDate.value) {
    const d = new Date(selectedDate.value)
    d.setHours(selectedHours.value, selectedMinutes.value, selectedSeconds.value)
    selectedDate.value = d
    emitValue(d)
  }
  closePicker()
}

/** Confirm date time range selection */
function confirmDateTimeRange() {
  if (rangeStart.value && rangeEnd.value) {
    const start = new Date(rangeStart.value)
    start.setHours(rangeStartHours.value, rangeStartMinutes.value, rangeStartSeconds.value)
    const end = new Date(rangeEnd.value)
    end.setHours(rangeEndHours.value, rangeEndMinutes.value, rangeEndSeconds.value)
    rangeStart.value = start
    rangeEnd.value = end
    const range: [Date, Date] = [start, end]
    emitValue(range)
    closePicker()
  }
}

// ---- Shortcuts ----
function applyShortcut(shortcut: DatePickerShortcut) {
  const value = typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value

  if (Array.isArray(value)) {
    rangeStart.value = value[0]
    rangeEnd.value = value[1]
    viewDate.value = new Date(value[0])
    const range: [Date, Date] = [value[0], value[1]]
    emitValue(range)
    closePicker()
  } else {
    selectedDate.value = value
    viewDate.value = new Date(value)
    emitValue(value)
    closePicker()
  }
}

const showClear = computed(
  () =>
    props.clearable &&
    !isDisabled.value &&
    visible.value &&
    (selectedDate.value || (rangeStart.value && rangeEnd.value))
)

// ---- Classes ----
const containerClasses = computed(() => [
  ns.b(),
  ns.m(effectiveSize.value),
  ns.is('disabled', isDisabled.value),
  ns.is('focused', isFocused.value),
  ns.is('range', isRange.value),
])

const headerLabel = computed(() => {
  const y = viewDate.value.getFullYear()
  if (panelMode.value === 'year') {
    return yearRangeLabel.value
  }
  if (panelMode.value === 'month') {
    return `${y} ${t('zc.datePicker.year')}`
  }
  const m = MONTHS.value[viewDate.value.getMonth()]
  return `${y} ${t('zc.datePicker.year')} ${m}`
})

// Switch panel to month/year by clicking header label
function switchToMonthPanel() {
  if (panelMode.value === 'date') panelMode.value = 'month'
}
function switchToYearPanel() {
  if (panelMode.value === 'month') panelMode.value = 'year'
}

defineExpose({
  /** Open the date picker panel */
  openPicker,
  /** Close the date picker panel */
  closePicker,
  /** Toggle the date picker panel */
  togglePicker,
  /** Confirm date time range selection */
  confirmDateTimeRange,
  /** Focus the trigger input */
  focus,
  /** Blur the trigger input */
  blur,
  /** Current visible state */
  visible,
})
</script>

<template>
  <div ref="triggerRef" :class="containerClasses" @click="togglePicker">
    <div :class="ns.e('wrapper')">
      <!-- Calendar icon -->
      <span :class="ns.e('icon')">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" stroke-linecap="round" />
        </svg>
      </span>

      <!-- Range mode -->
      <template v-if="isRange">
        <input
          :class="ns.e('input')"
          :value="rangeDisplayStart"
          :placeholder="startPlaceholderText"
          :disabled="isDisabled"
          readonly
        />
        <span :class="ns.e('separator')">—</span>
        <input
          :class="ns.e('input')"
          :value="rangeDisplayEnd"
          :placeholder="endPlaceholderText"
          :disabled="isDisabled"
          readonly
        />
      </template>

      <!-- Single date mode -->
      <template v-else>
        <input
          :class="ns.e('input')"
          :value="editingText ?? singleDisplayValue"
          :placeholder="placeholderText"
          :disabled="isDisabled"
          :readonly="!editable"
          :aria-label="placeholderText"
          @input="handleManualInput"
          @keydown.enter.prevent="commitManualInput(true)"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </template>

      <!-- Clear -->
      <span v-if="showClear" :class="ns.e('clear')" @click.stop="handleClear">
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
    </div>

    <!-- Dropdown panel (teleported to body so it is not clipped by overflow ancestors) -->
    <Teleport to="body">
      <transition name="zc-date-picker-dropdown">
        <div v-if="visible" ref="dropdownRef" :style="dropdownStyle" :class="ns.e('panel')">
          <div :class="ns.e('body')">
            <!-- Shortcuts sidebar -->
            <div v-if="shortcuts && shortcuts.length" :class="ns.e('shortcuts')">
              <button
                v-for="(sc, i) in shortcuts"
                :key="i"
                :class="ns.e('shortcut')"
                @click.stop="applyShortcut(sc)"
              >
                {{ sc.text }}
              </button>
            </div>

            <!-- Calendar -->
            <div :class="ns.e('calendar')">
              <!-- Header -->
              <div :class="ns.e('header')">
                <button
                  :class="ns.e('prev-year')"
                  type="button"
                  @click.stop="panelMode === 'year' ? prevYearRange() : prevYear()"
                >
                  «
                </button>
                <button :class="ns.e('prev-month')" type="button" @click.stop="prevMonth">‹</button>
                <span
                  :class="[ns.e('header-label'), { 'is-clickable': panelMode !== 'year' }]"
                  @click.stop="
                    panelMode === 'date'
                      ? switchToMonthPanel()
                      : panelMode === 'month'
                        ? switchToYearPanel()
                        : undefined
                  "
                  >{{ headerLabel }}</span
                >
                <button :class="ns.e('next-month')" type="button" @click.stop="nextMonth">›</button>
                <button
                  :class="ns.e('next-year')"
                  type="button"
                  @click.stop="panelMode === 'year' ? nextYearRange() : nextYear()"
                >
                  »
                </button>
              </div>

              <!-- Year panel -->
              <div v-if="panelMode === 'year'" :class="ns.e('year-grid')">
                <div
                  v-for="yr in yearRange"
                  :key="yr"
                  :class="[
                    ns.e('year-cell'),
                    ns.is('selected', !!(selectedDate && selectedDate.getFullYear() === yr)),
                    ns.is('current', new Date().getFullYear() === yr),
                    ns.is('disabled', isDateDisabled(new Date(yr, 0, 1))),
                  ]"
                  @click.stop="!isDateDisabled(new Date(yr, 0, 1)) && selectYear(yr)"
                >
                  {{ yr }}
                </div>
              </div>

              <!-- Month panel -->
              <div v-else-if="panelMode === 'month'" :class="ns.e('month-grid')">
                <div
                  v-for="(m, idx) in MONTHS"
                  :key="idx"
                  :class="[
                    ns.e('month-cell'),
                    ns.is(
                      'selected',
                      !!(
                        selectedDate &&
                        isSameMonth(selectedDate, new Date(viewDate.getFullYear(), idx, 1))
                      )
                    ),
                    ns.is(
                      'current',
                      isSameMonth(new Date(), new Date(viewDate.getFullYear(), idx, 1))
                    ),
                    ns.is('disabled', isDateDisabled(new Date(viewDate.getFullYear(), idx, 1))),
                  ]"
                  @click.stop="
                    !isDateDisabled(new Date(viewDate.getFullYear(), idx, 1)) && selectMonth(idx)
                  "
                >
                  {{ m }}
                </div>
              </div>

              <!-- Date panel (default) -->
              <template v-else>
                <!-- Weekday headers -->
                <div :class="ns.e('weekdays')">
                  <span v-for="day in WEEKDAYS" :key="day" :class="ns.e('weekday')">{{ day }}</span>
                </div>

                <!-- Days grid -->
                <div :class="ns.e('days')">
                  <div
                    v-for="(cell, i) in calendarCells"
                    :key="i"
                    :class="[
                      ns.e('day'),
                      ns.is('other-month', !cell.isCurrentMonth),
                      ns.is('today', cell.isToday),
                      ns.is('disabled', cell.isDisabled),
                      ns.is('selected', !isWeek && isSameDay(selectedDate, cell.date)),
                      ns.is(
                        'week-selected',
                        !!(isWeek && selectedDate && isSameWeek(selectedDate, cell.date))
                      ),
                      ns.is('range-start', isRangeStart(cell.date)),
                      ns.is('range-end', isRangeEnd(cell.date)),
                      ns.is('in-range', isInRange(cell.date)),
                    ]"
                    @click.stop="selectDate(cell)"
                    @mouseenter="handleCellHover(cell)"
                  >
                    {{ cell.date.getDate() }}
                  </div>
                </div>
              </template>
            </div>

            <!-- Time panel (for datetime mode) -->
            <div v-if="isDateTime && selectedDate" :class="ns.e('time-panel')">
              <div :class="ns.e('time-inputs')">
                <input
                  v-model.number="selectedHours"
                  type="number"
                  min="0"
                  max="23"
                  :class="ns.e('time-input')"
                  aria-label="Hours"
                />
                <span>:</span>
                <input
                  v-model.number="selectedMinutes"
                  type="number"
                  min="0"
                  max="59"
                  :class="ns.e('time-input')"
                  aria-label="Minutes"
                />
                <span>:</span>
                <input
                  v-model.number="selectedSeconds"
                  type="number"
                  min="0"
                  max="59"
                  :class="ns.e('time-input')"
                  aria-label="Seconds"
                />
              </div>
              <button :class="ns.e('time-confirm')" type="button" @click.stop="confirmDateTime">
                {{ t('zc.datePicker.confirm') || 'OK' }}
              </button>
            </div>

            <!-- Time panel for datetimerange mode -->
            <div
              v-if="type === 'datetimerange' && rangeStart && rangeEnd"
              :class="ns.e('time-panel')"
            >
              <div :class="ns.e('time-range')">
                <div :class="ns.e('time-inputs')">
                  <input
                    v-model.number="rangeStartHours"
                    type="number"
                    min="0"
                    max="23"
                    :class="ns.e('time-input')"
                    aria-label="Start Hours"
                  />
                  <span>:</span>
                  <input
                    v-model.number="rangeStartMinutes"
                    type="number"
                    min="0"
                    max="59"
                    :class="ns.e('time-input')"
                    aria-label="Start Minutes"
                  />
                  <span>:</span>
                  <input
                    v-model.number="rangeStartSeconds"
                    type="number"
                    min="0"
                    max="59"
                    :class="ns.e('time-input')"
                    aria-label="Start Seconds"
                  />
                </div>
                <span :class="ns.e('separator')">—</span>
                <div :class="ns.e('time-inputs')">
                  <input
                    v-model.number="rangeEndHours"
                    type="number"
                    min="0"
                    max="23"
                    :class="ns.e('time-input')"
                    aria-label="End Hours"
                  />
                  <span>:</span>
                  <input
                    v-model.number="rangeEndMinutes"
                    type="number"
                    min="0"
                    max="59"
                    :class="ns.e('time-input')"
                    aria-label="End Minutes"
                  />
                  <span>:</span>
                  <input
                    v-model.number="rangeEndSeconds"
                    type="number"
                    min="0"
                    max="59"
                    :class="ns.e('time-input')"
                    aria-label="End Seconds"
                  />
                </div>
              </div>
              <button
                :class="ns.e('time-confirm')"
                type="button"
                @click.stop="confirmDateTimeRange"
              >
                {{ t('zc.datePicker.confirm') || 'OK' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcDatePicker styles
 * ============================================================ */

.zc-date-picker {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--text-zc-base, 14px);
}

/* ---- Wrapper ---- */
.zc-date-picker__wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 11px;
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  box-sizing: border-box;
  transition: border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  cursor: pointer;
}

.zc-date-picker__wrapper:hover {
  border-color: var(--color-zc-primary-300, #a0cfff);
}

.zc-date-picker.is-focused .zc-date-picker__wrapper {
  border-color: var(--color-zc-primary-500, #409eff);
  box-shadow: 0 0 0 2px var(--color-zc-primary-50, #ecf5ff);
}

.zc-date-picker.is-disabled .zc-date-picker__wrapper {
  background: var(--color-zc-fill-light, #f5f7fa);
  border-color: var(--color-zc-border-light, #e4e7ed);
  cursor: not-allowed;
}

/* ---- Sizes ---- */
.zc-date-picker--large .zc-date-picker__wrapper {
  min-height: 42px;
  font-size: var(--text-zc-md, 16px);
}
.zc-date-picker--small .zc-date-picker__wrapper {
  min-height: 28px;
  font-size: var(--text-zc-sm, 13px);
}

/* ---- Input ---- */
.zc-date-picker__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-zc-text-primary, #303133);
  font-size: inherit;
  min-width: 0;
  cursor: pointer;
}

.zc-date-picker__input::placeholder {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-date-picker__input:disabled {
  cursor: not-allowed;
}

/* ---- Icon / Separator / Clear ---- */
.zc-date-picker__icon {
  display: inline-flex;
  color: var(--color-zc-text-secondary, #909399);
  flex-shrink: 0;
}

.zc-date-picker__separator {
  color: var(--color-zc-text-secondary, #909399);
  flex-shrink: 0;
}

.zc-date-picker__clear {
  display: inline-flex;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  flex-shrink: 0;
}

.zc-date-picker__clear:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* ---- Dropdown panel ---- */
.zc-date-picker__panel {
  position: absolute;
  z-index: var(--z-zc-dropdown, 1000);
  background: var(--color-zc-white, #fff);
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: var(--radius-zc-base, 4px);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  box-sizing: border-box;
}

.zc-date-picker__body {
  display: flex;
}

/* ---- Shortcuts ---- */
.zc-date-picker__shortcuts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-right: 1px solid var(--color-zc-border-lighter, #ebeef5);
}

.zc-date-picker__shortcut {
  border: none;
  background: transparent;
  padding: 6px 12px;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-sm, 13px);
  white-space: nowrap;
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-date-picker__shortcut:hover {
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-500, #409eff);
}

/* ---- Calendar ---- */
.zc-date-picker__calendar {
  padding: 8px 12px;
}

/* ---- Header ---- */
.zc-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 4px;
}

.zc-date-picker__header button {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  font-size: 16px;
  padding: 4px 6px;
  border-radius: var(--radius-zc-base, 4px);
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-date-picker__header button:hover {
  color: var(--color-zc-primary-500, #409eff);
  background: var(--color-zc-primary-50, #ecf5ff);
}

.zc-date-picker__header-label {
  font-size: var(--text-zc-base, 14px);
  font-weight: 600;
  color: var(--color-zc-text-primary, #303133);
  flex: 1;
  text-align: center;
}

/* ---- Weekday row ---- */
.zc-date-picker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.zc-date-picker__weekday {
  text-align: center;
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-text-secondary, #909399);
  padding: 4px 0;
}

/* ---- Days grid ---- */
.zc-date-picker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.zc-date-picker__day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-regular, #606266);
  transition: all var(--transition-duration-zc-fast, 0.15s);
  position: relative;
}

.zc-date-picker__day:hover:not(.is-disabled):not(.is-other-month) {
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-500, #409eff);
}

.zc-date-picker__day.is-other-month {
  color: var(--color-zc-text-placeholder, #a8abb2);
}

.zc-date-picker__day.is-today {
  font-weight: 600;
  color: var(--color-zc-primary-500, #409eff);
  border: 1px solid var(--color-zc-primary-200, #c6e2ff);
}

.zc-date-picker__day.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
  text-decoration: line-through;
}

.zc-date-picker__day.is-selected,
.zc-date-picker__day.is-range-start,
.zc-date-picker__day.is-range-end {
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-date-picker__day.is-selected:hover,
.zc-date-picker__day.is-range-start:hover,
.zc-date-picker__day.is-range-end:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

.zc-date-picker__day.is-in-range {
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-500, #409eff);
  border-radius: 0;
}

.zc-date-picker__day.is-range-start {
  border-radius: var(--radius-zc-base, 4px) 0 0 var(--radius-zc-base, 4px);
}

.zc-date-picker__day.is-range-end {
  border-radius: 0 var(--radius-zc-base, 4px) var(--radius-zc-base, 4px) 0;
}

/* ---- Year / Month grid panels ---- */
.zc-date-picker__year-grid,
.zc-date-picker__month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  min-width: 280px;
}

.zc-date-picker__year-cell,
.zc-date-picker__month-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-regular, #606266);
  transition: all var(--transition-duration-zc-fast, 0.15s);
}

.zc-date-picker__year-cell:hover:not(.is-disabled),
.zc-date-picker__month-cell:hover:not(.is-disabled) {
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-500, #409eff);
}

.zc-date-picker__year-cell.is-current,
.zc-date-picker__month-cell.is-current {
  font-weight: 600;
  color: var(--color-zc-primary-500, #409eff);
}

.zc-date-picker__year-cell.is-selected,
.zc-date-picker__month-cell.is-selected {
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
}

.zc-date-picker__year-cell.is-disabled,
.zc-date-picker__month-cell.is-disabled {
  color: var(--color-zc-text-placeholder, #a8abb2);
  cursor: not-allowed;
}

/* ---- Header label clickable ---- */
.zc-date-picker__header-label.is-clickable {
  cursor: pointer;
}

.zc-date-picker__header-label.is-clickable:hover {
  color: var(--color-zc-primary-500, #409eff);
}

/* ---- Week selected ---- */
.zc-date-picker__day.is-week-selected {
  background: var(--color-zc-primary-50, #ecf5ff);
  color: var(--color-zc-primary-500, #409eff);
}

/* ---- Time panel (datetime mode) ---- */
.zc-date-picker__time-panel {
  padding: 8px 12px;
  border-top: 1px solid var(--color-zc-border-lighter, #ebeef5);
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.zc-date-picker__time-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zc-date-picker__time-input {
  width: 42px;
  text-align: center;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  padding: 2px 4px;
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-primary, #303133);
  outline: none;
}

.zc-date-picker__time-input:focus {
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-date-picker__time-confirm {
  border: none;
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
  padding: 4px 12px;
  border-radius: var(--radius-zc-base, 4px);
  cursor: pointer;
  font-size: var(--text-zc-sm, 13px);
  transition: background var(--transition-duration-zc-fast, 0.15s);
}

.zc-date-picker__time-confirm:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

/* ---- Time range panel (datetimerange mode) ---- */
.zc-date-picker__time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ---- Dropdown transition ---- */
.zc-date-picker-dropdown-enter-active,
.zc-date-picker-dropdown-leave-active {
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-date-picker-dropdown-enter-from,
.zc-date-picker-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
