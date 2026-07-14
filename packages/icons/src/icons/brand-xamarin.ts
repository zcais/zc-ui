/**
 * ZcIconBrandXamarin
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-xamarin.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15.958 21h-7.917a2 2 0 0 1 -1.732 -1l-4.041 -7a2 2 0 0 1 0 -2l4.041 -7a2 2 0 0 1 1.732 -1h7.917a2 2 0 0 1 1.732 1l4.042 7a2 2 0 0 1 0 2l-4.041 7a2 2 0 0 1 -1.733 1" /><path d="M15 16l-6 -8" /><path d="M9 16l6 -8" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-xamarin', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandXamarin'

export const ZcIconBrandXamarin = withInstall(_comp, 'ZcIconBrandXamarin')
