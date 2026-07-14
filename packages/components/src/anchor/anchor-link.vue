<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcAnchorLink' })

const props = withDefaults(
  defineProps<{
    /** Anchor target selector (e.g. #section-1) */
    href?: string
    /** Link title */
    title?: string
    /** Nesting level (auto-calculated, can override) */
    level?: number
  }>(),
  {
    href: '',
    title: '',
    level: 0,
  }
)

const ns = useNamespace('anchor')

interface AnchorContext {
  currentLink: { value: string }
  registerLink: (href: string, title: string, level: number) => void
  unregisterLink: (href: string) => void
  handleClick: (e: MouseEvent, href: string) => void
}

const anchorCtx = inject<AnchorContext>('zcAnchor', {
  currentLink: { value: '' },
  registerLink: () => {},
  unregisterLink: () => {},
  handleClick: () => {},
} as AnchorContext)

const isActive = computed(() => anchorCtx.currentLink.value === props.href)

const linkClasses = computed(() => [ns.e('link'), ns.is('active', isActive.value)])

onMounted(() => {
  if (props.href) {
    anchorCtx.registerLink(props.href, props.title, props.level)
  }
})

onBeforeUnmount(() => {
  if (props.href) {
    anchorCtx.unregisterLink(props.href)
  }
})

function onClick(e: MouseEvent) {
  anchorCtx.handleClick(e, props.href)
}
</script>

<template>
  <div :class="ns.e('link-item')" :style="{ paddingLeft: `${level * 16}px` }">
    <a :class="linkClasses" :href="href" :title="title" @click="onClick">
      {{ title }}
    </a>
    <slot />
  </div>
</template>

<style scoped>
.zc-anchor__link-item {
  position: relative;
}

.zc-anchor__link {
  display: block;
  padding: var(--zc-anchor-link-padding);
  font-size: var(--zc-anchor-font-size);
  line-height: 1.5;
  color: var(--zc-anchor-text-color);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
  border-left: var(--zc-anchor-ink-width) solid transparent;
  margin-left: calc(var(--zc-anchor-ink-width) * -1);
}

.zc-anchor__link:hover {
  color: var(--zc-anchor-hover-color);
}

.zc-anchor__link.is-active {
  color: var(--zc-anchor-active-color);
  font-weight: 500;
  border-left-color: var(--zc-anchor-active-color);
}
</style>
