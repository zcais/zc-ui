/**
 * ZcIconBrandCtemplar
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-ctemplar.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.04 14.831l4.46 -4.331" /><path d="M12.555 20.82c4.55 -3.456 7.582 -8.639 8.426 -14.405a1.668 1.668 0 0 0 -.934 -1.767a19.647 19.647 0 0 0 -8.047 -1.648a19.647 19.647 0 0 0 -8.047 1.647a1.668 1.668 0 0 0 -.934 1.767c.844 5.766 3.875 10.95 8.426 14.406a.948 .948 0 0 0 1.11 0" /><path d="M20 5c-2 0 -4.37 3.304 -8 6.644c-3.63 -3.34 -6 -6.644 -8 -6.644" /><path d="M17.738 15l-4.238 -4.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-ctemplar', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandCtemplar'

export const ZcIconBrandCtemplar = withInstall(_comp, 'ZcIconBrandCtemplar')
