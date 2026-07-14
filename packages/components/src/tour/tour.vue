<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  useSlots,
  shallowRef,
} from 'vue'
import { useNamespace, useZIndex } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'
import type { TourPlacement, TourStep, TourTarget, TourIndicatorType } from './types'

defineOptions({ name: 'ZcTour' })

const props = withDefaults(
  defineProps<{
    /** Visibility (v-model) */
    modelValue?: boolean
    /** Alias — supports v-model:open */
    open?: boolean
    /** Tour steps configuration */
    steps?: TourStep[]
    /** Current step index (v-model:current) */
    current?: number
    /** Default placement */
    placement?: TourPlacement
    /** Show arrow */
    arrow?: boolean
    /** Show mask overlay */
    showMask?: boolean
    /** Close tour when clicking mask */
    closeOnOverlayClick?: boolean
    /** Enable keyboard navigation */
    keyboard?: boolean
    /** Highlight padding around target (px) */
    gap?: number
    /** Distance between popover and target (px) */
    offset?: number
    /** Mask background color */
    maskColor?: string
    /** Z-index */
    zIndex?: number
    /** Indicator type */
    indicator?: TourIndicatorType
    /** scrollIntoView options */
    // eslint-disable-next-line no-undef
    scrollIntoViewOptions?: ScrollIntoViewOptions
    /** Show Previous button */
    showPrevButton?: boolean
    /** Show Skip button */
    showSkipButton?: boolean
    /** Previous button text */
    prevButtonText?: string
    /** Next button text */
    nextButtonText?: string
    /** Finish button text */
    finishButtonText?: string
    /** Skip button text */
    skipButtonText?: string
  }>(),
  {
    modelValue: false,
    open: false,
    steps: () => [],
    current: 0,
    placement: 'bottom',
    arrow: true,
    showMask: true,
    closeOnOverlayClick: true,
    keyboard: true,
    gap: 6,
    offset: 12,
    maskColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: undefined,
    indicator: 'default',
    scrollIntoViewOptions: () => ({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    }),
    showPrevButton: true,
    showSkipButton: true,
    prevButtonText: '上一步',
    nextButtonText: '下一步',
    finishButtonText: '完成',
    skipButtonText: '跳过',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:open', val: boolean): void
  (e: 'update:current', val: number): void
  (e: 'change', currentStep: number): void
  (e: 'close', currentStep: number): void
  (e: 'finish'): void
}>()

const ns = useNamespace('tour')
const { nextZIndex } = useZIndex()
const slots = useSlots()

// ── State ────────────────────────────────────────────────────────
const internalOpen = ref(false)
const internalCurrent = ref(0)
const zIndexRef = ref(2001)
const panelRef = shallowRef<HTMLElement>()

/** Computed: combined open state from modelValue and open prop */
const isOpen = computed(() => props.modelValue || props.open)

/** Computed: current step data */
const currentStep = computed<TourStep | undefined>(() => {
  const steps = props.steps || []
  return steps[internalCurrent.value]
})

/** Computed: total steps count */
const totalSteps = computed(() => (props.steps || []).length)

/** Computed: whether current step is the last one */
const isLast = computed(() => internalCurrent.value >= totalSteps.value - 1)

/** Computed: whether current step is the first one */
const isFirst = computed(() => internalCurrent.value <= 0)

// ── Target resolution & position tracking ────────────────────────
const targetRect = ref<DOMRect | null>(null)

function resolveTarget(target?: TourTarget): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target)
  }
  if (typeof target === 'function') {
    return target()
  }
  return target
}

function updateTargetRect() {
  const step = currentStep.value
  if (!step) {
    targetRect.value = null
    return
  }
  const el = resolveTarget(step.target)
  if (el) {
    targetRect.value = el.getBoundingClientRect()
  } else {
    targetRect.value = null
  }
}

// ── SVG mask path ────────────────────────────────────────────────
const gapValue = computed(() => {
  const step = currentStep.value
  return step?.gap ?? props.gap
})

