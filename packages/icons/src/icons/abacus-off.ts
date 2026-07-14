/**
 * ZcIconAbacusOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/abacus-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5v16" /><path d="M19 21v-2m0 -4v-12" /><path d="M5 7h2m4 0h8" /><path d="M5 15h10" /><path d="M8 13v4" /><path d="M11 13v4" /><path d="M16 16v1" /><path d="M14 5v4" /><path d="M11 5v2" /><path d="M8 8v1" /><path d="M3 21h18" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('abacus-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconAbacusOff'

export const ZcIconAbacusOff = withInstall(_comp, 'ZcIconAbacusOff')
