/**
 * ZcIconZeppelin
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/zeppelin.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13.5 4c4.694 0 8.5 2.686 8.5 6s-3.806 6 -8.5 6c-2.13 0 -4.584 -.926 -7.364 -2.777l-2.136 1.777v-3.33a46.07 46.07 0 0 1 -2 -1.67a46.07 46.07 0 0 1 2 -1.67v-3.33l2.135 1.778c2.78 -1.852 5.235 -2.778 7.365 -2.778" /><path d="M10 15.5v4.5h6v-4" />'

// Register this icon's SVG data into the global icon pool
registerIcon('zeppelin', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconZeppelin'

export const ZcIconZeppelin = withInstall(_comp, 'ZcIconZeppelin')
