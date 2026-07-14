<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcCalendar' })

/** Date range for highlighting cells. */
export interface CalendarDateRange {
  start: Date
  end: Date
}

/** Information passed to the date-cell slot and scope slot. */
export interface CalendarDateCell {
  /** The date object for this cell */
  date: Date
  /** Day of month (1–31) */
  day: number
  /** Whether this date belongs to the currently displayed month */
  isInMonth: boolean
  /** Whether this date is today */
  isToday: boolean
  /** Whether this date falls within the `range` prop */
  isInRange: boolean
  /** 0 (Sun) – 6 (Sat) */
  dayOfWeek: number
  /** Formatted text for this date */
  text: string
}

const props = withDefaults(
  defineProps<{
    /** The currently selected / displayed date (v-model) */
    modelValue?: Date
    /** Highlight a date range */
    range?: CalendarDateRange
    /** Weekday that starts the week: 0=Sun, 1=Mon, … 6=Sat */
    firstDayOfWeek?: number
    /** Custom cell renderer — when provided overrides the default slot content */
    dateCellRender?: (data: CalendarDateCell) => string
  }>(),
  {
    modelValue: () => new Date(),
    firstDayOfWeek: 0,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
  (e: 'select', value: Date): void
  (e: 'change', value: Date): void
}>()

const ns = useNamespace('calendar')
const { t } = useLocale()

// ---- Current view date (the month being displayed) ----
const viewDate = ref(new Date(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    if (val) viewDate.value = new Date(val)
  }
)

// ---- Weekday labels reordered by firstDayOfWeek ----
const weekdayKeys = [
  'zc.datePicker.weekdays.sun',
  'zc.datePicker.weekdays.mon',
  'zc.datePicker.weekdays.tue',
  'zc.datePicker.weekdays.wed',
  'zc.datePicker.weekdays.thu',
  'zc.datePicker.weekdays.fri',
  'zc.datePicker.weekdays.sat',
]

const weekdays = computed(() => {
  const labels = weekdayKeys.map((k) => t(k))
  const offset = props.firstDayOfWeek % 7
  return [...labels.slice(offset), ...labels.slice(0, offset)]
})

// ---- Month labels ----
const monthKeys = [
  'zc.datePicker.months.jan',
  'zc.datePicker.months.feb',
  'zc.datePicker.months.mar',
  'zc.datePicker.months.apr',
  'zc.datePicker.months.may',
  'zc.datePicker.months.jun',
  'zc.datePicker.months.jul',
  'zc.datePicker.months.aug',
  'zc.datePicker.months.sep',
  'zc.datePicker.months.oct',
  'zc.datePicker.months.nov',
  'zc.datePicker.months.dec',
]

const headerLabel = computed(() => {
  const y = viewDate.value.getFullYear()
  const m = t(monthKeys[viewDate.value.getMonth()])
  return `${y} ${t('zc.datePicker.year')} ${m}`
})

// ---- Date helpers ----
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

function stripTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function isInRange(date: Date): boolean {
  if (!props.range) return false
  const t = stripTime(date)
  return t >= stripTime(props.range.start) && t <= stripTime(props.range.end)
}

// ---- Calendar grid generation ----
const calendarCells = computed(() => {
  const cells: CalendarDateCell[] = []
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  // Account for firstDayOfWeek
  let startOffset = (firstDay.getDay() - props.firstDayOfWeek + 7) % 7

  // Start date = first day shown (may be in previous month)
  const startDate = new Date(year, month, 1 - startOffset)

  // Always show 6 rows (42 cells) for a stable layout
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    cells.push({
      date,
      day: date.getDate(),
      isInMonth: date.getMonth() === month,
      isToday: isToday(date),
      isInRange: isInRange(date),
      dayOfWeek: date.getDay(),
      text: String(date.getDate()),
    })
  }

  return cells
})

// Split into weeks (rows of 7) for template iteration
const calendarWeeks = computed(() => {
  const weeks: CalendarDateCell[][] = []
  for (let i = 0; i < calendarCells.value.length; i += 7) {
    weeks.push(calendarCells.value.slice(i, i + 7))
  }
  return weeks
})

// ---- Navigation ----
function prevMonth() {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() - 1)
  viewDate.value = d
}

