/**
 * ZcIconVirusSearch
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/virus-search.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 12a5 5 0 1 0 -5 5" /><path d="M12 7v-4" /><path d="M11 3h2" /><path d="M15.536 8.464l2.828 -2.828" /><path d="M17.657 4.929l1.414 1.414" /><path d="M17 12h4" /><path d="M21 11v2" /><path d="M12 17v4" /><path d="M13 21h-2" /><path d="M8.465 15.536l-2.829 2.828" /><path d="M6.343 19.071l-1.413 -1.414" /><path d="M7 12h-4" /><path d="M3 13v-2" /><path d="M8.464 8.464l-2.828 -2.828" /><path d="M4.929 6.343l1.414 -1.413" /><path d="M15 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" /><path d="M19.5 19.5l2.5 2.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('virus-search', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconVirusSearch'

export const ZcIconVirusSearch = withInstall(_comp, 'ZcIconVirusSearch')
