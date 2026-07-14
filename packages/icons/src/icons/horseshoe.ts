/**
 * ZcIconHorseshoe
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/horseshoe.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 17c.5 -1.242 2 -2 2 -5s-1 -9 -9 -9s-9 6 -9 9s1.495 3.749 2 5l-2 1l2 3l2.406 -1.147c1.25 -.714 1.778 -2.08 1.203 -3.363c-1.078 -2.407 -1.609 -8.49 3.391 -8.49s4.469 6.083 3.39 8.49c-.574 1.284 -.045 2.649 1.204 3.363l2.406 1.147l2 -3l-2 -1" />'

// Register this icon's SVG data into the global icon pool
registerIcon('horseshoe', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconHorseshoe'

export const ZcIconHorseshoe = withInstall(_comp, 'ZcIconHorseshoe')
