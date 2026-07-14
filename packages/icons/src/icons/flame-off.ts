/**
 * ZcIconFlameOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/flame-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.973 8.974c-.335 .378 -.67 .716 -.973 1.026c-1.226 1.26 -2 3.24 -2 5a6 6 0 0 0 11.472 2.466m.383 -3.597c-.32 -1.409 -1.122 -3.045 -1.855 -3.869c-.281 .472 -.543 .87 -.79 1.202m-2.358 -2.35c-.068 -2.157 -1.182 -4.184 -1.852 -4.852c0 .968 -.18 1.801 -.465 2.527" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('flame-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconFlameOff'

export const ZcIconFlameOff = withInstall(_comp, 'ZcIconFlameOff')
