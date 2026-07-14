/**
 * ZcIconBrandWebflow
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-webflow.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 10s-1.376 3.606 -1.5 4c-.046 -.4 -1.5 -8 -1.5 -8c-2.627 0 -3.766 1.562 -4.5 3.5c0 0 -1.843 4.593 -2 5c-.013 -.368 -.5 -4.5 -.5 -4.5c-.15 -2.371 -2.211 -3.98 -4 -3.98l2 12.98c2.745 -.013 4.72 -1.562 5.5 -3.5c0 0 1.44 -4.3 1.5 -4.5c.013 .18 1 8 1 8c2.758 0 4.694 -1.626 5.5 -3.5l3.5 -9.5c-2.732 0 -4.253 2.055 -5 4" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-webflow', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandWebflow'

export const ZcIconBrandWebflow = withInstall(_comp, 'ZcIconBrandWebflow')
