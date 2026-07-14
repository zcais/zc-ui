/**
 * ZcIconRubberStampOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/rubber-stamp-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.273 8.273c.805 2.341 2.857 5.527 -1.484 5.527c-2.368 0 -3.789 0 -3.789 4.05h14.85" /><path d="M5 21h14" /><path d="M3 3l18 18" /><path d="M8.712 4.722a3.99 3.99 0 0 1 3.288 -1.722a4 4 0 0 1 4 4c0 .992 -.806 2.464 -1.223 3.785m6.198 6.196c-.182 -2.883 -1.332 -3.153 -3.172 -3.178" />'

// Register this icon's SVG data into the global icon pool
registerIcon('rubber-stamp-off', {
  path: _body,
  viewBox: '0 0 24 24',
  strokeWidth: 2,
  fill: 'none',
})

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
_comp.displayName = 'ZcIconRubberStampOff'

export const ZcIconRubberStampOff = withInstall(_comp, 'ZcIconRubberStampOff')
