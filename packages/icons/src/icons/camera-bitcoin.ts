/**
 * ZcIconCameraBitcoin
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/camera-bitcoin.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1" /><path d="M14.477 11.307a3 3 0 1 0 -2.477 4.693" /><path d="M17 21v-6" /><path d="M19 15v-1.5" /><path d="M19 22.5v-1.5" /><path d="M17 18h3" /><path d="M19 18h.5a1.5 1.5 0 0 1 0 3h-3.5" /><path d="M19 18h.5a1.5 1.5 0 0 0 0 -3h-3.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('camera-bitcoin', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconCameraBitcoin'

export const ZcIconCameraBitcoin = withInstall(_comp, 'ZcIconCameraBitcoin')
