/**
 * ZcIconChess
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/chess.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a3 3 0 0 1 3 3c0 1.113 -.6 2.482 -1.5 3l1.5 7h-6l1.5 -7c-.9 -.518 -1.5 -1.887 -1.5 -3a3 3 0 0 1 3 -3" /><path d="M8 9h8" /><path d="M6.684 16.772a1 1 0 0 0 -.684 .949v1.279a1 1 0 0 0 1 1h10a1 1 0 0 0 1 -1v-1.28a1 1 0 0 0 -.684 -.948l-2.316 -.772h-6l-2.316 .772" />'

// Register this icon's SVG data into the global icon pool
registerIcon('chess', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconChess'

export const ZcIconChess = withInstall(_comp, 'ZcIconChess')
