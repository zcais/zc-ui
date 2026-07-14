/**
 * ZcIconBrandCodesandbox
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-codesandbox.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 7.5v9l-4 2.25l-4 2.25l-4 -2.25l-4 -2.25v-9l4 -2.25l4 -2.25l4 2.25l4 2.25" /><path d="M12 12l4 -2.25l4 -2.25" /><path d="M12 12l0 9" /><path d="M12 12l-4 -2.25l-4 -2.25" /><path d="M20 12l-4 2v4.75" /><path d="M4 12l4 2l0 4.75" /><path d="M8 5.25l4 2.25l4 -2.25" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-codesandbox', {
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
_comp.displayName = 'ZcIconBrandCodesandbox'

export const ZcIconBrandCodesandbox = withInstall(_comp, 'ZcIconBrandCodesandbox')
