/**
 * ZcIconRecharging
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/recharging.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7.038 4.5a9 9 0 0 0 -2.495 2.47" /><path d="M3.186 10.209a9 9 0 0 0 0 3.508" /><path d="M4.5 16.962a9 9 0 0 0 2.47 2.495" /><path d="M10.209 20.814a9 9 0 0 0 3.5 0" /><path d="M16.962 19.5a9 9 0 0 0 2.495 -2.47" /><path d="M20.814 13.791a9 9 0 0 0 0 -3.508" /><path d="M19.5 7.038a9 9 0 0 0 -2.47 -2.495" /><path d="M13.791 3.186a9 9 0 0 0 -3.508 -.02" /><path d="M12 8l-2 4h4l-2 4" /><path d="M12 21a9 9 0 0 0 0 -18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('recharging', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconRecharging'

export const ZcIconRecharging = withInstall(_comp, 'ZcIconRecharging')
