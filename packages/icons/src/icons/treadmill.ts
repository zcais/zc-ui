/**
 * ZcIconTreadmill
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/treadmill.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 3a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M3 14l4 1l.5 -.5" /><path d="M12 18v-3l-3 -2.923l.75 -5.077" /><path d="M6 10v-2l4 -1l2.5 2.5l2.5 .5" /><path d="M21 22a1 1 0 0 0 -1 -1h-16a1 1 0 0 0 -1 1" /><path d="M18 21l1 -11l2 -1" />'

// Register this icon's SVG data into the global icon pool
registerIcon('treadmill', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconTreadmill'

export const ZcIconTreadmill = withInstall(_comp, 'ZcIconTreadmill')
