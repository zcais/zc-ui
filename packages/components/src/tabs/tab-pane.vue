<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  getCurrentInstance,
  type Ref,
} from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcTabPane' })

const props = withDefaults(
  defineProps<{
    /** Tab identifier (v-model matches this) */
    name?: string | number
    /** Tab label text */
    label?: string
    /** Whether tab is lazy loaded */
    lazy?: boolean
    /** Whether tab is closable */
    closable?: boolean
    /** Disable the tab */
    disabled?: boolean
  }>(),
  {
    name: '',
    label: '',
    lazy: false,
    closable: false,
    disabled: false,
  }
)

const ns = useNamespace('tab-pane')

// Use Vue's internal uid for uniqueness across instances
const uid = getCurrentInstance()?.uid ?? 0
const loaded = ref(false)

interface TabsContext {
  currentName: Ref<string | number>
  closable: Ref<boolean>
  registerPane: (pane: {
    uid: number
    name: string | number
    title?: string
    lazy?: boolean
    closable?: boolean
    disabled?: boolean
  }) => void
  unregisterPane: (uid: number) => void
}

const tabsCtx = inject<TabsContext>('zcTabs', {} as TabsContext)

const isActive = computed(() => {
  return tabsCtx.currentName?.value === props.name
})

const shouldBeRendered = computed(() => {
  return isActive.value || !props.lazy || loaded.value
})

watch(isActive, (val) => {
  if (val) loaded.value = true
})

const paneData = computed(() => ({
  uid,
  name: props.name,
  title: props.label,
  lazy: props.lazy,
  closable: props.closable,
  disabled: props.disabled,
}))

onMounted(() => {
  tabsCtx.registerPane?.(paneData.value)
})

onBeforeUnmount(() => {
  tabsCtx.unregisterPane?.(uid)
})

// Update pane data in place when props change (avoids order shuffle)
watch(
  () => [props.name, props.label, props.disabled, props.closable],
  () => {
    tabsCtx.registerPane?.(paneData.value)
  }
)
</script>

<template>
  <div
    v-if="shouldBeRendered"
    v-show="isActive"
    :id="`zc-tabpane-${uid}`"
    :class="ns.b()"
    role="tabpanel"
    :aria-labelledby="`zc-tab-${uid}`"
  >
    <slot />
  </div>
</template>

<style scoped>
.zc-tab-pane {
  --zc-tab-pane-padding: 16px;
  --zc-tab-pane-color: var(--color-zc-text-regular, #606266);

  width: 100%;
  padding: var(--zc-tab-pane-padding);
  color: var(--zc-tab-pane-color);
}
</style>
