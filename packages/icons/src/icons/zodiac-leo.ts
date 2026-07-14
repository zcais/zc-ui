/**
 * ZcIconZodiacLeo
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/zodiac-leo.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 17a4 4 0 1 0 8 0" /><path d="M3 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M7 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M7 7c0 3 2 5 2 9" /><path d="M15 7c0 4 -2 6 -2 10" />'

// Register this icon's SVG data into the global icon pool
registerIcon('zodiac-leo', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconZodiacLeo'

export const ZcIconZodiacLeo = withInstall(_comp, 'ZcIconZodiacLeo')
