/**
 * ZcIconMarqueeOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/marquee-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6c0 -.556 .227 -1.059 .593 -1.421" /><path d="M9 4h1.5" /><path d="M13.5 4h1.5" /><path d="M18 4a2 2 0 0 1 2 2" /><path d="M20 9v1.5" /><path d="M20 13.5v1.5" /><path d="M19.402 19.426a1.993 1.993 0 0 1 -1.402 .574" /><path d="M15 20h-1.5" /><path d="M10.5 20h-1.5" /><path d="M6 20a2 2 0 0 1 -2 -2" /><path d="M4 15v-1.5" /><path d="M4 10.5v-1.5" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('marquee-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconMarqueeOff'

export const ZcIconMarqueeOff = withInstall(_comp, 'ZcIconMarqueeOff')
