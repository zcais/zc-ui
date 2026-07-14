/**
 * ZcIconTopologyComplex
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/topology-complex.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M8 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M8 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M20 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M7.5 7.5l3 3" /><path d="M6 8v8" /><path d="M18 16v-8" /><path d="M8 6h8" /><path d="M16 18h-8" />'

// Register this icon's SVG data into the global icon pool
registerIcon('topology-complex', {
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
_comp.displayName = 'ZcIconTopologyComplex'

export const ZcIconTopologyComplex = withInstall(_comp, 'ZcIconTopologyComplex')
