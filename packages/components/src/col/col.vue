<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { BreakpointKey, Gutter } from '../row/row.vue'

defineOptions({ name: 'ZcCol' })

/**
 * Responsive span value.
 * Can be a plain number (span only) or an object with span/offset.
 */
export type ResponsiveValue = number | { span?: number; offset?: number }

const props = withDefaults(
  defineProps<{
    /** Number of columns occupied (0-24). */
    span?: number
    /** Column offset (number of columns of empty space before). */
    offset?: number
    /** Number of columns to push right (relative positioning). */
    push?: number
    /** Number of columns to pull left (relative positioning). */
    pull?: number
    /** Responsive span for xs breakpoint (< 640px). */
    xs?: ResponsiveValue
    /** Responsive span for sm breakpoint (≥640px). */
    sm?: ResponsiveValue
    /** Responsive span for md breakpoint (≥768px). */
    md?: ResponsiveValue
    /** Responsive span for lg breakpoint (≥1024px). */
    lg?: ResponsiveValue
    /** Responsive span for xl breakpoint (≥1280px). */
    xl?: ResponsiveValue
    /** Custom HTML tag for the root element. */
    tag?: string
  }>(),
  {
    span: 24,
    offset: 0,
    push: 0,
    pull: 0,
    tag: 'div',
  }
)

const ns = useNamespace('col')

// ---- Inject gutter from parent Row ----
interface RowContext {
  gutter: ComputedRef<Gutter>
}

const rowCtx = inject<RowContext>('zcRow', { gutter: computed(() => 0) })

// ---- Inline styles: gutter padding + push/pull positioning ----
const colStyle = computed(() => {
  const result: Record<string, string> = {}

  // Apply horizontal gutter as padding
  const gutter = rowCtx.gutter.value
  let horizontal = 0

  if (Array.isArray(gutter)) {
    horizontal = gutter[0]
  } else if (typeof gutter === 'number') {
    horizontal = gutter
  }

  if (horizontal > 0) {
    result['padding-left'] = `${horizontal / 2}px`
    result['padding-right'] = `${horizontal / 2}px`
  }

  // Push / pull (relative positioning)
  if (props.push > 0) {
    result['position'] = 'relative'
    result['left'] = `${(props.push / 24) * 100}%`
  }
  if (props.pull > 0) {
    result['position'] = 'relative'
    result['right'] = `${(props.pull / 24) * 100}%`
  }

  return result
})

// ---- Build class list ----
const classes = computed(() => {
  const list: string[] = [ns.b()]

  if (props.span > 0) {
    list.push(ns.m(`${props.span}`))
  }

  if (props.offset > 0) {
    list.push(ns.m(`offset-${props.offset}`))
  }

  const breakpoints: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl']
  for (const bp of breakpoints) {
    const val = props[bp]
    if (val == null) continue

    if (typeof val === 'number') {
      list.push(ns.m(`${bp}-${val}`))
    } else if (typeof val === 'object') {
      if (val.span != null) list.push(ns.m(`${bp}-${val.span}`))
      if (val.offset != null) list.push(ns.m(`${bp}-offset-${val.offset}`))
    }
  }

  return list
})

// ---- CSS custom properties for responsive widths ----
//
// The component emits CSS custom properties (--zc-col-span,
// --zc-col-span-sm, etc.) as inline styles. The <style scoped> block
// below resolves the effective span per breakpoint via media
// queries with var() fallback chains:
//
//   xl → lg → md → sm → xs → base span (default: 24)
//
// Width = span / 24 * 100%
const cssVars = computed(() => {
  const vars: Record<string, string> = {}

  // Base span (always set — even 0, so the column collapses)
  vars['--zc-col-span'] = String(props.span)
  if (props.offset > 0) {
    vars['--zc-col-offset'] = String(props.offset)
  }

  // Responsive breakpoints
  const breakpoints: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl']
  for (const bp of breakpoints) {
    const val = props[bp]
    if (val == null) continue

    if (typeof val === 'number') {
      vars[`--zc-col-span-${bp}`] = String(val)
    } else if (typeof val === 'object') {
      if (val.span != null) vars[`--zc-col-span-${bp}`] = String(val.span)
      if (val.offset != null) vars[`--zc-col-offset-${bp}`] = String(val.offset)
    }
  }

  return vars
})

