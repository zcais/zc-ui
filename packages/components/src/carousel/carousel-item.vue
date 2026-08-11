<script setup lang="ts">
import { inject, computed, onMounted, onUnmounted, type CSSProperties } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { CAROUSEL_KEY } from './types'
import type { CarouselItemData } from './types'

defineOptions({ name: 'ZcCarouselItem' })

const props = defineProps<{
  name?: string | number
}>()

const ns = useNamespace('carousel-item')

const ctx = inject(CAROUSEL_KEY, null)

const itemClasses = computed(() => [ns.b(), ctx?.isCard.value ? ns.m('card') : ''])

// uid is assigned by parent's addItem() via object mutation
const self: CarouselItemData = { uid: 0, name: props.name }
let uid = 0
let registered = false

onMounted(() => {
  if (ctx) {
    ctx.addItem(self)
    uid = self.uid // read back the uid assigned by addItem()
    registered = true
  }
})

onUnmounted(() => {
  if (registered) ctx?.removeItem(uid)
})

// Card mode: compute transform/opacity relative to activeIndex
// All items use: position:absolute; width:50%; left:0; top:0
// translateX % is relative to item's own width (50% of container)
const cardStyle = computed<CSSProperties>(() => {
  if (!ctx || !ctx.isCard.value) return {}

  const items = ctx.items.value
  const idx = items.findIndex((i) => i.uid === uid)
  if (idx === -1) return {}

  const len = items.length
  if (len <= 1) return { transform: 'translateX(50%) scale(1)', opacity: '1', zIndex: '2' }

  const active = ctx.activeIndex.value
  let offset = idx - active

  // Wrap around for shorter path in loop mode
  if (ctx.loop.value && Math.abs(offset) > len / 2) {
    offset = offset > 0 ? offset - len : offset + len
  }

  if (offset === 0) {
    // Active card — centered: translateX(50%) = 25% of container
    return { transform: 'translateX(50%) scale(1)', opacity: '1', zIndex: '2' }
  }

  if (Math.abs(offset) === 1) {
    // Adjacent card — offset to left or right
    // translateX(80%) → right side; translateX(20%) → left side
    const x = offset > 0 ? 80 : 20
    return {
      transform: `translateX(${x}%) scale(var(--zc-carousel-card-scale, 0.83))`,
      opacity: '0.5',
      zIndex: '1',
    }
  }

  // Far cards — hidden
  return { opacity: '0', pointerEvents: 'none', zIndex: '0' }
})
</script>

<template>
  <div :class="itemClasses" :style="cardStyle">
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcCarouselItem styles
 * Layout + transition for carousel slides.
 * Base layout (flex: 0 0 100%) MUST live here — not in
 * carousel.vue — because scoped styles from the parent don't
 * reach slotted child components.
 * ============================================================ */

.zc-carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.4s var(--ease-zc-in-out, ease),
    opacity 0.4s var(--ease-zc-in-out, ease);
}

/* Card mode — absolute positioning, items manage their own transform */
.zc-carousel-item--card {
  flex: none;
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0;
  top: 0;
  transition: all var(--zc-carousel-transition-duration, 0.5s) ease-in-out;
}

.zc-carousel-item > * {
  width: 100%;
  height: 100%;
}
</style>
