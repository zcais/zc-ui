/**
 * ZcIconLayoutOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/layout-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 4a2 2 0 0 1 2 2m-1.162 2.816a1.993 1.993 0 0 1 -.838 .184h-2a2 2 0 0 1 -2 -2v-1c0 -.549 .221 -1.046 .58 -1.407" /><path d="M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3" /><path d="M14 10v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v10m-.595 3.423a2 2 0 0 1 -1.405 .577h-2a2 2 0 0 1 -2 -2v-4" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('layout-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconLayoutOff'

export const ZcIconLayoutOff = withInstall(_comp, 'ZcIconLayoutOff')
