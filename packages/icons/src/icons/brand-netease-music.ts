/**
 * ZcIconBrandNeteaseMusic
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-netease-music.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 4c-2.93 1.346 -5 5.046 -5 8.492c0 4.508 4 7.508 8 7.508c4 0 8 -3 8 -7c0 -3.513 -3.5 -5.513 -6 -5.513c-2.5 0 -5 1.513 -5 4.513c0 2 1.5 3 3 3c1.5 0 3 -1 3 -3c0 -3.513 -2 -4.508 -2 -6.515c0 -3.504 3.5 -2.603 4 -1.502" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-netease-music', {
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
_comp.displayName = 'ZcIconBrandNeteaseMusic'

export const ZcIconBrandNeteaseMusic = withInstall(_comp, 'ZcIconBrandNeteaseMusic')
