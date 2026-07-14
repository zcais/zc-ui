/**
 * ZcIconHexagonsOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/hexagons-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 18v-5l4 -2l4 2v5l-4 2l-4 -2" /><path d="M8 11v-3m1.332 -2.666l2.668 -1.334l4 2v5" /><path d="M12 13l.661 -.331" /><path d="M15.345 11.328l.655 -.328l4 2v3m-1.334 2.667l-2.666 1.333l-4 -2" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('hexagons-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconHexagonsOff'

export const ZcIconHexagonsOff = withInstall(_comp, 'ZcIconHexagonsOff')
