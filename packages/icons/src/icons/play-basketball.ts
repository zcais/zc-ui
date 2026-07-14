/**
 * ZcIconPlayBasketball
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/play-basketball.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9.007 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 21l3 -3l.75 -1.5" /><path d="M14 21v-4l-4 -3l.5 -6" /><path d="M5 12l1 -3l4.5 -1l3.5 3l4 -.5" /><path d="M18.007 15.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('play-basketball', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconPlayBasketball'

export const ZcIconPlayBasketball = withInstall(_comp, 'ZcIconPlayBasketball')
