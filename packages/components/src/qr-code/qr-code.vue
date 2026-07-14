<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import QRCode from 'qrcode'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'
import type { QRCodeProps, QRCodeEmits, QRCodeExposed, QRCodeImageSettings } from './types'

defineOptions({ name: 'ZcQRCode' })

const props = withDefaults(defineProps<QRCodeProps>(), {
  size: 160,
  type: 'canvas',
  color: '#000000',
  background: '#ffffff',
  level: 'M',
  includeMargin: false,
  image: '',
  imageSettings: undefined,
  status: 'active',
  refreshInterval: undefined,
})

const emit = defineEmits<QRCodeEmits>()

const ns = useNamespace('qrcode')

/* ---------------------------------------------------------------- *
 * Refs
 * ---------------------------------------------------------------- */
const canvasRef = ref<HTMLCanvasElement | null>(null)
const svgContainerRef = ref<HTMLDivElement | null>(null)
const imgSrc = ref<string>('')

/* ---------------------------------------------------------------- *
 * Computed
 * ---------------------------------------------------------------- */
/** The effective image settings (merged from `image` and `imageSettings`) */
const effectiveImageSettings = computed<QRCodeImageSettings | undefined>(() => {
  if (props.imageSettings) return props.imageSettings
  if (props.image) {
    const logoSize = Math.floor(props.size * 0.22)
    return { src: props.image, width: logoSize, height: logoSize }
  }
  return undefined
})

/** QR code generation options passed to the `qrcode` library */
const qrOptions = computed(() => ({
  width: props.size,
  margin: props.includeMargin ? 2 : 0,
  errorCorrectionLevel: props.level,
  color: {
    dark: props.color,
    light: props.background,
  },
}))

/* ---------------------------------------------------------------- *
 * Core rendering
 * ---------------------------------------------------------------- */

/** Load an HTMLImageElement for the embedded logo */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

/** Embed a logo image in an SVG string */
function embedLogoInSvg(svgStr: string, settings: QRCodeImageSettings): string {
  const w = settings.width ?? Math.floor(props.size * 0.22)
  const h = settings.height ?? Math.floor(props.size * 0.22)
  const x = (props.size - w) / 2
  const y = (props.size - h) / 2
  const imgTag = `<image href="${settings.src}" x="${x}" y="${y}" width="${w}" height="${h}" />`
  // Insert before the closing </svg> tag
  return svgStr.replace(/<\/svg>\s*$/, `${imgTag}</svg>`)
}

/** Render to canvas */
async function renderCanvas(): Promise<void> {
  if (!canvasRef.value) return
  await QRCode.toCanvas(canvasRef.value, props.value, qrOptions.value)

  // Draw embedded logo if configured
  if (effectiveImageSettings.value) {
    const settings = effectiveImageSettings.value
    const ctx = canvasRef.value.getContext('2d')
    if (!ctx) return
    try {
      const imgEl = await loadImage(settings.src)
      ctx.drawImage(
        imgEl,
        (props.size - (settings.width ?? imgEl.width)) / 2,
        (props.size - (settings.height ?? imgEl.height)) / 2,
        settings.width ?? imgEl.width,
        settings.height ?? imgEl.height
      )
    } catch {
      // Logo load failed — ignore silently
    }
  }
}

/** Render to SVG (injected as innerHTML) */
async function renderSvg(): Promise<void> {
  if (!svgContainerRef.value) return
  let svgStr = await QRCode.toString(props.value, {
    ...qrOptions.value,
    type: 'svg',
  })

  if (effectiveImageSettings.value) {
    svgStr = embedLogoInSvg(svgStr, effectiveImageSettings.value)
  }

  svgContainerRef.value.innerHTML = svgStr
}

/** Render to image (data URL) */
async function renderImage(): Promise<void> {
  const dataUrl = await QRCode.toDataURL(props.value, qrOptions.value)

  if (effectiveImageSettings.value) {
    // Composite the logo onto a canvas
    const settings = effectiveImageSettings.value
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = props.size
    tempCanvas.height = props.size
    const ctx = tempCanvas.getContext('2d')
    if (ctx) {
      // Draw QR code
      const qrImg = await loadImage(dataUrl)
      ctx.drawImage(qrImg, 0, 0, props.size, props.size)
      // Draw logo
      try {
        const logoImg = await loadImage(settings.src)
        ctx.drawImage(
          logoImg,
          (props.size - (settings.width ?? logoImg.width)) / 2,
          (props.size - (settings.height ?? logoImg.height)) / 2,
          settings.width ?? logoImg.width,
          settings.height ?? logoImg.height
        )
      } catch {
        // Logo load failed
      }
      imgSrc.value = tempCanvas.toDataURL()
      return
    }
  }

  imgSrc.value = dataUrl
}

/** Main render dispatcher */
async function render(): Promise<void> {
  if (!isClient) return
  if (!props.value) return

  try {
    if (props.type === 'canvas') {
      await renderCanvas()
    } else if (props.type === 'svg') {
      await renderSvg()
    } else {
      await renderImage()
    }
    emit('ready')
  } catch (err) {
    emit('error', err instanceof Error ? err : new Error(String(err)))
  }
}

