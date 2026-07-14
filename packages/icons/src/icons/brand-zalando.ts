/**
 * ZcIconBrandZalando
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-zalando.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7.531 21c-.65 0 -1 -.15 -1.196 -.27c-.266 -.157 -.753 -.563 -1.197 -1.747a20.583 20.583 0 0 1 -1.137 -6.983c.015 -2.745 .436 -5.07 1.137 -6.975c.444 -1.2 .93 -1.605 1.197 -1.763c.192 -.103 .545 -.262 1.195 -.262c.244 0 .532 .022 .871 .075a19.093 19.093 0 0 1 6.425 2.475h.007a19.572 19.572 0 0 1 5.287 4.508c.783 .99 .879 1.627 .879 1.942c0 .315 -.096 .953 -.879 1.943a19.571 19.571 0 0 1 -5.287 4.5h-.007a19.041 19.041 0 0 1 -6.425 2.474a5.01 5.01 0 0 1 -.871 .083" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-zalando', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandZalando'

export const ZcIconBrandZalando = withInstall(_comp, 'ZcIconBrandZalando')
