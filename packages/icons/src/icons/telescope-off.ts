/**
 * ZcIconTelescopeOff
 *
 * Auto-generated from @tabler/icons — do not edit manually.
 * Source: icons/outline/telescope-off.svg
 */

import { h, type FunctionalComponent } from 'vue'
import { withInstall } from '@zc-ui/utils'
import type { ZcIconProps } from '../types'
import { registerIcon } from '../icon-registry'

const _body =
  '<path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 21l6 -5l6 5" /><path d="M12 13v8" /><path d="M8.238 8.264l-4.183 2.51c-1.02 .614 -1.357 1.898 -.76 2.906l.165 .28c.52 .88 1.624 1.266 2.605 .91l6.457 -2.34m2.907 -1.055l4.878 -1.77a1.023 1.023 0 0 0 .565 -1.455l-2.62 -4.705a1.087 1.087 0 0 0 -1.447 -.42l-.056 .032l-6.016 3.61" /><path d="M14 5l3 5.5" /><path d="M3 3l18 18" />'

// Register this icon's SVG data into the global icon pool
registerIcon('telescope-off', { path: _body, viewBox: '0 0 24 24', strokeWidth: 2, fill: 'none' })

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
_comp.displayName = 'ZcIconTelescopeOff'

export const ZcIconTelescopeOff = withInstall(_comp, 'ZcIconTelescopeOff')
