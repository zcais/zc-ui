/**
 * ZcIconFilter2Search
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/filter-2-search.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6h16" /><path d="M6 12h8.5" /><path d="M9 18h2" /><path d="M15 18c0 .796 .316 1.559 .879 2.121c.563 .563 1.326 .879 2.121 .879c.796 0 1.559 -.316 2.121 -.879c.563 -.563 .879 -1.326 .879 -2.121c0 -.796 -.316 -1.559 -.879 -2.121c-.563 -.563 -1.326 -.879 -2.121 -.879c-.796 0 -1.559 .316 -2.121 .879c-.563 .563 -.879 1.326 -.879 2.121" /><path d="M20.2 20.2l1.8 1.8" />'

// Register this icon's SVG data into the global icon pool
registerIcon('filter-2-search', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconFilter2Search'

export const ZcIconFilter2Search = withInstall(_comp, 'ZcIconFilter2Search')
