/**
 * ZcIconBrandMeetup
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/brand-meetup.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5.455 10.82c.935 -2.163 3.045 -3.82 5.545 -3.82c2.104 0 2.844 1.915 2 4l-2 6" /><path d="M6.981 7l-3.981 9.914" /><path d="M13 11c.937 -2.16 3.071 -3.802 5.42 -3.972c2.104 0 3.128 1.706 2.284 3.792l-2.454 6.094c-.853 1.676 .75 2.586 2.75 2.086" />'

// Register this icon's SVG data into the global icon pool
registerIcon('brand-meetup', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconBrandMeetup'

export const ZcIconBrandMeetup = withInstall(_comp, 'ZcIconBrandMeetup')