function nextMonth() {
  const d = new Date(viewDate.value)
  d.setMonth(d.getMonth() + 1)
  viewDate.value = d
}

function prevYear() {
  const d = new Date(viewDate.value)
  d.setFullYear(d.getFullYear() - 1)
  viewDate.value = d
}

function nextYear() {
  const d = new Date(viewDate.value)
  d.setFullYear(d.getFullYear() + 1)
  viewDate.value = d
}

function goToday() {
  viewDate.value = new Date()
}

// ---- Selection ----
function selectDate(cell: CalendarDateCell) {
  // Allow selecting out-of-month dates (will navigate to that month)
  if (!cell.isInMonth) {
    viewDate.value = new Date(cell.date)
  }
  emit('update:modelValue', cell.date)
  emit('select', cell.date)
  emit('change', cell.date)
}

// ---- Expose for parent access ----
defineExpose({
  /** Navigate to the previous month */
  prevMonth,
  /** Navigate to the next month */
  nextMonth,
  /** Navigate to the previous year */
  prevYear,
  /** Navigate to the next year */
  nextYear,
  /** Jump to today */
  goToday,
  /** The current view date */
  viewDate,
})
</script>

<template>
  <div :class="ns.b()">
    <!-- Header -->
    <div :class="ns.e('header')">
      <div :class="ns.e('title')">{{ headerLabel }}</div>
      <div :class="ns.e('actions')">
        <button
          :class="[ns.e('btn'), ns.e('btn-prev-year')]"
          type="button"
          :aria-label="t('zc.datePicker.year') + ' <<'"
          @click="prevYear"
        >
          «
        </button>
        <button :class="[ns.e('btn'), ns.e('btn-prev-month')]" type="button" @click="prevMonth">
          ‹
        </button>
        <button :class="[ns.e('btn'), ns.e('btn-today')]" type="button" @click="goToday">
          {{ t('zc.calendar.today') }}
        </button>
        <button :class="[ns.e('btn'), ns.e('btn-next-month')]" type="button" @click="nextMonth">
          ›
        </button>
        <button :class="[ns.e('btn'), ns.e('btn-next-year')]" type="button" @click="nextYear">
          »
        </button>
      </div>
    </div>

    <!-- Body -->
    <div :class="ns.e('body')">
      <!-- Weekday headers -->
      <div :class="ns.e('weekdays')">
        <div v-for="(day, i) in weekdays" :key="i" :class="ns.e('weekday')">
          {{ day }}
        </div>
      </div>

      <!-- Days grid -->
      <div :class="ns.e('days')">
        <template v-for="(week, wi) in calendarWeeks" :key="wi">
          <div
            v-for="(cell, ci) in week"
            :key="wi * 7 + ci"
            :class="[
              ns.e('day'),
              ns.is('other-month', !cell.isInMonth),
              ns.is('today', cell.isToday),
              ns.is('selected', isSameDay(modelValue, cell.date)),
              ns.is('in-range', cell.isInRange),
            ]"
            role="button"
            tabindex="0"
            @click="selectDate(cell)"
            @keydown.enter.prevent="selectDate(cell)"
            @keydown.space.prevent="selectDate(cell)"
          >
            <slot name="date-cell" :data="cell">
              <span :class="ns.e('day-text')">{{ cell.text }}</span>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCalendar styles
 * ============================================================ */