const maskPath = computed(() => {
  if (!isClient) return ''
  const vw = window.innerWidth
  const vh = window.innerHeight
  const rect = targetRect.value

  if (!rect) {
    // No target — full screen mask
    return `M0 0 L${vw} 0 L${vw} ${vh} L0 ${vh} Z`
  }

  const g = gapValue.value
  const left = rect.left - g
  const top = rect.top - g
  const right = rect.right + g
  const bottom = rect.bottom + g
  const r = 4 // border radius of the cutout

  // Full-screen rectangle (clockwise)
  // Target rectangle (counter-clockwise for evenodd hole)
  return [
    `M0 0 L${vw} 0 L${vw} ${vh} L0 ${vh} Z`,
    `M${left + r} ${top}`,
    `L${right - r} ${top}`,
    `Q${right} ${top} ${right} ${top + r}`,
    `L${right} ${bottom - r}`,
    `Q${right} ${bottom} ${right - r} ${bottom}`,
    `L${left + r} ${bottom}`,
    `Q${left} ${bottom} ${left} ${bottom - r}`,
    `L${left} ${top + r}`,
    `Q${left} ${top} ${left + r} ${top}`,
    'Z',
  ].join(' ')
})

// ── Popover position computation ─────────────────────────────────
const offsetValue = computed(() => {
  const step = currentStep.value
  return step?.offset ?? props.offset
})

const effectivePlacement = computed<TourPlacement>(() => {
  return currentStep.value?.placement ?? props.placement
})

const showArrow = computed(() => {
  const step = currentStep.value
  return step?.showArrow ?? props.arrow
})

const popoverPosition = computed<Record<string, string>>(() => {
  const rect = targetRect.value
  const gap = gapValue.value
  const off = offsetValue.value
  const placement = effectivePlacement.value

  if (!rect) {
    // Center on screen if no target
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  const positions: Record<string, Record<string, string>> = {
    top: {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top - gap - off}px`,
      transform: 'translate(-50%, -100%)',
    },
    'top-start': {
      left: `${rect.left}px`,
      top: `${rect.top - gap - off}px`,
      transform: 'translateY(-100%)',
    },
    'top-end': {
      left: `${rect.right}px`,
      top: `${rect.top - gap - off}px`,
      transform: 'translate(-100%, -100%)',
    },
    bottom: {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + gap + off}px`,
      transform: 'translateX(-50%)',
    },
    'bottom-start': {
      left: `${rect.left}px`,
      top: `${rect.bottom + gap + off}px`,
    },
    'bottom-end': {
      left: `${rect.right}px`,
      top: `${rect.bottom + gap + off}px`,
      transform: 'translateX(-100%)',
    },
    left: {
      left: `${rect.left - gap - off}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translate(-100%, -50%)',
    },
    'left-start': {
      left: `${rect.left - gap - off}px`,
      top: `${rect.top}px`,
      transform: 'translateX(-100%)',
    },
    'left-end': {
      left: `${rect.left - gap - off}px`,
      top: `${rect.bottom}px`,
      transform: 'translate(-100%, -100%)',
    },
    right: {
      left: `${rect.right + gap + off}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translateY(-50%)',
    },
    'right-start': {
      left: `${rect.right + gap + off}px`,
      top: `${rect.top}px`,
    },
    'right-end': {
      left: `${rect.right + gap + off}px`,
      top: `${rect.bottom}px`,
      transform: 'translateY(-100%)',
    },
  }

  return positions[placement] || positions.bottom
})

const overlayStyle = computed(() => ({
  zIndex: props.zIndex ?? zIndexRef.value,
}))

// ── Auto-scroll to target ────────────────────────────────────────
function scrollToTarget() {
  const step = currentStep.value
  if (!step) return
  const el = resolveTarget(step.target)
  if (el && props.scrollIntoViewOptions && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView(props.scrollIntoViewOptions)
  }
}

// ── Open / Close ─────────────────────────────────────────────────
function doOpen() {
  internalOpen.value = true
  internalCurrent.value = props.current
  zIndexRef.value = nextZIndex()
  attachListeners()
  nextTick(() => {
    updateTargetRect()
    scrollToTarget()
  })
}

