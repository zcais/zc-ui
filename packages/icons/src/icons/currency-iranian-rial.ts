/**
 * ZcIconCurrencyIranianRial
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/currency-iranian-rial.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 4v9a2 2 0 0 1 -2 2h-1a3 3 0 0 1 -3 -3v-1" /><path d="M12 5v8a1 1 0 0 0 1 1h1a2 2 0 0 0 2 -2v-1" /><path d="M21 14v1.096a5 5 0 0 1 -3.787 4.85l-.213 .054" /><path d="M11 18h.01" /><path d="M14 18h.01" />'

// Register this icon's SVG data into the global icon pool
registerIcon('currency-iranian-rial', {
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
_comp.displayName = 'ZcIconCurrencyIranianRial'

export const ZcIconCurrencyIranianRial = withInstall(_comp, 'ZcIconCurrencyIranianRial')
