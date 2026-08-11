<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted, watch, readonly } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'
import { CAROUSEL_KEY } from './types'
import type { CarouselItemData } from './types'

defineOptions({ name: 'ZcCarousel' })

const props = withDefaults(
  defineProps<{
    height?: string | number
    initialIndex?: number
    trigger?: 'click' | 'hover'
    autoplay?: boolean
    interval?: number
    indicatorPosition?: 'outside' | 'none'
    arrow?: 'always' | 'hover' | 'never'
    type?: '' | 'card'
    loop?: boolean
    direction?: 'horizontal' | 'vertical'
    pauseOnHover?: boolean
  }>(),
  {
    height: '',
    initialIndex: 0,
    trigger: 'click',
    autoplay: false,
    interval: 3000,
    indicatorPosition: 'outside',
    arrow: 'hover',
    type: '',
    loop: true,
    direction: 'horizontal',
    pauseOnHover: true,
  }
)

const emit = defineEmits<{
  (e: 'change', current: number, prev: number): void
}>()

const ns = useNamespace('carousel')
const { t } = useLocale()

// ==================== State ====================
const activeIndex = ref(props.initialIndex)
const items = ref<CarouselItemData[]>([])
const isHovering = ref(false)
let uidCounter = 0
let autoplayTimer: ReturnType<typeof setInterval> | null = null

// ==================== Touch support ====================
const SWIPE_THRESHOLD = 50 // px
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function handleTouchEnd(e: TouchEvent) {
  if (e.changedTouches.length !== 1) return
  const dx = touchStartX - e.changedTouches[0].clientX
  const dy = touchStartY - e.changedTouches[0].clientY

  if (isVertical.value) {
    if (Math.abs(dy) > SWIPE_THRESHOLD) {
      if (dy > 0) next()
      else prev()
    }
  } else {
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) next()
      else prev()
    }
  }
}

// ==================== Item management ====================
function addItem(item: CarouselItemData) {
  item.uid = ++uidCounter
  items.value.push(item)
}

function removeItem(uid: number) {
  const idx = items.value.findIndex((i) => i.uid === uid)
  if (idx > -1) {
    items.value.splice(idx, 1)
    // Adjust activeIndex if removed item was before or at active
    if (idx <= activeIndex.value && activeIndex.value > 0) {
      const prev = activeIndex.value
      activeIndex.value = Math.max(0, activeIndex.value - 1)
      emit('change', activeIndex.value, prev)
    }
  }
}

function setActiveItem(index: number) {
  const len = items.value.length
  if (len === 0) return

  const prev = activeIndex.value

  if (props.loop) {
    if (index < 0) index = len - 1
    if (index >= len) index = 0
  } else {
    index = Math.max(0, Math.min(index, len - 1))
  }

  if (index === prev) return

  activeIndex.value = index
  emit('change', index, prev)
}

function prev() {
  setActiveItem(activeIndex.value - 1)
}

function next() {
  setActiveItem(activeIndex.value + 1)
}

// ==================== Indicators ====================
function handleIndicatorClick(index: number) {
  setActiveItem(index)
}

function handleIndicatorHover(index: number) {
  if (props.trigger === 'hover') {
    setActiveItem(index)
  }
}

// ==================== Hover / Autoplay ====================
function handleMouseEnter() {
  isHovering.value = true
  if (props.pauseOnHover && props.autoplay) {
    stopAutoplay()
  }
}

function handleMouseLeave() {
  isHovering.value = false
  if (props.pauseOnHover && props.autoplay) {
    startAutoplay()
  }
}

function startAutoplay() {
  if (autoplayTimer || items.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    if (!isHovering.value) next()
  }, props.interval)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// ==================== Computed ====================
const heightStyle = computed(() => {
  const h = props.height
  return h ? (typeof h === 'number' ? `${h}px` : h) : ''
})

const isVertical = computed(() => props.direction === 'vertical')
const isCard = computed(() => props.type === 'card')

