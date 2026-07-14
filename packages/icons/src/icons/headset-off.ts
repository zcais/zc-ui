/**
 * ZcIconHeadsetOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/headset-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 14v-3c0 -1.953 .7 -3.742 1.862 -5.13m2.182 -1.825a8 8 0 0 1 11.956 6.955v3" /><path d="M18 19c0 1.657 -2.686 3 -6 3" /><path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3" /><path d="M16.169 12.18c.253 -.115 .534 -.18 .831 -.18h1a2 2 0 0 1 2 2v2m-1.183 2.826c-.25 .112 -.526 .174 -.817 .174h-1a2 2 0 0 1 -2 -2v-2" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('headset-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconHeadsetOff'

export const ZcIconHeadsetOff = withInstall(_comp, 'ZcIconHeadsetOff')
