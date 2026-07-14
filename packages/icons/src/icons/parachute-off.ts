/**
 * ZcIconParachuteOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/parachute-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 12c0 -5.523 -4.477 -10 -10 -10c-1.737 0 -3.37 .443 -4.794 1.222m-2.28 1.71a9.969 9.969 0 0 0 -2.926 7.068" /><path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.63 0 -2.973 1.099 -3.212 2.54m-.097 -.09c-.23 -1.067 -1.12 -1.935 -2.29 -2.284m-3.445 .568c-.739 .55 -1.206 1.36 -1.206 2.266c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" /><path d="M2 12l10 10l-3.5 -10" /><path d="M14.582 14.624l-2.582 7.376l4.992 -4.992m2.014 -2.014l3 -3" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('parachute-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconParachuteOff'

export const ZcIconParachuteOff = withInstall(_comp, 'ZcIconParachuteOff')
