/**
 * ZcIconBrandCakephp
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-cakephp.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 11l8 2c1.361 -.545 2 -1.248 2 -2v-3.8c0 -1.765 -4.479 -3.2 -10.002 -3.2c-5.522 0 -9.998 1.435 -9.998 3.2v2.8c0 1.766 4.478 4 10 4v-3" /><path d="M12 14v3l8 2c1.362 -.547 2 -1.246 2 -2v-3c0 .754 -.638 1.453 -2 2l-8 -2" /><path d="M2 17c0 1.766 4.476 3 9.998 3l.002 -3c-5.522 0 -10 -1.734 -10 -3.5v3.5" /><path d="M2 10v4" /><path d="M22 10v4" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-cakephp', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandCakephp'

export const ZcIconBrandCakephp = withInstall(_comp, 'ZcIconBrandCakephp')
