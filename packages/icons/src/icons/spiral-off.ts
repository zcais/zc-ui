/**
 * ZcIconSpiralOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/spiral-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12.057a1.9 1.9 0 0 0 .614 .743c.682 .459 1.509 .374 2.164 -.02m1.103 -2.92a3.298 3.298 0 0 0 -1.749 -2.059a3.6 3.6 0 0 0 -.507 -.195m-3.385 .634a4.154 4.154 0 0 0 -1.347 1.646c-1.095 2.432 .29 5.248 2.71 6.246c1.955 .806 4.097 .35 5.65 -.884m1.745 -2.268l.043 -.103c1.36 -3.343 -.557 -7.134 -3.896 -8.41c-1.593 -.61 -3.27 -.599 -4.79 -.113m-2.579 1.408a7.574 7.574 0 0 0 -2.268 3.128c-1.63 4.253 .823 9.024 5.082 10.576c3.211 1.17 6.676 .342 9.124 -1.738m1.869 -2.149a9.354 9.354 0 0 0 1.417 -4.516" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('spiral-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconSpiralOff'

export const ZcIconSpiralOff = withInstall(_comp, 'ZcIconSpiralOff')
