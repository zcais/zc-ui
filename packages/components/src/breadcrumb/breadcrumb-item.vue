<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useNamespace, useOptionalRouter } from '@zc-ui/hooks'

defineOptions({ name: 'ZcBreadcrumbItem' })

const props = withDefaults(
  defineProps<{
    /** Link target (router path or URL) */
    to?: string
    /** Replace current history entry instead of pushing */
    replace?: boolean
  }>(),
  {
    to: '',
    replace: false,
  }
)

const ns = useNamespace('breadcrumb')

/**
 * Router instance for navigation.
 * Uses useOptionalRouter() composable instead of getCurrentInstance() directly.
 * Returns null when vue-router is not installed.
 */
const router = useOptionalRouter()

const ctx = inject<{
  separator: Ref<string>
  separatorIcon: Ref<string>
}>('zcBreadcrumb', {
  separator: computed(() => '/'),
  separatorIcon: computed(() => ''),
})

const hasLink = computed(() => !!props.to)

function handleClick() {
  if (!props.to) return
  if (router.value) {
    if (props.replace) {
      router.value.replace(props.to)
    } else {
      router.value.push(props.to)
    }
  }
}
</script>

<template>
  <span :class="ns.e('item')" :aria-current="!hasLink ? 'page' : undefined">
    <span
      :class="[ns.e('inner'), hasLink ? ns.is('link') : '']"
      role="link"
      :tabindex="hasLink ? 0 : undefined"
      @click="handleClick"
      @keydown.enter="handleClick"
    >
      <slot />
    </span>
    <span :class="ns.e('separator')" role="presentation" aria-hidden="true">
      <slot name="separator">
        <i v-if="ctx.separatorIcon.value" :class="ctx.separatorIcon.value" />
        <template v-else>{{ ctx.separator.value }}</template>
      </slot>
    </span>
  </span>
</template>

<style scoped>
.zc-breadcrumb__item {
  display: inline-flex;
  align-items: center;
}

.zc-breadcrumb__inner {
  color: var(--color-zc-text-regular, #606266);
  transition: color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-breadcrumb__inner.is-link {
  font-weight: 500;
  color: var(--color-zc-primary-500, #409eff);
  cursor: pointer;
}

.zc-breadcrumb__inner.is-link:hover {
  color: var(--color-zc-primary-600, #337ecc);
}

.zc-breadcrumb__separator {
  margin: 0 8px;
  color: var(--color-zc-text-placeholder, #a8abb2);
  user-select: none;
}

.zc-breadcrumb__item:last-child .zc-breadcrumb__inner {
  color: var(--color-zc-text-primary, #303133);
  font-weight: 500;
}

.zc-breadcrumb__item:last-child .zc-breadcrumb__separator {
  display: none;
}
</style>
