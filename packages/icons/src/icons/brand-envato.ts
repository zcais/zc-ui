/**
 * ZcIconBrandEnvato
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-envato.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.711 17.875c-.534 -1.339 -1.35 -4.178 .129 -6.47c1.415 -2.193 3.769 -3.608 5.099 -4.278l-5.229 10.748l.001 0" /><path d="M19.715 12.508c-.54 3.409 -2.094 6.156 -4.155 7.348c-4.069 2.353 -8.144 .45 -9.297 -.188c.877 -1.436 4.433 -7.22 6.882 -10.591c2.714 -3.737 5.864 -5.978 6.565 -6.077c0 .201 .03 .55 .071 1.03c.144 1.709 .443 5.264 -.066 8.478" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-envato', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandEnvato'

export const ZcIconBrandEnvato = withInstall(_comp, 'ZcIconBrandEnvato')
