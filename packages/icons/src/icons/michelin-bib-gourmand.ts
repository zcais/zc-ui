/**
 * ZcIconMichelinBibGourmand
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/michelin-bib-gourmand.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.97 20c-2.395 -1.947 -4.763 -5.245 -1.005 -8c-.52 -4 3.442 -7.5 5.524 -7.5c.347 -1 1.499 -1.5 2.54 -1.5c1.04 0 2.135 .5 2.482 1.5c2.082 0 6.044 3.5 5.524 7.5c3.758 2.755 1.39 6.053 -1.005 8" /><path d="M8 11a1 2 0 1 0 2 0a1 2 0 1 0 -2 0" /><path d="M14 11a1 2 0 1 0 2 0a1 2 0 1 0 -2 0" /><path d="M8 17.085c3.5 2.712 6.5 2.712 9 -1.085" /><path d="M13 18.5c.815 -2.337 1.881 -1.472 2 -.55" />'

// Register this icon's SVG data into the global icon pool
registerIcon('michelin-bib-gourmand', {
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
_comp.displayName = 'ZcIconMichelinBibGourmand'

export const ZcIconMichelinBibGourmand = withInstall(_comp, 'ZcIconMichelinBibGourmand')
