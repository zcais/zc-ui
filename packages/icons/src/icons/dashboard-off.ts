/**
 * ZcIconDashboardOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/dashboard-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.175 11.178a2 2 0 1 0 2.653 2.634" /><path d="M14.5 10.5l1 -1" /><path d="M8.621 4.612a9 9 0 0 1 11.721 11.72m-1.516 2.488a9.008 9.008 0 0 1 -1.226 1.18h-11.2a9 9 0 0 1 -.268 -13.87" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('dashboard-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconDashboardOff'

export const ZcIconDashboardOff = withInstall(_comp, 'ZcIconDashboardOff')
