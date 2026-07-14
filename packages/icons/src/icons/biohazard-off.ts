/**
 * ZcIconBiohazardOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/biohazard-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.586 10.586a2 2 0 1 0 2.836 2.82" /><path d="M11.939 14c0 .173 .048 .351 .056 .533v.217a4.75 4.75 0 0 1 -4.533 4.745h-.217" /><path d="M2.495 14.745a4.75 4.75 0 0 1 7.737 -3.693" /><path d="M16.745 19.495a4.75 4.75 0 0 1 -4.69 -5.503h-.06" /><path d="M14.533 10.538a4.75 4.75 0 0 1 6.957 3.987v.217" /><path d="M10.295 10.929a4.75 4.75 0 0 1 -2.988 -3.64m.66 -3.324a4.75 4.75 0 0 1 .5 -.66l.164 -.172" /><path d="M15.349 3.133a4.75 4.75 0 0 1 -.836 7.385" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('biohazard-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBiohazardOff'

export const ZcIconBiohazardOff = withInstall(_comp, 'ZcIconBiohazardOff')
