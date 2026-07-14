/**
 * ZcIconTargetOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/target-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.286 11.3a1 1 0 0 0 1.41 1.419" /><path d="M8.44 8.49a5 5 0 0 0 7.098 7.044m1.377 -2.611a5 5 0 0 0 -5.846 -5.836" /><path d="M5.649 5.623a9 9 0 1 0 12.698 12.758m1.683 -2.313a9 9 0 0 0 -12.076 -12.11" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('target-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconTargetOff'

export const ZcIconTargetOff = withInstall(_comp, 'ZcIconTargetOff')
