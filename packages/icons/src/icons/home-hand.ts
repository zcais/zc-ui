/**
 * ZcIconHomeHand
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/home-hand.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 9l-6 -6l-9 9h2v7a2 2 0 0 0 2 2h3.5" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2" /><path d="M16 17.5l-.585 -.578a1.516 1.516 0 0 0 -2 0c-.477 .433 -.551 1.112 -.177 1.622l1.762 2.456c.37 .506 1.331 1 2 1h3c1.009 0 1.497 -.683 1.622 -1.593c.252 -.938 .378 -1.74 .378 -2.407c0 -1 -.939 -1.843 -2 -2h-1v-2.636c0 -.754 -.672 -1.364 -1.5 -1.364s-1.5 .61 -1.5 1.364v4.136" />'

// Register this icon's SVG data into the global icon pool
registerIcon('home-hand', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconHomeHand'

export const ZcIconHomeHand = withInstall(_comp, 'ZcIconHomeHand')
