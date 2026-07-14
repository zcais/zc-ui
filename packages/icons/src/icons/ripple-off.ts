/**
 * ZcIconRippleOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/ripple-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7c.915 -.61 1.83 -1.034 2.746 -1.272m4.212 .22c.68 .247 1.361 .598 2.042 1.052c3 2 6 2 9 0" /><path d="M3 17c3 -2 6 -2 9 0c2.092 1.395 4.184 1.817 6.276 1.266" /><path d="M3 12c3 -2 6 -2 9 0m5.482 1.429c1.173 -.171 2.345 -.647 3.518 -1.429" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('ripple-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconRippleOff'

export const ZcIconRippleOff = withInstall(_comp, 'ZcIconRippleOff')
