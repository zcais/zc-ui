/**
 * ZcIconJetski
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/jetski.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 5h1.4a1 1 0 0 1 .882 .53l1.718 3.22" /><path d="M3.485 16.94l.136 .545a2 2 0 0 0 1.94 1.515h7.439a10 10 0 0 0 8 -4c0 -6 -5 -8 -5 -8c-1.889 2.518 -5.852 4 -9 4h-2a2 2 0 0 0 -2 2c0 1.328 .163 2.652 .485 3.94" /><path d="M3.25 15h17.75" />'

// Register this icon's SVG data into the global icon pool
registerIcon('jetski', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconJetski'

export const ZcIconJetski = withInstall(_comp, 'ZcIconJetski')
