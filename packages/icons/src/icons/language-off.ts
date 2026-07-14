/**
 * ZcIconLanguageOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/language-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 20l2.463 -5.541m1.228 -2.764l.309 -.695l.8 1.8" /><path d="M18 18h-5.1" /><path d="M8.747 8.748c-.66 2.834 -2.536 4.252 -4.747 4.252" /><path d="M4 6.371l2.371 0" /><path d="M5 9c0 2.144 2.252 3.908 6 4" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('language-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconLanguageOff'

export const ZcIconLanguageOff = withInstall(_comp, 'ZcIconLanguageOff')
