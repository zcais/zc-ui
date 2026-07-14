---
name: vitepress-li-margin-leaks-into-list-components
description: VitePress .vp-doc li+li margin leaks into zc-ui list components; scoped overrides on slotted <li> need :deep()
metadata:
  type: project
---

VitePress's default theme rule `.vp-doc li + li { margin-top: 8px }` (in
`node_modules/.../theme-default/styles/components/vp-doc.css`, specificity
`(0,1,2)`) leaks into any zc-ui component that renders `<ul>/<li>` and is shown
in the docs demos — e.g. `ZcMenu`. Symptom: every menu item after the first is
pushed down by 8px.

**Why a plain scoped override fails:** an override like
`.zc-menu > .zc-menu__item + .zc-menu__item` compiles to
`.zc-menu[data-v-X] > .zc-menu__item[data-v-X] + .zc-menu__item[data-v-X]`. The
`<li>` items are rendered by slotted **child** components (`ZcMenuItem`/
`ZcSubmenu`) and passed in via `<slot />`, so they inherit the scope ID of the
template that authored them (the `.md`/`DemoBlock`), NOT `ZcMenu`'s. The
`[data-v-X]` never lands on the `<li>` → the selector never matches → dead code.

**How to apply:** use `:deep()` (already used in `form-item.vue`):
`.zc-menu :deep(li + li) { margin-top: 0 }` → compiles to
`.zc-menu[data-v-X] li+li` (specificity `(0,2,2)`), which beats VitePress and
matches real DOM since the `<ul>` carries the data-v. This applies to ANY future
list-based component (steps, breadcrumb, timeline, etc.) rendered in docs.
