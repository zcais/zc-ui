/**
 * ZcIconDiscOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/disc-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20.044 16.04a9 9 0 0 0 -12.082 -12.085m-2.333 1.688a9 9 0 0 0 6.371 15.357c2.491 0 4.73 -1 6.36 -2.631" /><path d="M11.298 11.288a1 1 0 1 0 1.402 1.427" /><path d="M7 12c0 -1.38 .559 -2.629 1.462 -3.534m2.607 -1.38c.302 -.056 .613 -.086 .931 -.086" /><path d="M12 17a4.985 4.985 0 0 0 3.551 -1.48m1.362 -2.587c.057 -.302 .087 -.614 .087 -.933" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('disc-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconDiscOff'

export const ZcIconDiscOff = withInstall(_comp, 'ZcIconDiscOff')
