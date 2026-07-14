/**
 * ZcIconLeafMaple
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/leaf-maple.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21c.5 -4.5 2.5 -8 7 -10" /><path d="M13 19c-2.733 0 -4.16 -3.11 -5 -5c-1.892 -.84 -4 -1.826 -4 -4.556c1.014 -.644 2.816 -.649 4 -.444c-.312 -2.071 -.37 -4.414 1 -6c2.364 .369 3 4 3 4c1.463 -1.368 4 -2 6 -2c0 2 -.63 4.538 -2 6q 3.687 .996 4 3c-1.586 1.36 -3.933 1.311 -6 1q .19 1.098 -1 4" />'

// Register this icon's SVG data into the global icon pool
registerIcon('leaf-maple', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconLeafMaple'

export const ZcIconLeafMaple = withInstall(_comp, 'ZcIconLeafMaple')
