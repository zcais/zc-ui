/**
 * ZcIconRotate3d
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/rotate-3d.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a7 7 0 0 1 7 7v4l-3 -3" /><path d="M22 11l-3 3" /><path d="M8 15.5l-5 -3l5 -3l5 3v5.5l-5 3l0 -5.5" /><path d="M3 12.5v5.5l5 3" /><path d="M8 15.545l5 -3.03" />'

// Register this icon's SVG data into the global icon pool
registerIcon('rotate-3d', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconRotate3d'

export const ZcIconRotate3d = withInstall(_comp, 'ZcIconRotate3d')
