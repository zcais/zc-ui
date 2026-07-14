/**
 * ZcIconLeafOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/leaf-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21c.475 -4.27 2.3 -7.64 6.331 -9.683" /><path d="M6.618 6.623c-1.874 1.625 -2.625 3.877 -2.632 6.377c0 1 0 3 2 5h3.014c2.733 0 5.092 -.635 6.92 -2.087m1.899 -2.099c1.224 -1.872 1.987 -4.434 2.181 -7.814v-2h-4.014c-2.863 0 -5.118 .405 -6.861 1.118" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('leaf-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconLeafOff'

export const ZcIconLeafOff = withInstall(_comp, 'ZcIconLeafOff')
