/**
 * ZcIconCookieMan
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/cookie-man.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a5 5 0 0 1 2.845 9.112l.147 .369l1.755 -.803c.969 -.443 2.12 -.032 2.571 .918a1.88 1.88 0 0 1 -.787 2.447l-.148 .076l-2.383 1.089v2.02l1.426 1.425l.114 .125a1.96 1.96 0 0 1 -2.762 2.762l-.125 -.114l-2.079 -2.08l-.114 -.124a2 2 0 0 1 -.161 -.22h-.599q -.071 .114 -.16 .22l-.115 .125l-2.08 2.079a1.96 1.96 0 0 1 -2.886 -2.648l.114 -.125l1.427 -1.426v-2.019l-2.383 -1.09l-.148 -.075a1.88 1.88 0 0 1 -.787 -2.447c.429 -.902 1.489 -1.318 2.424 -.978l.147 .06l1.755 .803l.147 -.369a5 5 0 0 1 -2.15 -3.895v-.217a5 5 0 0 1 5 -5l-.005 0" /><path d="M12 16h.01" /><path d="M12 13h.01" /><path d="M10 7h.01" /><path d="M14 7h.01" /><path d="M12 9h.01" />'

// Register this icon's SVG data into the global icon pool
registerIcon('cookie-man', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

const _comp: FunctionalComponent<ZcIconProps> = (props) => {
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: props.size ?? 24,
    height: props.size ?? 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: props.color ?? 'currentColor',
    'stroke-width': props.absoluteStrokeWidth
      ? Number(props.strokeWidth ?? 2) / (Number(props.size ?? 24) / 24)
      : (props.strokeWidth ?? 2),
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    class: ['zc-icon', props.class, { 'zc-icon--spin': props.spin }],
    innerHTML: _body,
  })
}

_comp.props = {
  size: { type: [Number, String], default: 24 },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: [Number, String], default: 2 },
  absoluteStrokeWidth: { type: Boolean, default: false },
  spin: { type: Boolean, default: false },
  class: { type: [String, Object, Array], default: '' },
}
_comp.displayName = 'ZcIconCookieMan'

export const ZcIconCookieMan = withInstall(_comp, 'ZcIconCookieMan')
