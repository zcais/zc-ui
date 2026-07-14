/**
 * ZcIconBrandDeezer
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-deezer.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 16.5h2v.5h-2l0 -.5" /><path d="M8 16.5h2.5v.5h-2.5l0 -.5" /><path d="M16 17h-2.5v-.5h2.5l0 .5" /><path d="M21.5 17h-2.5v-.5h2.5l0 .5" /><path d="M21.5 13h-2.5v.5h2.5l0 -.5" /><path d="M21.5 9.5h-2.5v.5h2.5l0 -.5" /><path d="M21.5 6h-2.5v.5h2.5l0 -.5" /><path d="M16 13h-2.5v.5h2.5l0 -.5" /><path d="M8 13.5h2.5v-.5h-2.5l0 .5" /><path d="M8 9.5h2.5v.5h-2.5l0 -.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-deezer', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandDeezer'

export const ZcIconBrandDeezer = withInstall(_comp, 'ZcIconBrandDeezer')
