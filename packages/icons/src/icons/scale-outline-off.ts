/**
 * ZcIconScaleOutlineOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/scale-outline-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3h10a4 4 0 0 1 4 4v10m-1.173 2.83a3.987 3.987 0 0 1 -2.827 1.17h-10a4 4 0 0 1 -4 -4v-10c0 -1.104 .447 -2.103 1.17 -2.827" /><path d="M11.062 7.062c.31 -.041 .622 -.062 .938 -.062c1.956 0 3.724 .802 5 2.095a142.85 142.85 0 0 0 -2 1.905m-3.723 .288a3 3 0 0 0 -1.315 .71l-2.956 -2.903a6.977 6.977 0 0 1 1.142 -.942" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('scale-outline-off', {
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
_comp.displayName = 'ZcIconScaleOutlineOff'

export const ZcIconScaleOutlineOff = withInstall(_comp, 'ZcIconScaleOutlineOff')