function doClose() {
  emit('close', internalCurrent.value)
  internalOpen.value = false
  emit('update:modelValue', false)
  emit('update:open', false)
}

// ── Navigation ───────────────────────────────────────────────────
function next() {
  if (isLast.value) {
    emit('finish')
    doClose()
    return
  }
  internalCurrent.value++
  emit('update:current', internalCurrent.value)
  emit('change', internalCurrent.value)
  nextTick(() => {
    updateTargetRect()
    scrollToTarget()
  })
}

function prev() {
  if (isFirst.value) return
  internalCurrent.value--
  emit('update:current', internalCurrent.value)
  emit('change', internalCurrent.value)
  nextTick(() => {
    updateTargetRect()
    scrollToTarget()
  })
}

function goTo(index: number) {
  if (index < 0 || index >= totalSteps.value) return
  internalCurrent.value = index
  emit('update:current', index)
  emit('change', index)
  nextTick(() => {
    updateTargetRect()
    scrollToTarget()
  })
}

function skip() {
  doClose()
}

// ── Overlay click ────────────────────────────────────────────────
function handleOverlayClick() {
  if (props.closeOnOverlayClick) {
    doClose()
  }
}

// ── Keyboard navigation ──────────────────────────────────────────
function handleKeydown(e: KeyboardEvent) {
  if (!internalOpen.value) return
  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      doClose()
      break
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      next()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      prev()
      break
  }
}

// ── Resize/scroll re-positioning ─────────────────────────────────
let resizeHandler: (() => void) | null = null
let scrollHandler: (() => void) | null = null

function attachListeners() {
  resizeHandler = () => updateTargetRect()
  scrollHandler = () => updateTargetRect()
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', scrollHandler, true)
  if (props.keyboard) {
    document.addEventListener('keydown', handleKeydown)
  }
}

function detachListeners() {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler, true)
    scrollHandler = null
  }
  document.removeEventListener('keydown', handleKeydown)
}

// ── Watchers ─────────────────────────────────────────────────────
watch(
  isOpen,
  (val) => {
    if (val && !internalOpen.value) {
      doOpen()
    } else if (!val && internalOpen.value) {
      internalOpen.value = false
    }
  },
  { immediate: true }
)

watch(internalOpen, (val) => {
  if (val) {
    attachListeners()
  } else {
    detachListeners()
  }
})

watch(
  () => props.current,
  (val) => {
    if (val !== internalCurrent.value && val >= 0 && val < totalSteps.value) {
      internalCurrent.value = val
      nextTick(() => {
        updateTargetRect()
        scrollToTarget()
      })
    }
  }
)

watch(
  () => internalCurrent.value,
  () => {
    nextTick(updateTargetRect)
  }
)

// ── Lifecycle ────────────────────────────────────────────────────
onMounted(() => {
  if (isOpen.value) {
    doOpen()
  }
})

onBeforeUnmount(() => {
  detachListeners()
})

// ── Expose methods ───────────────────────────────────────────────
defineExpose({
  open: () => {
    emit('update:modelValue', true)
    emit('update:open', true)
    doOpen()
  },
  close: doClose,
  next,
  prev,
  goTo,
})
</script>