const mergedStyle = computed(() => ({
  ...colStyle.value,
  ...cssVars.value,
}))
</script>

<template>
  <component :is="tag" :class="classes" :style="mergedStyle">
    <slot />
  </component>
</template>

<style scoped>
/* ============================================================
 * ZcCol styles
 * BEM naming: zc-col / zc-col--12 / zc-col--offset-6
 *
 * Responsive widths are implemented with CSS custom properties.
 * The component sets --zc-col-span and --zc-col-span-{bp};
 * each media query only redefines the --col-span / --col-offset
 * cascade — the flex/max-width/margin declarations live in the
 * base rule and automatically pick up the resolved value.
 *
 *   effective span = xl → lg → md → sm → xs → base
 *   Width formula:  calc(span / 24 * 100%)
 * ============================================================ */

.zc-col {
  box-sizing: border-box;
  min-width: 0;

  /* Computed sizing — references --zc-col-span / --zc-col-offset
which are resolved per-breakpoint below via cascade. */
  flex: 0 0 calc(var(--zc-col-span-resolved, 24) / 24 * 100%);
  max-width: calc(var(--zc-col-span-resolved, 24) / 24 * 100%);
  margin-left: calc(var(--zc-col-offset-resolved, 0) / 24 * 100%);
}

/* ---- xs (default, < 640px — no media query) ---- */
.zc-col {
  --zc-col-span-resolved: var(--zc-col-span-xs, var(--zc-col-span, 24));
  --zc-col-offset-resolved: var(--zc-col-offset-xs, var(--zc-col-offset, 0));
}

/* ---- sm (≥ 640px) ---- */
@media (min-width: 640px) {
  .zc-col {
    --zc-col-span-resolved: var(--zc-col-span-sm, var(--zc-col-span-xs, var(--zc-col-span, 24)));
    --zc-col-offset-resolved: var(
      --zc-col-offset-sm,
      var(--zc-col-offset-xs, var(--zc-col-offset, 0))
    );
  }
}

/* ---- md (≥ 768px) ---- */
@media (min-width: 768px) {
  .zc-col {
    --zc-col-span-resolved: var(
      --zc-col-span-md,
      var(--zc-col-span-sm, var(--zc-col-span-xs, var(--zc-col-span, 24)))
    );
    --zc-col-offset-resolved: var(
      --zc-col-offset-md,
      var(--zc-col-offset-sm, var(--zc-col-offset-xs, var(--zc-col-offset, 0)))
    );
  }
}

/* ---- lg (≥ 1024px) ---- */
@media (min-width: 1024px) {
  .zc-col {
    --zc-col-span-resolved: var(
      --zc-col-span-lg,
      var(--zc-col-span-md, var(--zc-col-span-sm, var(--zc-col-span-xs, var(--zc-col-span, 24))))
    );
    --zc-col-offset-resolved: var(
      --zc-col-offset-lg,
      var(
        --zc-col-offset-md,
        var(--zc-col-offset-sm, var(--zc-col-offset-xs, var(--zc-col-offset, 0)))
      )
    );
  }
}

/* ---- xl (≥ 1280px) ---- */
@media (min-width: 1280px) {
  .zc-col {
    --zc-col-span-resolved: var(
      --zc-col-span-xl,
      var(
        --zc-col-span-lg,
        var(--zc-col-span-md, var(--zc-col-span-sm, var(--zc-col-span-xs, var(--zc-col-span, 24))))
      )
    );
    --zc-col-offset-resolved: var(
      --zc-col-offset-xl,
      var(
        --zc-col-offset-lg,
        var(
          --zc-col-offset-md,
          var(--zc-col-offset-sm, var(--zc-col-offset-xs, var(--zc-col-offset, 0)))
        )
      )
    );
  }
}
</style>
