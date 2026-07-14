<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, shallowRef, nextTick } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { isClient } from '@zc-ui/utils'

defineOptions({ name: 'ZcAffix' })

export type AffixPosition = 'top' | 'bottom'

const props = withDefaults(
  defineProps<{
    /** Offset from viewport edge (px) */
    offset?: number
    /** Position to affix to */
    position?: AffixPosition
    /** Target container element selector */
    target?: string
    /** Z-index when fixed */
    zIndex?: number
  }>(),
  {
    offset: 0,
    position: 'top',
    target: '',
    zIndex: 100,
  }
)

const emit = defineEmits<{
  (e: 'change', fixed: boolean): void
  (e: 'scroll', scrollTop: number): void
}>()

const ns = useNamespace('affix')

const targetRef = shallowRef<HTMLElement | null>(null)
const rootRef = shallowRef<HTMLElement | null>(null)
const fixed = ref(false)
const scrollTop = ref(0)
const transform = ref(0)

const rootStyle = computed(() => {
  if (!fixed.value) return {}
  return {
    width: rootRef.value?.offsetWidth ? `${rootRef.value.offsetWidth}px` : 'auto',
    height: rootRef.value?.offsetHeight ? `${rootRef.value.offsetHeight}px` : 'auto',
  } as Record<string, string>
})

const affixStyle = computed(() => {
  if (!fixed.value) return {} as Record<string, string>
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: String(props.zIndex),
    width: rootRef.value?.offsetWidth ? `${rootRef.value.offsetWidth}px` : 'auto',
  }
  style[props.position] = `${props.offset}px`
  return style
})

function updatePosition() {
  if (!rootRef.value || !isClient) return

  const rootRect = rootRef.value.getBoundingClientRect()
  const targetEl = targetRef.value
  const targetRect = targetEl ? targetEl.getBoundingClientRect() : { top: 0, bottom: 0 }

  const clientHeight = document.documentElement.clientHeight

  emit('scroll', scrollTop.value)

  if (props.position === 'top') {
    if (props.target) {
      const difference = targetRect.bottom - props.offset - rootRect.height
      fixed.value = targetRect.top < props.offset && difference > 0
      transform.value = difference
    } else {
      fixed.value = rootRect.top < props.offset
    }
  } else {
    if (props.target) {
      const difference = clientHeight - targetRect.top - props.offset - rootRect.height
      fixed.value = clientHeight - targetRect.top > props.offset && difference > 0
      transform.value = difference
    } else {
      fixed.value = clientHeight - rootRect.bottom < props.offset
    }
  }
}

function handleScroll() {
  if (!isClient) return
  scrollTop.value =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  updatePosition()
}

function handleResize() {
  updatePosition()
}

watch(fixed, (val) => emit('change', val))

onMounted(() => {
  if (!isClient) return
  if (props.target) {
    targetRef.value = document.querySelector(props.target)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  nextTick(() => updatePosition())
})

onBeforeUnmount(() => {
  if (!isClient) return
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="rootRef" :class="ns.b()" :style="rootStyle">
    <div :class="{ [ns.m('fixed')]: fixed }" :style="affixStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.zc-affix {
  --zc-affix-z-index: var(--z-zc-fixed, 1200);

  display: inline-block;
}
</style>
