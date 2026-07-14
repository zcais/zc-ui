/**
 * ZcIconDeviceComputerCameraOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/device-computer-camera-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.15 6.153a7 7 0 0 0 9.696 9.696m2 -2a7 7 0 0 0 -9.699 -9.695" /><path d="M9.13 9.122a3 3 0 0 0 3.743 3.749m2 -2a3 3 0 0 0 -3.737 -3.736" /><path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('device-computer-camera-off', {
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
_comp.displayName = 'ZcIconDeviceComputerCameraOff'

export const ZcIconDeviceComputerCameraOff = withInstall(_comp, 'ZcIconDeviceComputerCameraOff')
