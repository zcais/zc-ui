/**
 * ZcIconBrandSharik
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-sharik.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.281 16.606a8.968 8.968 0 0 1 1.363 -10.977a9.033 9.033 0 0 1 11.011 -1.346c-1.584 4.692 -2.415 6.96 -4.655 8.717c-1.584 1.242 -3.836 2.24 -7.719 3.606m16.335 -7.306c2.113 7.59 -4.892 13.361 -11.302 11.264c1.931 -3.1 3.235 -4.606 4.686 -6.065c1.705 -1.715 3.591 -3.23 6.616 -5.199" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-sharik', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandSharik'

export const ZcIconBrandSharik = withInstall(_comp, 'ZcIconBrandSharik')
