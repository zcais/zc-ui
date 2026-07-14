/**
 * ZcIconMiddleware
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/middleware.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20l2.25 -2.25" /><path d="M20 20l-2.25 -2.25" /><path d="M20 4l-2.25 2.25" /><path d="M4 4l2.25 2.25" /><path d="M10 19.748a8.01 8.01 0 0 1 -5.747 -5.748" /><path d="M19.748 14a8.01 8.01 0 0 1 -5.748 5.748" /><path d="M4.252 10a8.02 8.02 0 0 1 5.478 -5.672l.27 -.075" /><path d="M14 4.252a8.01 8.01 0 0 1 5.748 5.749" /><path d="M11 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('middleware', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconMiddleware'

export const ZcIconMiddleware = withInstall(_comp, 'ZcIconMiddleware')
