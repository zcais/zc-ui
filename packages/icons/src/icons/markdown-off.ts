/**
 * ZcIconMarkdownOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/markdown-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h10a2 2 0 0 1 2 2v10" /><path d="M19 19h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 1.85 -2" /><path d="M7 15v-6l2 2l1 -1m1 1v4" /><path d="M17.5 13.5l.5 -.5m-2 -1v-3" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('markdown-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconMarkdownOff'

export const ZcIconMarkdownOff = withInstall(_comp, 'ZcIconMarkdownOff')
