/**
 * ZcIconBinaryTree
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/binary-tree.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M16 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M16 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M11 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M21 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M5.058 18.306l2.88 -4.606" /><path d="M10.061 10.303l2.877 -4.604" /><path d="M10.065 13.705l2.876 4.6" /><path d="M15.063 5.7l2.881 4.61" />'

// Register this icon's SVG data into the global icon pool
registerIcon('binary-tree', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBinaryTree'

export const ZcIconBinaryTree = withInstall(_comp, 'ZcIconBinaryTree')
