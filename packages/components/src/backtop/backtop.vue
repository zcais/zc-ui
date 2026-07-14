<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcBacktop' })

export type BacktopPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    /** Scroll target selector or element */
    target?: string
    /** Visibility threshold (px scrolled) */
    visibilityHeight?: number
    /** Position of the button */
    position?: BacktopPosition
    /** Right offset in px (used when position includes 'right') */
    right?: number
    /** Bottom offset in px (used when position includes 'bottom') */
    bottom?: number
    /** Left offset in px (used when position includes 'left') */
    left?: number
    /** Top offset in px (used when position includes 'top') */
    top?: number
  }>(),
  {
    target: '',
    visibilityHeight: 200,
    position: 'bottom-right',
    right: 40,
    bottom: 40,
    left: 40,
    top: 40,
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'show'): void
  (e: 'hide'): void
}>()

const ns = useNamespace('backtop')
const { t } = useLocale()

const visible = ref(false)
const container = shallowRef<HTMLElement | Window | null>(null)

const positionStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (props.position.includes('right')) styles.right = `${props.right}px`
  if (props.position.includes('left')) styles.left = `${props.left}px`
  if (props.position.includes('bottom')) styles.bottom = `${props.bottom}px`
  if (props.position.includes('top')) styles.top = `${props.top}px`
  return styles
})

function getScrollTop(): number {
  if (container.value === window) {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  }
  return (container.value as HTMLElement)?.scrollTop || 0
}

function handleScroll() {
  const scrollTop = getScrollTop()
  const shouldShow = scrollTop >= props.visibilityHeight
  if (shouldShow !== visible.value) {
    visible.value = shouldShow
    if (shouldShow) {
      emit('show')
    } else {
      emit('hide')
    }
  }
}

function smoothScrollTo(target: HTMLElement | Window) {
  if (target === window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    ;(target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleClick(event: MouseEvent | KeyboardEvent) {
  emit('click', event as MouseEvent)
  if (container.value) {
    smoothScrollTo(container.value)
  }
}

function getContainer(): HTMLElement | Window {
  if (props.target) {
    const el = document.querySelector(props.target) as HTMLElement | null
    if (el) return el
  }
  return window
}

onMounted(() => {
  if (!isClient) return
  container.value = getContainer()
  container.value.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <Transition name="zc-backtop">
    <div
      v-show="visible"
      ref="el"
      :class="ns.b()"
      :style="positionStyle"
      role="button"
      tabindex="0"
      :aria-label="t('zc.backtop.backToTop')"
      @click="handleClick"
      @keydown.enter.prevent="handleClick($event as any)"
      @keydown.space.prevent="handleClick($event as any)"
    >
      <slot>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </slot>
    </div>
  </Transition>
</template>

<style scoped>
.zc-backtop {
  --zc-backtop-bg-color: var(--color-zc-bg-base, #fff);
  --zc-backtop-text-color: var(--color-zc-text-regular, #606266);
  --zc-backtop-hover-bg-color: var(--color-zc-fill-light, #f5f7fa);
  --zc-backtop-hover-text-color: var(--color-zc-primary-500, #409eff);
  --zc-backtop-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-backtop-border-radius: 50%;
  --zc-backtop-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-backtop-size: 40px;
  --zc-backtop-font-size: 20px;

  position: fixed;
  width: var(--zc-backtop-size);
  height: var(--zc-backtop-size);
  border-radius: var(--zc-backtop-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--zc-backtop-bg-color);
  color: var(--zc-backtop-text-color);
  box-shadow: var(--zc-backtop-box-shadow);
  z-index: var(--z-zc-fixed, 1200);
  transition:
    background var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-backtop:hover {
  background: var(--zc-backtop-hover-bg-color);
  color: var(--zc-backtop-hover-text-color);
}

.zc-backtop:active {
  transform: scale(0.95);
}

.zc-backtop svg {
  width: var(--zc-backtop-font-size);
  height: var(--zc-backtop-font-size);
}

.zc-backtop-enter-active,
.zc-backtop-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-backtop-enter-from,
.zc-backtop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
