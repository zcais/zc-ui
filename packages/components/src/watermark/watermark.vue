<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcWatermark' })

const props = withDefaults(
  defineProps<{
    /** Watermark text content */
    content?: string | string[]
    /** Watermark image URL (overrides text) */
    image?: string
    /** Font size in px */
    fontSize?: number
    /** Font family */
    fontFamily?: string
    /** Font color */
    color?: string
    /** Font weight */
    fontWeight?: string | number
    /** Font style */
    fontStyle?: string
    /** Rotation angle in degrees */
    rotate?: number
    /** Opacity (0-1) */
    opacity?: number
    /** Gap between watermark tiles [x, y] in px */
    gap?: [number, number]
    /** Offset from top-left [x, y] in px */
    offset?: [number, number]
    /** Z-index of the watermark layer */
    zIndex?: number
    /** Disable the watermark */
    disabled?: boolean
  }>(),
  {
    content: '',
    image: '',
    fontSize: 14,
    fontFamily: 'sans-serif',
    color: 'rgba(0, 0, 0, 0.12)',
    fontWeight: 'normal',
    fontStyle: 'normal',
    rotate: -22,
    opacity: 1,
    gap: () => [100, 100],
    offset: () => [0, 0],
    zIndex: 9,
    disabled: false,
  }
)

const ns = useNamespace('watermark')

const watermarkUrl = ref('')
const containerRef = ref<HTMLElement>()
const layerRef = ref<HTMLElement>()
let observer: MutationObserver | null = null

function generateWatermark() {
  if (props.disabled) {
    watermarkUrl.value = ''
    return
  }

  if (props.image) {
    watermarkUrl.value = props.image
    return
  }

  const texts = Array.isArray(props.content) ? props.content : [props.content]
  if (!texts.length || !texts[0]) {
    watermarkUrl.value = ''
    return
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.font = `${props.fontStyle} ${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`
  const maxTextWidth = Math.max(...texts.map((t) => ctx.measureText(t).width))
  const lineHeight = props.fontSize * 1.5

  const contentWidth = Math.ceil(maxTextWidth)
  const contentHeight = Math.ceil(lineHeight * texts.length)

  const [gapX, gapY] = props.gap
  const angle = (props.rotate * Math.PI) / 180
  const rotatedWidth =
    Math.abs(contentWidth * Math.cos(angle)) + Math.abs(contentHeight * Math.sin(angle))
  const rotatedHeight =
    Math.abs(contentWidth * Math.sin(angle)) + Math.abs(contentHeight * Math.cos(angle))

  const canvasWidth = Math.ceil(gapX + rotatedWidth)
  const canvasHeight = Math.ceil(gapY + rotatedHeight)

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  ctx.font = `${props.fontStyle} ${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`
  ctx.fillStyle = props.color
  ctx.textBaseline = 'middle'
  ctx.globalAlpha = props.opacity

  ctx.translate(canvasWidth / 2, canvasHeight / 2)
  ctx.rotate(angle)
  ctx.textAlign = 'center'

  texts.forEach((text, i) => {
    const y = (i - (texts.length - 1) / 2) * lineHeight
    ctx.fillText(text, 0, y)
  })

  watermarkUrl.value = canvas.toDataURL('image/png')
}

const watermarkStyle = computed(() => {
  if (!watermarkUrl.value) return { display: 'none' }
  const [offsetX, offsetY] = props.offset
  return {
    position: 'absolute' as const,
    inset: '0',
    zIndex: props.zIndex,
    pointerEvents: 'none' as const,
    backgroundRepeat: 'repeat',
    backgroundPosition: `${offsetX}px ${offsetY}px`,
    backgroundImage: `url(${watermarkUrl.value})`,
  }
})

function setupObserver() {
  const container = containerRef.value
  const layer = layerRef.value
  if (!container || !layer) return

  // Disconnect previous observer if any
  observer?.disconnect()

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // If the watermark layer was removed or its attributes were tampered, restore it
      if (mutation.type === 'childList') {
        for (const node of mutation.removedNodes) {
          if (node === layer) {
            container.appendChild(layer)
            return
          }
        }
      }
      if (mutation.type === 'attributes' && mutation.target === layer) {
        // Re-apply the background image if tampered
        generateWatermark()
        return
      }
    }
  })

  observer.observe(container, { childList: true, subtree: false })
  observer.observe(layer, { attributes: true, attributeFilter: ['style', 'class'] })
}

onMounted(() => {
  generateWatermark()
  setupObserver()
})

watch(
  () => [
    props.content,
    props.image,
    props.fontSize,
    props.fontFamily,
    props.color,
    props.fontWeight,
    props.fontStyle,
    props.rotate,
    props.opacity,
    props.gap,
    props.offset,
    props.disabled,
  ],
  () => {
    generateWatermark()
    // Re-setup observer after watermark regeneration
    setupObserver()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  // Disconnect the MutationObserver to prevent memory leaks
  observer?.disconnect()
  observer = null

  // Release the object URL to prevent memory leak
  if (watermarkUrl.value && watermarkUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(watermarkUrl.value)
  }
  watermarkUrl.value = ''
})
</script>

<template>
  <div ref="containerRef" :class="ns.b()" style="position: relative; overflow: hidden">
    <slot />
    <div ref="layerRef" :class="ns.e('layer')" :style="watermarkStyle" />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcWatermark styles
 * ============================================================ */

.zc-watermark {
  --zc-watermark-gap: 100px;
  --zc-watermark-offset: 0;

  position: relative;
}

.zc-watermark__layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