/** Public refresh method — re-generates the QR code */
function refresh(): void {
  emit('refresh')
  nextTick(() => {
    render()
  })
}

/** Get the data URL of the current QR code */
async function toDataURL(): Promise<string> {
  if (props.type === 'canvas' && canvasRef.value) {
    return canvasRef.value.toDataURL()
  }
  if (props.type === 'image' && imgSrc.value) {
    return imgSrc.value
  }
  // For SVG or fallback, generate a data URL
  return QRCode.toDataURL(props.value, qrOptions.value)
}

defineExpose<QRCodeExposed>({ refresh, toDataURL })

/* ---------------------------------------------------------------- *
 * Auto-refresh interval
 * ---------------------------------------------------------------- */
let refreshTimer: ReturnType<typeof setInterval> | null = null

function startRefreshTimer(): void {
  stopRefreshTimer()
  if (!isClient || !props.refreshInterval) return
  refreshTimer = setInterval(() => {
    refresh()
  }, props.refreshInterval)
}

function stopRefreshTimer(): void {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

/* ---------------------------------------------------------------- *
 * Watchers — re-render when props change
 * ---------------------------------------------------------------- */
watch(
  () => [
    props.value,
    props.size,
    props.color,
    props.background,
    props.level,
    props.includeMargin,
    props.type,
  ],
  () => render()
)

watch(
  () => [props.image, props.imageSettings],
  () => render(),
  { deep: true }
)

watch(
  () => props.refreshInterval,
  () => startRefreshTimer()
)

/* ---------------------------------------------------------------- *
 * Lifecycle
 * ---------------------------------------------------------------- */
onMounted(() => {
  render()
  startRefreshTimer()
})

onBeforeUnmount(() => {
  stopRefreshTimer()
})
</script>

<template>
  <div
    :class="ns.b()"
    :style="{ width: `${size}px`, height: `${size}px`, '--scan-height': `${size}px` }"
  >
    <!-- QR Code rendering area -->
    <div :class="ns.e('wrapper')">
      <canvas v-if="type === 'canvas'" ref="canvasRef" :class="ns.e('canvas')" />

      <div v-else-if="type === 'svg'" ref="svgContainerRef" :class="ns.e('svg')" />

      <img v-else :class="ns.e('image')" :src="imgSrc" alt="QR Code" />
    </div>

    <!-- Status overlays -->
    <div v-if="status !== 'active'" :class="ns.e('overlay')">
      <slot v-if="status === 'loading'" name="loading">
        <div :class="ns.e('loading')">
          <div :class="ns.e('spinner')" />
          <span :class="ns.e('status-text')">Loading...</span>
        </div>
      </slot>

      <slot v-else-if="status === 'expired'" name="expired">
        <div :class="ns.e('expired')">
          <svg
            :class="ns.e('expired-icon')"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span :class="ns.e('status-text')">QR Code Expired</span>
        </div>
      </slot>

      <slot v-else-if="status === 'scanning'" name="scanning">
        <div :class="ns.e('scanning')">
          <div :class="ns.e('scan-line')" />
          <span :class="ns.e('status-text')">Scanning...</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcQRCode styles
 * ============================================================ */

.zc-qrcode {
  --zc-qr-code-bg-color: var(--color-zc-bg-base, #fff);
  --zc-qr-code-fg-color: var(--color-zc-text-primary, #303133);
  --zc-qr-code-border-radius: var(--radius-zc-base, 4px);
  --zc-qr-code-padding: 12px;

  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: var(--zc-qr-code-border-radius);
  background: var(--zc-qr-code-bg-color);
}

.zc-qrcode__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zc-qrcode__canvas,
.zc-qrcode__image {
  display: block;
  width: 100%;
  height: 100%;
}

.zc-qrcode__svg {
  width: 100%;
  height: 100%;
}

.zc-qrcode__svg :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ---- Overlay ---- */

.zc-qrcode__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(2px);
}

/* ---- Loading ---- */

.zc-qrcode__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.zc-qrcode__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-zc-border, #dcdfe6);
  border-top-color: var(--color-zc-primary, #3c6ee0);
  border-radius: 50%;
  animation: zc-qrcode-spin 0.8s linear infinite;
}

@keyframes zc-qrcode-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ---- Expired ---- */

.zc-qrcode__expired {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-zc-text-secondary, #909399);
}

.zc-qrcode__expired-icon {
  width: 40px;
  height: 40px;
}

/* ---- Scanning ---- */

.zc-qrcode__scanning {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}

.zc-qrcode__scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(180deg, transparent, var(--color-zc-primary, #3c6ee0));
  box-shadow: 0 0 8px var(--color-zc-primary, #3c6ee0);
  animation: zc-qrcode-scan 2s ease-in-out infinite;
}

@keyframes zc-qrcode-scan {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(calc(var(--scan-height, 160px) - 3px));
  }
}

/* ---- Common ---- */

.zc-qrcode__status-text {
  font-size: 12px;
  color: var(--color-zc-text-secondary, #909399);
  white-space: nowrap;
}
</style>
