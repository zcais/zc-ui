/**
 * ZcIconBrandOauth
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-oauth.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" /><path d="M12.556 6c.65 0 1.235 .373 1.508 .947l2.839 7.848a1.646 1.646 0 0 1 -1.01 2.108a1.673 1.673 0 0 1 -2.068 -.851l-.46 -1.052h-2.73l-.398 .905a1.67 1.67 0 0 1 -1.977 1.045l-.153 -.047a1.647 1.647 0 0 1 -1.056 -1.956l2.824 -7.852a1.664 1.664 0 0 1 1.409 -1.087l1.272 -.008" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-oauth', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandOauth'

export const ZcIconBrandOauth = withInstall(_comp, 'ZcIconBrandOauth')
