/**
 * ZcIconBrandKickstarter
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-kickstarter.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 9l2.975 -4.65c.615 -.9 1.405 -1.35 2.377 -1.35c.79 0 1.474 .286 2.054 .858c.576 .574 .866 1.256 .866 2.054c0 .588 -.153 1.109 -.46 1.559l-2.812 4.029l3.465 4.912c.356 .46 .535 1 .535 1.613a2.92 2.92 0 0 1 -.843 2.098c-.561 .584 -1.242 .877 -2.04 .877c-.876 0 -1.545 -.29 -2 -.87l-4.112 -5.697v3.067c0 .876 -.313 1.69 -.611 2.175c-.543 .883 -1.35 1.325 -2.389 1.325c-.944 0 -1.753 -.327 -2.271 -.974c-.486 -.6 -.729 -1.392 -.729 -2.38v-11.371c0 -.934 .247 -1.706 .74 -2.313c.512 -.641 1.347 -.962 2.26 -.962c.868 0 1.821 .321 2.4 .962c.323 .356 .515 .714 .6 1.08c.052 .224 0 .643 0 1.26v2.698l-.005 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-kickstarter', {
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
_comp.displayName = 'ZcIconBrandKickstarter'

export const ZcIconBrandKickstarter = withInstall(_comp, 'ZcIconBrandKickstarter')
