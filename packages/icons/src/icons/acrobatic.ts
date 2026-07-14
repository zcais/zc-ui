/**
 * ZcIconAcrobatic
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/acrobatic.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13.207 3l-6.735 2.462a1 1 0 0 0 -.364 1.646l1.892 1.892" /><path d="M10.5 8.25l1.5 -.25h3.174a2 2 0 0 1 1.411 .583l1.422 1.417" /><path d="M8 9c0 4.5 1.781 5.14 3 5.5" /><path d="M13.007 21h-1a1 1 0 0 1 -1 -1l-.007 -5.5" /><path d="M12.007 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />'

// Register this icon's SVG data into the global icon pool
registerIcon('acrobatic', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconAcrobatic'

export const ZcIconAcrobatic = withInstall(_comp, 'ZcIconAcrobatic')