<template>
  <Teleport to="body" :disabled="!internalOpen">
    <Transition name="zc-tour">
      <div v-if="internalOpen" :class="ns.e('overlay')" :style="overlayStyle">
        <!-- SVG Mask layer -->
        <template v-if="showMask">
          <svg :class="ns.e('mask')" width="100%" height="100%" :style="{ pointerEvents: 'none' }">
            <path
              :d="maskPath"
              :fill="maskColor"
              fill-rule="evenodd"
              style="pointer-events: auto; cursor: pointer"
              @click="handleOverlayClick"
            />
          </svg>
        </template>

        <!-- Clickable invisible overlay for closeOnOverlayClick when mask disabled -->
        <div
          v-if="!showMask && closeOnOverlayClick"
          :class="ns.e('click-catcher')"
          :style="{ background: 'transparent' }"
          @click="handleOverlayClick"
        />

        <!-- Popover panel -->
        <div
          ref="panelRef"
          :class="[ns.e('panel'), `zc-tour-panel--${effectivePlacement}`]"
          :style="popoverPosition"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header: indicator + close button -->
          <div :class="ns.e('header')">
            <!-- Indicator -->
            <div :class="ns.e('indicator')">
              <slot name="indicator" :current="internalCurrent" :total="totalSteps">
                <span v-if="indicator === 'default'" :class="ns.e('indicator-text')">
                  {{ internalCurrent + 1 }} / {{ totalSteps }}
                </span>
                <div v-else-if="indicator === 'dot'" :class="ns.e('indicator-dots')">
                  <span
                    v-for="(_, i) in totalSteps"
                    :key="i"
                    :class="[ns.e('indicator-dot'), ns.is('active', i === internalCurrent)]"
                  />
                </div>
              </slot>
            </div>

            <!-- Close / Skip button -->
            <button
              v-if="showSkipButton"
              :class="ns.e('close-btn')"
              type="button"
              :title="skipButtonText"
              :aria-label="skipButtonText"
              @click="skip"
            >
              <svg viewBox="0 0 24 24" fill="none" :class="ns.e('icon')">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <!-- Title -->
          <div v-if="currentStep?.title || slots.title" :class="ns.e('title')">
            <slot
              name="title"
              :step="currentStep"
              :current="internalCurrent"
              :payload="currentStep?.payload"
            >
              {{ currentStep?.title }}
            </slot>
          </div>

          <!-- Body / description -->
          <div :class="ns.e('body')">
            <slot
              name="description"
              :step="currentStep"
              :current="internalCurrent"
              :payload="currentStep?.payload"
            >
              {{ currentStep?.description }}
            </slot>
          </div>

          <!-- Footer: actions -->
          <div :class="ns.e('footer')">
            <slot
              name="actions"
              :step="currentStep"
              :current="internalCurrent"
              :payload="currentStep?.payload"
              :prev="prev"
              :next="next"
              :skip="skip"
              :is-first="isFirst"
              :is-last="isLast"
            >
              <button
                v-if="showPrevButton && !isFirst"
                :class="[ns.e('btn'), ns.e('btn--prev')]"
                type="button"
                @click="prev"
              >
                <slot name="prev-text">{{ prevButtonText }}</slot>
              </button>
              <button :class="[ns.e('btn'), ns.e('btn--next')]" type="button" @click="next">
                <slot v-if="!isLast" name="next-text">{{ nextButtonText }}</slot>
                <slot v-else name="finish-text">{{ finishButtonText }}</slot>
              </button>
            </slot>
          </div>

          <!-- Arrow -->
          <span v-if="showArrow" :class="[ns.e('arrow'), `zc-tour-arrow--${effectivePlacement}`]" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
 * ZcTour styles
 * ============================================================ */

