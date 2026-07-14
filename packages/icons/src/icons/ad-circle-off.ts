/**
 * ZcIconAdCircleOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/ad-circle-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.91 4.949a9.968 9.968 0 0 0 -2.91 7.051c0 5.523 4.477 10 10 10a9.968 9.968 0 0 0 7.05 -2.909" /><path d="M20.778 16.793a9.955 9.955 0 0 0 1.222 -4.793c0 -5.523 -4.477 -10 -10 -10c-1.74 0 -3.376 .444 -4.8 1.225" /><path d="M7 15v-4.5a1.5 1.5 0 0 1 2.138 -1.358" /><path d="M9.854 9.853c.094 .196 .146 .415 .146 .647v4.5" /><path d="M7 13h3" /><path d="M14 14v1h1" /><path d="M17 13v-2a2 2 0 0 0 -2 -2h-1v1" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('ad-circle-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconAdCircleOff'

export const ZcIconAdCircleOff = withInstall(_comp, 'ZcIconAdCircleOff')
