/**
 * ZcIconBatteryVerticalCharging2
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/battery-vertical-charging-2.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 18v-11c0 -1.105 .895 -2 2 -2h.5c.276 0 .5 -.224 .5 -.5s.224 -.5 .5 -.5h3c.276 0 .5 .224 .5 .5s.224 .5 .5 .5h.5c1.105 0 2 .895 2 2v1m-10 10c0 1.105 .895 2 2 2h1" /><path d="M12 14h6v2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -2" /><path d="M15 21v-3" /><path d="M13 14v-2.5" /><path d="M17 14v-2.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('battery-vertical-charging-2', {
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
_comp.displayName = 'ZcIconBatteryVerticalCharging2'

export const ZcIconBatteryVerticalCharging2 = withInstall(_comp, 'ZcIconBatteryVerticalCharging2')
