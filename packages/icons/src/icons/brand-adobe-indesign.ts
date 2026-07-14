/**
 * ZcIconBrandAdobeIndesign
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-adobe-indesign.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12c0 -4.243 0 -6.364 1.318 -7.682s3.44 -1.318 7.682 -1.318s6.364 0 7.682 1.318s1.318 3.44 1.318 7.682s0 6.364 -1.318 7.682s-3.44 1.318 -7.682 1.318s-6.364 0 -7.682 -1.318s-1.318 -3.44 -1.318 -7.682" /><path d="M15 11v4c0 1.1 -.657 .997 -1.6 .997a2.35 2.35 0 0 1 -1.697 -.731a2.55 2.55 0 0 1 -.703 -1.767c0 -.663 .253 -1.299 .703 -1.767a2.35 2.35 0 0 1 1.697 -.732h1.6" /><path d="M15 11v-3" /><path d="M8 8v8" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-adobe-indesign', {
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
_comp.displayName = 'ZcIconBrandAdobeIndesign'

export const ZcIconBrandAdobeIndesign = withInstall(_comp, 'ZcIconBrandAdobeIndesign')
