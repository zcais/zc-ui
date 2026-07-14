/**
 * ZcIconBrandHeadlessui
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-headlessui.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.744 4.325l7.82 -1.267a4.456 4.456 0 0 1 5.111 3.686l1.267 7.82a4.456 4.456 0 0 1 -3.686 5.111l-7.82 1.267a4.456 4.456 0 0 1 -5.111 -3.686l-1.267 -7.82a4.456 4.456 0 0 1 3.686 -5.111" /><path d="M7.252 7.704l7.897 -1.28a1 1 0 0 1 1.147 .828l.36 2.223l-9.562 3.51l-.67 -4.134a1 1 0 0 1 .828 -1.147" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-headlessui', {
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
_comp.displayName = 'ZcIconBrandHeadlessui'

export const ZcIconBrandHeadlessui = withInstall(_comp, 'ZcIconBrandHeadlessui')
