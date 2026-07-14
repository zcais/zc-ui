/**
 * ZcIconBrandItch
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-itch.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 7v1c0 1.087 1.078 2 2 2c1.107 0 2 -.91 2 -2c0 1.09 .893 2 2 2s2 -.91 2 -2c0 1.09 .893 2 2 2s2 -.91 2 -2c0 1.09 .893 2 2 2s2 -.91 2 -2c0 1.09 .893 2 2 2c.922 0 2 -.913 2 -2v-1c-.009 -.275 -.538 -.964 -1.588 -2.068a3 3 0 0 0 -2.174 -.932h-12.476a3 3 0 0 0 -2.174 .932c-1.05 1.104 -1.58 1.793 -1.588 2.068" /><path d="M4 10c-.117 6.28 .154 9.765 .814 10.456c1.534 .367 4.355 .535 7.186 .536c2.83 -.001 5.652 -.169 7.186 -.536c.99 -1.037 .898 -9.559 .814 -10.456" /><path d="M10 16l2 -2l2 2" /><path d="M12 14v4" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-itch', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandItch'

export const ZcIconBrandItch = withInstall(_comp, 'ZcIconBrandItch')
