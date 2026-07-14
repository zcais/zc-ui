/**
 * ZcIconBarrierBlockOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/barrier-block-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 7h8a1 1 0 0 1 1 1v7c0 .27 -.107 .516 -.282 .696" /><path d="M16 16h-11a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h2" /><path d="M7 16v4" /><path d="M7.5 16l4.244 -4.244" /><path d="M13.745 9.755l2.755 -2.755" /><path d="M13.5 16l1.249 -1.249" /><path d="M16.741 12.759l3.259 -3.259" /><path d="M4 13.5l4.752 -4.752" /><path d="M17 17v3" /><path d="M5 20h4" /><path d="M15 20h4" /><path d="M17 7v-2" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('barrier-block-off', {
  path: _body,
  viewBox: '0 0 24 24',
  strokeWidth: 2,
  fill: 'none',
})

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
_comp.displayName = 'ZcIconBarrierBlockOff'

export const ZcIconBarrierBlockOff = withInstall(_comp, 'ZcIconBarrierBlockOff')
