/**
 * ZcIconBrandGuardian
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-guardian.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 13h6" /><path d="M4 12c0 -9.296 9.5 -9 9.5 -9c-2.808 0 -4.5 4.373 -4.5 9s1.763 8.976 4.572 8.976c0 .023 -9.572 1.092 -9.572 -8.976" /><path d="M14.5 3c1.416 0 3.853 1.16 4.5 2v3.5" /><path d="M15 13v8s2.77 -.37 4 -2v-6" /><path d="M13.5 21h1.5" /><path d="M13.5 3h1" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-guardian', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandGuardian'

export const ZcIconBrandGuardian = withInstall(_comp, 'ZcIconBrandGuardian')
