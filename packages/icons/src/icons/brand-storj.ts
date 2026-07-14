/**
 * ZcIconBrandStorj
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-storj.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M3 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M11 3a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M11 21a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 21l-8 -4v-10l8 -4l8 4v10l-8 4" /><path d="M9.1 15a2.1 2.1 0 0 1 -.648 -4.098c.282 -1.648 1.319 -2.902 3.048 -2.902c1.694 0 2.906 1.203 3.23 2.8h.17a2.1 2.1 0 0 1 .202 4.19l-.202 .01h-5.8" /><path d="M4 7l4.323 2.702" /><path d="M16.413 14.758l3.587 2.242" /><path d="M4 17l3.529 -2.206" /><path d="M14.609 10.37l5.391 -3.37" /><path d="M12 3v5" /><path d="M12 15v6" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-storj', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandStorj'

export const ZcIconBrandStorj = withInstall(_comp, 'ZcIconBrandStorj')
