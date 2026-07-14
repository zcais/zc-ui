/**
 * ZcIconBrandFlipboard
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-flipboard.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3.973 3h16.054c.537 0 .973 .436 .973 .973v4.052a.973 .973 0 0 1 -.973 .973h-5.025v4.831c0 .648 -.525 1.173 -1.173 1.173h-4.829v5.025a.973 .973 0 0 1 -.974 .973h-4.053a.973 .973 0 0 1 -.973 -.973v-16.054c0 -.537 .436 -.973 .973 -.973" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-flipboard', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandFlipboard'

export const ZcIconBrandFlipboard = withInstall(_comp, 'ZcIconBrandFlipboard')
