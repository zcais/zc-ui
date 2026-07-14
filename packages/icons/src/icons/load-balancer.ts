/**
 * ZcIconLoadBalancer
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/load-balancer.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M11 20a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 16v3" /><path d="M12 10v-7" /><path d="M9 6l3 -3l3 3" /><path d="M12 10v-7" /><path d="M9 6l3 -3l3 3" /><path d="M14.894 12.227l6.11 -2.224" /><path d="M17.159 8.21l3.845 1.793l-1.793 3.845" /><path d="M9.101 12.214l-6.075 -2.211" /><path d="M6.871 8.21l-3.845 1.793l1.793 3.845" />'

// Register this icon's SVG data into the global icon pool
registerIcon('load-balancer', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconLoadBalancer'

export const ZcIconLoadBalancer = withInstall(_comp, 'ZcIconLoadBalancer')
