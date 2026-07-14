/**
 * ZcIconRippleUp
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/ripple-up.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7q 4.5 -3 9 0t 9 0" /><path d="M3 17q 4.5 -3 9 0q .218 .144 .434 .275" /><path d="M3 12q 4.5 -3 9 0q 1.941 1.294 3.882 1.472" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" />'

// Register this icon's SVG data into the global icon pool
registerIcon('ripple-up', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconRippleUp'

export const ZcIconRippleUp = withInstall(_comp, 'ZcIconRippleUp')
