/**
 * ZcIconDeviceNintendoOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/device-nintendo-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.713 4.718a4 4 0 0 0 -1.713 3.282v8a4 4 0 0 0 4 4h3v-10m0 -4v-2h-2" /><path d="M14 10v-6h3a4 4 0 0 1 4 4v8c0 .308 -.035 .608 -.1 .896m-1.62 2.39a3.982 3.982 0 0 1 -2.28 .714h-3v-6" /><path d="M5.5 8.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('device-nintendo-off', {
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
_comp.displayName = 'ZcIconDeviceNintendoOff'

export const ZcIconDeviceNintendoOff = withInstall(_comp, 'ZcIconDeviceNintendoOff')
