/**
 * ZcIconVariableOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/variable-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.675 4.68c-2.17 4.776 -2.062 9.592 .325 15.32" /><path d="M19 4c1.959 3.917 2.383 7.834 1.272 12.232m-.983 3.051c-.093 .238 -.189 .477 -.289 .717" /><path d="M11.696 11.696c.095 .257 .2 .533 .32 .831c.984 2.473 .984 3.473 1.984 3.473h1" /><path d="M8 16c1.5 0 3 -2 4 -3.5m2.022 -2.514c.629 -.582 1.304 -.986 1.978 -.986" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('variable-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconVariableOff'

export const ZcIconVariableOff = withInstall(_comp, 'ZcIconVariableOff')
