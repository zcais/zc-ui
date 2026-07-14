/**
 * ZcIconSpider
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/spider.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4v2l5 5" /><path d="M2.5 9.5l1.5 1.5h6" /><path d="M4 19v-2l6 -6" /><path d="M19 4v2l-5 5" /><path d="M21.5 9.5l-1.5 1.5h-6" /><path d="M20 19v-2l-6 -6" /><path d="M8 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M10 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('spider', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconSpider'

export const ZcIconSpider = withInstall(_comp, 'ZcIconSpider')
