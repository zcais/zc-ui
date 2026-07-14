<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, shallowRef, provide } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'

defineOptions({ name: 'ZcAnchor' })

export type AnchorDirection = 'vertical' | 'horizontal'

const props = withDefaults(
  defineProps<{
    /** Scroll container selector (default: window) */
    container?: string
    /** Current anchor (v-model) */
    current?: string
    /** Minimum offset from top before highlighting */
    offsetTop?: number
    /** Direction of the anchor links */
    direction?: AnchorDirection
    /** Selector for finding anchor targets */
    bound?: number
    /** Smooth scrolling */
    smooth?: boolean
  }>(),
  {
    container: '',
    current: '',
    offsetTop: 0,
    direction: 'vertical',
    bound: 80,
    smooth: true,
  }
)

const emit = defineEmits<{
  (e: 'update:current', href: string): void
  (e: 'click', event: MouseEvent, href: string): void
  (e: 'change', href: string): void
}>()

const ns = useNamespace('anchor')

interface AnchorLinkData {
  href: string
  title: string
  level: number
}

const links = ref<AnchorLinkData[]>([])
const currentLink = ref(props.current)
const containerRef = shallowRef<HTMLElement | Window | null>(null)

const rootClasses = computed(() => [ns.b(), ns.m(props.direction)])

function getContainerEl(): HTMLElement | Window {
  if (props.container) {
    const el = document.querySelector(props.container) as HTMLElement | null
    if (el) return el
  }
  return window
}

function scrollToTarget(href: string) {
  const target = document.querySelector(href) as HTMLElement | null
  if (!target) return

  const containerEl = containerRef.value
  if (containerEl === window) {
    const top = target.getBoundingClientRect().top + window.pageYOffset - props.offsetTop
    window.scrollTo({ top, behavior: props.smooth ? 'smooth' : 'auto' })
  } else {
    const container = containerEl as HTMLElement
    const top = target.offsetTop - container.offsetTop - props.offsetTop
    container.scrollTo({ top, behavior: props.smooth ? 'smooth' : 'auto' })
  }
}

function handleClick(e: MouseEvent, href: string) {
  e.preventDefault()
  if (href) {
    scrollToTarget(href)
    currentLink.value = href
    emit('update:current', href)
    emit('change', href)
  }
  emit('click', e, href)
}

function registerLink(href: string, title: string, level: number) {
  if (!links.value.find((l) => l.href === href)) {
    links.value.push({ href, title, level })
  }
}

function unregisterLink(href: string) {
  const idx = links.value.findIndex((l) => l.href === href)
  if (idx > -1) links.value.splice(idx, 1)
}

provide('zcAnchor', {
  currentLink,
  registerLink,
  unregisterLink,
  handleClick,
})

function getCurrentAnchor(): string | null {
  if (!isClient) return null
  for (const link of links.value) {
    const target = document.querySelector(link.href) as HTMLElement | null
    if (!target) continue
    const rect = target.getBoundingClientRect()
    if (rect.top <= props.bound && rect.bottom >= props.bound) {
      return link.href
    }
  }
  return null
}

function handleScroll() {
  if (!isClient) return
  const anchor = getCurrentAnchor()
  if (anchor && anchor !== currentLink.value) {
    currentLink.value = anchor
    emit('update:current', anchor)
    emit('change', anchor)
  }
}

watch(
  () => props.current,
  (val) => {
    currentLink.value = val
  }
)

onMounted(() => {
  if (!isClient) return
  containerRef.value = getContainerEl()
  containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div :class="rootClasses">
    <div :class="ns.e('ink')" :style="{ top: '0px' }" />
    <div :class="ns.e('list')">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.zc-anchor {
  --zc-anchor-text-color: var(--color-zc-text-regular, #606266);
  --zc-anchor-active-color: var(--color-zc-primary-500, #409eff);
  --zc-anchor-hover-color: var(--color-zc-primary-500, #409eff);
  --zc-anchor-font-size: var(--text-zc-base, 14px);
  --zc-anchor-link-padding: 4px 0 4px 16px;
  --zc-anchor-ink-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-anchor-ink-width: 2px;

  position: relative;
  padding-left: 12px;
}

.zc-anchor--horizontal {
  padding-left: 0;
}

.zc-anchor__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.zc-anchor__ink {
  position: absolute;
  left: 0;
  width: var(--zc-anchor-ink-width);
  height: 0;
  background: var(--zc-anchor-ink-bg-color);
  border-radius: 1px;
  transition:
    top var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    height var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-anchor--horizontal .zc-anchor__ink {
  display: none;
}
</style>
