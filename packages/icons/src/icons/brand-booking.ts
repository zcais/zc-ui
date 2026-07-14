/**
 * ZcIconBrandBooking
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-booking.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 18v-9.5a4.5 4.5 0 0 1 4.5 -4.5h7a4.5 4.5 0 0 1 4.5 4.5v7a4.5 4.5 0 0 1 -4.5 4.5h-9.5a2 2 0 0 1 -2 -2" /><path d="M8 12h3.5a2 2 0 1 1 0 4h-3.5v-7a1 1 0 0 1 1 -1h1.5a2 2 0 1 1 0 4h-1.5" /><path d="M16 16l.01 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-booking', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandBooking'

export const ZcIconBrandBooking = withInstall(_comp, 'ZcIconBrandBooking')
