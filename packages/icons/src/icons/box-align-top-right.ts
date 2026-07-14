/**
 * ZcIconBoxAlignTopRight
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/box-align-top-right.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 11.01h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1" /><path d="M20 15.01v-.01" /><path d="M20 20.01v-.01" /><path d="M15 20.01v-.01" /><path d="M9 20.01v-.01" /><path d="M9 4.01v-.01" /><path d="M4 20.01v-.01" /><path d="M4 15.01v-.01" /><path d="M4 9.01v-.01" /><path d="M4 4.01v-.01" />'

// Register this icon's SVG data into the global icon pool
registerIcon('box-align-top-right', {
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
_comp.displayName = 'ZcIconBoxAlignTopRight'

export const ZcIconBoxAlignTopRight = withInstall(_comp, 'ZcIconBoxAlignTopRight')
