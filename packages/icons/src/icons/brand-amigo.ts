/**
 * ZcIconBrandAmigo
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-amigo.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M9.591 3.635l-7.13 14.082c-1.712 3.38 1.759 5.45 3.69 3.573l1.86 -1.81c3.142 -3.054 4.959 -2.99 8.039 .11l1.329 1.337c2.372 2.387 5.865 .078 4.176 -3.225l-7.195 -14.067c-1.114 -2.18 -3.666 -2.18 -4.77 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-amigo', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandAmigo'

export const ZcIconBrandAmigo = withInstall(_comp, 'ZcIconBrandAmigo')
