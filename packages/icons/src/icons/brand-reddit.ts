/**
 * ZcIconBrandReddit
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-reddit.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14l.999 0" /><path d="M12 8l1 -5l6 1" /><path d="M18 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M8.5 13a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M14.5 13a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-reddit', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandReddit'

export const ZcIconBrandReddit = withInstall(_comp, 'ZcIconBrandReddit')