const trackStyle = computed(() => {
  if (!items.value.length) return {}
  if (isCard.value) return {} // Card mode handles positioning per-item
  const offset = activeIndex.value * 100
  return {
    transform: isVertical.value ? `translateY(-${offset}%)` : `translateX(-${offset}%)`,
    transition: 'transform 0.5s ease-in-out',
  }
})

const showArrows = computed(() => {
  if (props.arrow === 'always') return true
  if (props.arrow === 'never') return false
  return isHovering.value
})

const hasContent = computed(() => items.value.length > 0)

const classes = computed(() => [ns.b(), ns.m(props.direction), props.type ? ns.m(props.type) : ''])

// ==================== Provide ====================
provide(CAROUSEL_KEY, {
  activeIndex,
  items,
  isCard,
  loop: computed(() => props.loop),
  addItem,
  removeItem,
  setActiveItem,
})

// ==================== Lifecycle ====================
onMounted(() => {
  if (props.autoplay) startAutoplay()
})

watch(
  () => props.autoplay,
  (val) => {
    if (val) startAutoplay()
    else stopAutoplay()
  }
)

onUnmounted(() => {
  stopAutoplay()
})

// ==================== Expose ====================
defineExpose({
  /** Switch to the previous slide */
  prev,
  /** Switch to the next slide */
  next,
  /** Jump to a specific slide index */
  setActiveItem,
  /** Start autoplay */
  startAutoplay,
  /** Stop autoplay */
  stopAutoplay,
  /** Current active slide index (read-only) */
  activeIndex: readonly(activeIndex),
})
</script>

<template>
  <div
    :class="classes"
    :style="{ height: heightStyle }"
    role="region"
    :aria-roledescription="t('zc.carousel.label')"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Empty state (shown when no items, slot always renders underneath for registration) -->
    <div v-if="!hasContent" :class="ns.e('empty')">
      <slot name="empty">
        <span>{{ t('zc.carousel.empty') }}</span>
      </slot>
    </div>

    <!-- Container (always rendered so carousel-items can mount and register) -->
    <div
      :class="ns.e('container')"
      :style="{ height: hasContent ? heightStyle : '0' }"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <div :class="[ns.e('track'), isCard ? ns.em('track', 'card') : '']" :style="trackStyle">
        <slot />
      </div>
    </div>

    <!-- Arrow buttons -->
    <template v-if="arrow !== 'never'">
      <button
        v-show="showArrows"
        :class="[ns.e('arrow'), ns.em('arrow', isVertical ? 'up' : 'left')]"
        :aria-label="t('zc.carousel.prev')"
        type="button"
        @click="prev"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline v-if="isVertical" points="18 15 12 9 6 15" />
          <polyline v-else points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        v-show="showArrows"
        :class="[ns.e('arrow'), ns.em('arrow', isVertical ? 'down' : 'right')]"
        :aria-label="t('zc.carousel.next')"
        type="button"
        @click="next"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline v-if="isVertical" points="6 9 12 15 18 9" />
          <polyline v-else points="9 6 15 12 9 18" />
        </svg>
      </button>
    </template>

    <!-- Indicators -->
    <div
      v-if="indicatorPosition !== 'none' && items.length > 1"
      :class="[ns.e('indicators'), ns.em('indicators', indicatorPosition)]"
    >
      <span
        v-for="(_, index) in items"
        :key="index"
        :class="[ns.e('indicator'), { 'is-active': index === activeIndex }]"
        role="button"
        :tabindex="index === activeIndex ? -1 : 0"
        :aria-label="t('zc.carousel.indicator', { index: index + 1 })"
        :aria-selected="index === activeIndex"
        @click="handleIndicatorClick(index)"
        @mouseenter="handleIndicatorHover(index)"
      />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCarousel styles
 * ============================================================ */

