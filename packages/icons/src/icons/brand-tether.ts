/**
 * ZcIconBrandTether
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-tether.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.08 20.188c-1.15 1.083 -3.02 1.083 -4.17 0l-6.93 -6.548c-.96 -.906 -1.27 -2.624 -.69 -3.831l2.4 -5.018c.47 -.991 1.72 -1.791 2.78 -1.791h9.06c1.06 0 2.31 .802 2.78 1.79l2.4 5.019c.58 1.207 .26 2.925 -.69 3.83c-3.453 3.293 -3.466 3.279 -6.94 6.549" /><path d="M12 15v-7" /><path d="M8 8h8" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-tether', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandTether'

export const ZcIconBrandTether = withInstall(_comp, 'ZcIconBrandTether')
