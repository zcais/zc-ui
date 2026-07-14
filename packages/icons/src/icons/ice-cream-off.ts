/**
 * ZcIconIceCreamOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/ice-cream-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 21.5v-4.5" /><path d="M8 8v9h8v-1m0 -4v-5a4 4 0 0 0 -7.277 -2.294" /><path d="M8 10.5l1.74 -.76m2.79 -1.222l3.47 -1.518" /><path d="M8 14.5l4.488 -1.964" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('ice-cream-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconIceCreamOff'

export const ZcIconIceCreamOff = withInstall(_comp, 'ZcIconIceCreamOff')
