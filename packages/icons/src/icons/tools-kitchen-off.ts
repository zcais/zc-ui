/**
 * ZcIconToolsKitchenOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/tools-kitchen-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 3h5l-.5 4.5m-.4 3.595l-.1 .905h-6l-.875 -7.874" /><path d="M7 18h2v3h-2v-3" /><path d="M15.225 11.216c.42 -2.518 1.589 -5.177 4.775 -8.216v12h-1" /><path d="M20 15v1m0 4v1h-1v-2" /><path d="M8 12v6" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('tools-kitchen-off', {
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
_comp.displayName = 'ZcIconToolsKitchenOff'

export const ZcIconToolsKitchenOff = withInstall(_comp, 'ZcIconToolsKitchenOff')
