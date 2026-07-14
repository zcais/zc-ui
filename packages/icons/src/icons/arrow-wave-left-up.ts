/**
 * ZcIconArrowWaveLeftUp
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/arrow-wave-left-up.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 10h-4v4" /><path d="M21 12c-.887 -1.285 -2.48 -2.033 -4 -2c-1.52 -.033 -3.113 .715 -4 2c-.887 1.284 -2.48 2.033 -4 2c-1.52 .033 -3 -1 -4 -2l-2 -2" />'

// Register this icon's SVG data into the global icon pool
registerIcon('arrow-wave-left-up', {
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
_comp.displayName = 'ZcIconArrowWaveLeftUp'

export const ZcIconArrowWaveLeftUp = withInstall(_comp, 'ZcIconArrowWaveLeftUp')
