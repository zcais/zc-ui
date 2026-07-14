/**
 * ZcIconWreckingBall
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/wrecking-ball.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 13a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M2 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M11 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M13 19l-9 0" /><path d="M4 15l9 0" /><path d="M8 12v-5h2a3 3 0 0 1 3 3v5" /><path d="M5 15v-2a1 1 0 0 1 1 -1h7" /><path d="M19 11v-7l-6 7" />'

// Register this icon's SVG data into the global icon pool
registerIcon('wrecking-ball', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconWreckingBall'

export const ZcIconWreckingBall = withInstall(_comp, 'ZcIconWreckingBall')
