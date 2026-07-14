/**
 * ZcIconBrandBadoo
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-badoo.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 9.43c0 5.838 -4.477 10.57 -10 10.57s-10 -4.662 -10 -10.5c0 -2.667 1.83 -5.01 4.322 -5.429c2.492 -.418 4.9 1.392 5.678 3.929c.768 -2.54 3.177 -4.354 5.668 -3.931c2.495 .417 4.332 2.69 4.332 5.36" /><path d="M7.5 10c0 2.761 2.015 5 4.5 5s4.5 -2.239 4.5 -5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-badoo', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandBadoo'

export const ZcIconBrandBadoo = withInstall(_comp, 'ZcIconBrandBadoo')
