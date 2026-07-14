/**
 * ZcIconUsb
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/usb.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 17v-11.5" /><path d="M7 10v3l5 3" /><path d="M12 14.5l5 -2v-2.5" /><path d="M16 10h2v-2h-2l0 2" /><path d="M6 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M10 5.5h4l-2 -2.5l-2 2.5" />'

// Register this icon's SVG data into the global icon pool
registerIcon('usb', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconUsb'

export const ZcIconUsb = withInstall(_comp, 'ZcIconUsb')