.zc-carousel {
  --zc-carousel-indicator-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-carousel-indicator-active-color: var(--color-zc-primary-500, #409eff);
  --zc-carousel-indicator-size: 8px;
  --zc-carousel-indicator-gap: 8px;
  --zc-carousel-indicator-active-width: 24px;
  --zc-carousel-indicator-active-height: 8px;
  --zc-carousel-arrow-color: var(--color-zc-white, #fff);
  --zc-carousel-arrow-bg-color: rgba(31, 45, 61, 0.11);
  --zc-carousel-arrow-hover-bg-color: rgba(31, 45, 61, 0.23);
  --zc-carousel-arrow-offset: 16px;
  --zc-carousel-arrow-size: 36px;
  --zc-carousel-border-radius: var(--radius-zc-base, 4px);
  --zc-carousel-transition-duration: 0.5s;
  --zc-carousel-card-scale: 0.83;

  position: relative;
  overflow: hidden;
}

.zc-carousel--horizontal {
  width: 100%;
}

.zc-carousel__container {
  position: relative;
  overflow: hidden;
}

.zc-carousel__track {
  display: flex;
  width: 100%;
  height: 100%;
}

.zc-carousel--vertical .zc-carousel__track {
  flex-direction: column;
}

/* Card mode */
.zc-carousel--card {
  overflow: visible;
  min-height: 200px;
}

.zc-carousel--card .zc-carousel__container {
  overflow: visible;
  height: 100%;
}

/* Card mode track — no bulk translate; items position themselves */
.zc-carousel__track--card {
  overflow: visible;
}

/* ---- Item layout is in carousel-item.vue (scoped) ---- */

.zc-carousel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
  color: var(--color-zc-text-placeholder, #a8abb2);
  font-size: 14px;
  background: var(--color-zc-fill-light, #f5f7fa);
  border-radius: var(--zc-carousel-border-radius);
}

/* ---- Arrow ---- */
.zc-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: var(--zc-carousel-arrow-size);
  height: var(--zc-carousel-arrow-size);
  border-radius: 50%;
  background: var(--zc-carousel-arrow-bg-color);
  color: var(--zc-carousel-arrow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: var(--z-zc-dropdown, 10);
  transition: background 0.3s;
}

.zc-carousel__arrow:hover {
  background: var(--zc-carousel-arrow-hover-bg-color);
}

.zc-carousel__arrow--left {
  left: var(--zc-carousel-arrow-offset);
}

.zc-carousel__arrow--right {
  right: var(--zc-carousel-arrow-offset);
}

/* Vertical arrows */
.zc-carousel--vertical .zc-carousel__arrow--up {
  top: var(--zc-carousel-arrow-offset);
  left: 50%;
  transform: translateX(-50%);
}

.zc-carousel--vertical .zc-carousel__arrow--down {
  top: auto;
  bottom: var(--zc-carousel-arrow-offset);
  left: 50%;
  transform: translateX(-50%);
}

/* ---- Indicators ---- */
.zc-carousel__indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--zc-carousel-indicator-gap);
  z-index: var(--z-zc-dropdown, 10);
}

.zc-carousel__indicators--outside {
  position: relative;
  bottom: auto;
  left: auto;
  transform: none;
  margin-top: 12px;
  justify-content: center;
}

.zc-carousel__indicator {
  width: var(--zc-carousel-indicator-size);
  height: var(--zc-carousel-indicator-size);
  border-radius: 50%;
  background: var(--zc-carousel-indicator-color);
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  padding: 0;
}

.zc-carousel--vertical .zc-carousel__indicators {
  flex-direction: column;
  top: 50%;
  left: 12px;
  bottom: auto;
  transform: translateY(-50%);
}

.zc-carousel--vertical .zc-carousel__indicators--outside {
  top: auto;
  left: auto;
  transform: none;
  margin-top: 0;
  margin-left: 12px;
  flex-direction: column;
  align-self: center;
}

.zc-carousel--vertical .zc-carousel__indicator.is-active {
  width: var(--zc-carousel-indicator-active-height);
  height: var(--zc-carousel-indicator-active-width);
}

.zc-carousel__indicator.is-active {
  width: var(--zc-carousel-indicator-active-width);
  border-radius: var(--zc-carousel-border-radius);
  background: var(--zc-carousel-indicator-active-color);
}

.zc-carousel__indicators--outside .zc-carousel__indicator.is-active {
  background: var(--zc-carousel-indicator-active-color);
}
</style>
