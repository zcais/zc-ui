/**
 * ZcIconBrandSnowflake
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-snowflake.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 21v-5.5l4.5 2.5" /><path d="M10 21v-5.5l-4.5 2.5" /><path d="M3.5 14.5l4.5 -2.5l-4.5 -2.5" /><path d="M20.5 9.5l-4.5 2.5l4.5 2.5" /><path d="M10 3v5.5l-4.5 -2.5" /><path d="M14 3v5.5l4.5 -2.5" /><path d="M12 11l1 1l-1 1l-1 -1l1 -1" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-snowflake', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandSnowflake'

export const ZcIconBrandSnowflake = withInstall(_comp, 'ZcIconBrandSnowflake')