.zc-calendar {
  --zc-calendar-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-calendar-bg: var(--color-zc-white, #fff);
  --zc-calendar-text: var(--color-zc-text-primary, #303133);
  --zc-calendar-text-secondary: var(--color-zc-text-secondary, #909399);
  --zc-calendar-text-placeholder: var(--color-zc-text-placeholder, #a8abb2);
  --zc-calendar-primary: var(--color-zc-primary-500, #409eff);
  --zc-calendar-primary-light: var(--color-zc-primary-50, #ecf5ff);
  --zc-calendar-cell-size: 36px;
  --zc-calendar-cell-gap: 2px;

  background: var(--zc-calendar-bg);
  border: 1px solid var(--zc-calendar-border-color);
  border-radius: var(--radius-zc-base, 4px);
  overflow: hidden;
  font-size: var(--text-zc-base, 14px);
}

/* ---- Header ---- */
.zc-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--zc-calendar-border-color);
}

.zc-calendar__title {
  font-size: var(--text-zc-lg, 16px);
  font-weight: 600;
  color: var(--zc-calendar-text);
  user-select: none;
}

.zc-calendar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zc-calendar__btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--zc-calendar-text-secondary);
  font-size: var(--text-zc-base, 14px);
  padding: 4px 8px;
  border-radius: var(--radius-zc-base, 4px);
  transition: all var(--transition-duration-zc-fast, 0.15s);
  line-height: 1;
  user-select: none;
}

.zc-calendar__btn:hover {
  color: var(--zc-calendar-primary);
  background: var(--zc-calendar-primary-light);
}

.zc-calendar__btn:focus-visible {
  outline: 2px solid var(--zc-calendar-primary);
  outline-offset: 1px;
}

.zc-calendar__btn-today {
  font-weight: 500;
  color: var(--zc-calendar-primary);
  padding: 4px 12px;
}

/* ---- Body ---- */
.zc-calendar__body {
  padding: 8px 12px 12px;
}

/* ---- Weekday row ---- */
.zc-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--zc-calendar-cell-gap);
}

.zc-calendar__weekday {
  text-align: center;
  font-size: var(--text-zc-xs, 12px);
  font-weight: 500;
  color: var(--zc-calendar-text-secondary);
  padding: 8px 0;
  user-select: none;
}

/* ---- Days grid ---- */
.zc-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--zc-calendar-cell-gap);
}

.zc-calendar__day {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--zc-calendar-cell-size);
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-sm, 13px);
  color: var(--zc-calendar-text);
  transition: all var(--transition-duration-zc-fast, 0.15s);
  position: relative;
  user-select: none;
}

.zc-calendar__day:hover {
  background: var(--zc-calendar-primary-light);
  color: var(--zc-calendar-primary);
}

.zc-calendar__day:focus-visible {
  outline: 2px solid var(--zc-calendar-primary);
  outline-offset: -2px;
}

.zc-calendar__day.is-other-month {
  color: var(--zc-calendar-text-placeholder);
}

.zc-calendar__day.is-other-month:hover {
  background: var(--zc-calendar-primary-light);
  color: var(--zc-calendar-primary);
}

.zc-calendar__day.is-today .zc-calendar__day-text {
  font-weight: 700;
  color: var(--zc-calendar-primary);
}

.zc-calendar__day.is-today {
  border: 1px solid var(--color-zc-primary-200, #c6e2ff);
}

.zc-calendar__day.is-selected {
  background: var(--zc-calendar-primary);
  color: var(--color-zc-white, #fff);
}

.zc-calendar__day.is-selected .zc-calendar__day-text {
  color: var(--color-zc-white, #fff);
}

.zc-calendar__day.is-selected:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

.zc-calendar__day.is-selected.is-today {
  border-color: var(--zc-calendar-primary);
}

.zc-calendar__day.is-in-range:not(.is-selected) {
  background: var(--zc-calendar-primary-light);
  color: var(--zc-calendar-primary);
  border-radius: 0;
}

/* ---- Dark mode ---- */
.zc-calendar:where(.dark, [data-theme='dark'], [data-mode='dark']) {
  --zc-calendar-border-color: var(--color-zc-border-base, #4c4d4f);
  --zc-calendar-bg: var(--color-zc-bg-overlay, #1d1e1f);
  --zc-calendar-text: var(--color-zc-text-primary, #e5eaf3);
  --zc-calendar-text-secondary: var(--color-zc-text-secondary, #a3a6ad);
  --zc-calendar-text-placeholder: var(--color-zc-text-placeholder, #8d9095);
}

/* Support parent dark mode selector */
.dark .zc-calendar {
  --zc-calendar-border-color: var(--color-zc-border-base, #4c4d4f);
  --zc-calendar-bg: var(--color-zc-bg-overlay, #1d1e1f);
  --zc-calendar-text: var(--color-zc-text-primary, #e5eaf3);
  --zc-calendar-text-secondary: var(--color-zc-text-secondary, #a3a6ad);
  --zc-calendar-text-placeholder: var(--color-zc-text-placeholder, #8d9095);
}

/* ---- Slot container (allows custom content to fill the cell) ---- */
.zc-calendar__day > :deep(*) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
