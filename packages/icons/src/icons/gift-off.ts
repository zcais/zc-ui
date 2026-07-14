/**
 * ZcIconGiftOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/gift-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 8h8a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4m-4 0h-8a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h4" /><path d="M12 12v9" /><path d="M19 12v3m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 -2.457 -2.963m2.023 -2c.14 -.023 .286 -.037 .434 -.037c1.974 -.034 3.76 1.95 4.5 5c.74 -3.05 2.526 -5.034 4.5 -5a2.5 2.5 0 1 1 0 5" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('gift-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconGiftOff'

export const ZcIconGiftOff = withInstall(_comp, 'ZcIconGiftOff')
