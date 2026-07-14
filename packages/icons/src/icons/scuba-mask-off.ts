/**
 * ZcIconScubaMaskOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/scuba-mask-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 7h5a1 1 0 0 1 1 1v4.5c0 .154 -.014 .304 -.04 .45m-2 2.007c-.15 .028 -.305 .043 -.463 .043h-.5a2 2 0 0 1 -2 -2a2 2 0 1 0 -4 0a2 2 0 0 1 -2 2h-.5a2.5 2.5 0 0 1 -2.5 -2.5v-4.5a1 1 0 0 1 1 -1h3" /><path d="M10 17a2 2 0 0 0 2 2h3.5a5.475 5.475 0 0 0 2.765 -.744m2 -2c.47 -.81 .739 -1.752 .739 -2.756v-9.5" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('scuba-mask-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconScubaMaskOff'

export const ZcIconScubaMaskOff = withInstall(_comp, 'ZcIconScubaMaskOff')
