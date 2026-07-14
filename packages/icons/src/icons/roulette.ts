/**
 * ZcIconRoulette
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/roulette.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.586 10.586l-1.586 -1.586" /><path d="M13.414 10.586l1.586 -1.586" /><path d="M13.414 13.414l1.586 1.586" /><path d="M10.586 13.414l-1.586 1.586" /><path d="M14 12a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" /><path d="M16.5 4.206l-.5 .866" /><path d="M7.5 19.794l.5 -.866" /><path d="M19.794 7.5l-.866 .5" /><path d="M4.206 16.5l.866 -.5" /><path d="M7.5 4.206l.5 .866" /><path d="M16.5 19.794l-.5 -.866" /><path d="M4.206 7.5l.866 .5" /><path d="M19.794 16.5l-.866 -.5" /><path d="M12 3v1" /><path d="M12 21v-1" /><path d="M21 12h-1" /><path d="M3 12h1" /><path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('roulette', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconRoulette'

export const ZcIconRoulette = withInstall(_comp, 'ZcIconRoulette')
