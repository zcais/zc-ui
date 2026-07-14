/**
 * ZcIconDiscGolf
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/disc-golf.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5h14" /><path d="M6 5c.32 6.744 2.74 9.246 6 10" /><path d="M18 5c-.32 6.744 -2.74 9.246 -6 10" /><path d="M10 5c0 4.915 .552 7.082 2 10" /><path d="M14 5c0 4.915 -.552 7.082 -2 10" /><path d="M12 15v6" /><path d="M12 3v2" /><path d="M7 16c.64 .64 1.509 1 2.414 1h5.172c.905 0 1.774 -.36 2.414 -1" /><path d="M11 21h2" />'

// Register this icon's SVG data into the global icon pool
registerIcon('disc-golf', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconDiscGolf'

export const ZcIconDiscGolf = withInstall(_comp, 'ZcIconDiscGolf')