.zc-tour__overlay {
  --zc-tour-bg-color: var(--color-zc-bg-base, #fff);
  --zc-tour-title-color: var(--color-zc-text-primary, #303133);
  --zc-tour-title-font-size: var(--text-zc-md, 16px);
  --zc-tour-text-color: var(--color-zc-text-regular, #606266);
  --zc-tour-font-size: var(--text-zc-base, 14px);
  --zc-tour-border-radius: var(--radius-zc-base, 4px);
  --zc-tour-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-tour-padding: 16px;
  --zc-tour-close-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-tour-mask-bg-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  inset: 0;
  z-index: 2001;
}

.zc-tour__mask {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.zc-tour__click-catcher {
  position: fixed;
  inset: 0;
}

/* ── Popover Panel ──────────────────────────────────── */
.zc-tour__panel {
  position: fixed;
  z-index: 2002;
  min-width: 320px;
  max-width: 420px;
  background: var(--color-zc-bg-base, #fff);
  border-radius: var(--radius-zc-lg, 8px);
  box-shadow: var(--shadow-zc-xl, 0 16px 48px 0 rgba(0, 0, 0, 0.16));
  padding: 16px 20px;
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-regular, #606266);
  line-height: 1.6;
}

/* ── Header ─────────────────────────────────────────── */
.zc-tour__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* ── Indicator ──────────────────────────────────────── */
.zc-tour__indicator-text {
  font-size: var(--text-zc-sm, 13px);
  color: var(--color-zc-text-secondary, #909399);
  font-weight: 500;
}

.zc-tour__indicator-dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.zc-tour__indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-zc-border-base, #dcdfe6);
  transition: background var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-tour__indicator-dot.is-active {
  background: var(--color-zc-primary-500, #409eff);
  width: 18px;
  border-radius: 3px;
}

/* ── Close button ───────────────────────────────────── */
.zc-tour__close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--zc-tour-close-color);
  cursor: pointer;
  border-radius: var(--zc-tour-border-radius);
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-tour__close-btn:hover {
  color: var(--color-zc-text-primary, #303133);
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-tour__icon {
  width: 16px;
  height: 16px;
}

/* ── Title ──────────────────────────────────────────── */
.zc-tour__title {
  font-size: var(--text-zc-lg, 16px);
  font-weight: 600;
  color: var(--color-zc-text-primary, #303133);
  line-height: 1.5;
  margin-bottom: 6px;
}

/* ── Body ───────────────────────────────────────────── */
.zc-tour__body {
  color: var(--color-zc-text-regular, #606266);
  font-size: var(--text-zc-base, 14px);
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

/* ── Footer ─────────────────────────────────────────── */
.zc-tour__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

/* ── Buttons ────────────────────────────────────────── */
.zc-tour__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  font-size: var(--zc-tour-font-size);
  border-radius: var(--zc-tour-border-radius);
  cursor: pointer;
  transition: all var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  border: 1px solid transparent;
  line-height: 1.5;
  white-space: nowrap;
}

.zc-tour__btn--prev {
  background: var(--color-zc-bg-base, #fff);
  border-color: var(--color-zc-border-base, #dcdfe6);
  color: var(--color-zc-text-regular, #606266);
}

.zc-tour__btn--prev:hover {
  color: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-400, #79bbff);
}

.zc-tour__btn--next {
  background: var(--color-zc-primary-500, #409eff);
  color: #fff;
}

.zc-tour__btn--next:hover {
  background: var(--color-zc-primary-600, #337ecc);
}

/* ── Arrow ──────────────────────────────────────────── */
.zc-tour__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-zc-bg-base, #fff);
  transform: rotate(45deg);
}

/* Arrow: top directions */
.zc-tour-arrow--top,
.zc-tour-arrow--top-start,
.zc-tour-arrow--top-end {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}
.zc-tour-arrow--top-start {
  left: 16px;
  margin-left: 0;
}
.zc-tour-arrow--top-end {
  right: 16px;
  left: auto;
  margin-left: 0;
}

/* Arrow: bottom directions */
.zc-tour-arrow--bottom,
.zc-tour-arrow--bottom-start,
.zc-tour-arrow--bottom-end {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}
.zc-tour-arrow--bottom-start {
  left: 16px;
  margin-left: 0;
}
.zc-tour-arrow--bottom-end {
  right: 16px;
  left: auto;
  margin-left: 0;
}

/* Arrow: left directions */
.zc-tour-arrow--left,
.zc-tour-arrow--left-start,
.zc-tour-arrow--left-end {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}
.zc-tour-arrow--left-start {
  top: 16px;
  margin-top: 0;
}
.zc-tour-arrow--left-end {
  bottom: 16px;
  top: auto;
  margin-top: 0;
}

/* Arrow: right directions */
.zc-tour-arrow--right,
.zc-tour-arrow--right-start,
.zc-tour-arrow--right-end {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}
.zc-tour-arrow--right-start {
  top: 16px;
  margin-top: 0;
}
.zc-tour-arrow--right-end {
  bottom: 16px;
  top: auto;
  margin-top: 0;
}

/* ── Transition ─────────────────────────────────────── */
.zc-tour-enter-active,
.zc-tour-leave-active {
  transition: opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-tour-enter-from,
.zc-tour-leave-to {
  opacity: 0;
}
</style>
