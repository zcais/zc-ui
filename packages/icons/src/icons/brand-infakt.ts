/**
 * ZcIconBrandInfakt
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-infakt.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14.936 6.063a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M5.52 5c.002 -.033 -1.69 1.568 1.02 3.733c-1.092 2.015 .853 2.992 .853 2.992c-.972 1.879 1.39 2.805 1.39 2.805c-1 2.39 -2 4.68 -3.555 6.454c1.495 .09 2.04 -.196 2.9 -.844c3.386 -2.552 4.937 -6.471 5.765 -8.62c.385 -1.001 -.323 -2.47 -1.247 -2.964c-2.52 -1.35 -7.178 -3.526 -7.127 -3.555" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-infakt', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandInfakt'

export const ZcIconBrandInfakt = withInstall(_comp, 'ZcIconBrandInfakt')
