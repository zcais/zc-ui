/**
 * ZcIconBrandAdobePhotoshop
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-adobe-photoshop.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12c0 -4.243 0 -6.364 1.318 -7.682s3.44 -1.318 7.682 -1.318s6.364 0 7.682 1.318s1.318 3.44 1.318 7.682s0 6.364 -1.318 7.682s-3.44 1.318 -7.682 1.318s-6.364 0 -7.682 -1.318s-1.318 -3.44 -1.318 -7.682" /><path d="M6.79 15.79v-3.79m0 0v-2.724c0 -.11 0 -.165 .004 -.211c.044 -.45 .4 -.806 .85 -.85c.046 -.004 .101 -.004 .211 -.004h1.303a1.895 1.895 0 1 1 0 3.789l-2.368 0" /><path d="M17.178 11.263c-.164 -.659 -.935 -1.158 -1.862 -1.158c-1.047 0 -1.895 .637 -1.895 1.421c0 .785 .848 1.421 1.895 1.421c1.046 0 1.895 .637 1.895 1.421c0 .785 -.849 1.421 -1.895 1.421c-.93 0 -1.704 -.502 -1.864 -1.165" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-adobe-photoshop', {
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
_comp.displayName = 'ZcIconBrandAdobePhotoshop'

export const ZcIconBrandAdobePhotoshop = withInstall(_comp, 'ZcIconBrandAdobePhotoshop')
