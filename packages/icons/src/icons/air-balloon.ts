/**
 * ZcIconAirBalloon
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/air-balloon.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 21v-3h6v3a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1" /><path d="M9 18c-2.347 -2.169 -5 -5.226 -5 -8a8 8 0 1 1 16 0c0 2.774 -2.653 5.831 -5 8" /><path d="M5.5 14h13" /><path d="M10 14c-1.69 -4.712 -.924 -8.197 0 -11.602" /><path d="M14 14c1.469 -3.867 1.19 -7.735 0 -11.602" />'

// Register this icon's SVG data into the global icon pool
registerIcon('air-balloon', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconAirBalloon'

export const ZcIconAirBalloon = withInstall(_comp, 'ZcIconAirBalloon')
