<script setup lang="ts">
/**
 * ZcIconName — documentation helper that renders an icon from the built-in
 * icon library by its kebab-case name, using the library's native stroke style.
 *
 * The base <ZcIcon> component renders a single filled <path> via its `name`
 * prop (a raw SVG `d` string), so it cannot directly render the multi-path,
 * stroked icons that make up the icon library. This wrapper looks the icon up
 * in the generated manifest and renders its full SVG body faithfully — exactly
 * how it appears in the <IconGallery />.
 *
 * Used by the /components/icon demos to show real library icons by name.
 */
import { computed } from 'vue'
import manifest from '../../data/icons-manifest.json'

const props = withDefaults(
  defineProps<{
    /** Icon name from the built-in library (e.g. 'heart', 'brand-github'). */
    name: string
    /** Icon size in px. */
    size?: number | string
    /** Icon color; defaults to currentColor. */
    color?: string
    /** Stroke width; defaults to 2. */
    strokeWidth?: number | string
  }>(),
  {
    size: 24,
    color: '',
    strokeWidth: 2,
  }
)

const icon = computed(() =>
  (manifest.icons as { name: string; body: string }[]).find((i) => i.name === props.name)
)

const sizeVal = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

const style = computed(() => ({
  width: sizeVal.value,
  height: sizeVal.value,
  color: props.color || 'currentColor',
}))
</script>

<template>
  <span class="zc-icon-name" :style="style" :aria-label="name" role="img">
    <svg
      v-if="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      v-html="icon.body"
    />
    <span v-else class="zc-icon-name__missing">⚠ {{ name }}</span>
  </span>
</template>

<style scoped>
.zc-icon-name {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.zc-icon-name svg {
  width: 100%;
  height: 100%;
  display: block;
}

.zc-icon-name__missing {
  font-size: 12px;
  color: var(--vp-c-danger-1);
}
</style>
