/**
 * ZcIconBrandStackoverflow
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-stackoverflow.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-1" /><path d="M8 16h8" /><path d="M8.322 12.582l7.956 .836" /><path d="M8.787 9.168l7.826 1.664" /><path d="M10.096 5.764l7.608 2.472" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-stackoverflow', {
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
_comp.displayName = 'ZcIconBrandStackoverflow'

export const ZcIconBrandStackoverflow = withInstall(_comp, 'ZcIconBrandStackoverflow')
