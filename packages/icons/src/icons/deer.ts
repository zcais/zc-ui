/**
 * ZcIconDeer
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/deer.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 3c0 2 1 3 4 3c2 0 3 1 3 3" /><path d="M21 3c0 2 -1 3 -4 3c-2 0 -3 .333 -3 3" /><path d="M12 18c-1 0 -4 -3 -4 -6c0 -2 1.333 -3 4 -3s4 1 4 3c0 3 -3 6 -4 6" /><path d="M15.185 14.889l.095 -.18a4 4 0 1 1 -6.56 0" /><path d="M17 3c0 1.333 -.333 2.333 -1 3" /><path d="M7 3c0 1.333 .333 2.333 1 3" /><path d="M7 6c-2.667 .667 -4.333 1.667 -5 3" /><path d="M17 6c2.667 .667 4.333 1.667 5 3" /><path d="M8.5 10l-1.5 -1" /><path d="M15.5 10l1.5 -1" /><path d="M12 15h.01" />'

// Register this icon's SVG data into the global icon pool
registerIcon('deer', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconDeer'

export const ZcIconDeer = withInstall(_comp, 'ZcIconDeer')
