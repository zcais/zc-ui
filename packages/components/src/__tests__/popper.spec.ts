import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { computePosition } from '../popper/computePosition'
import type { Rect, PopperPlacement } from '../popper/types'
import { usePopper } from '../popper/usePopper'
import Popper from '../popper/popper.vue'

describe('ZcPopper computePosition (pure engine)', () => {
  const reference: Rect = { x: 500, y: 400, width: 100, height: 40 }
  const popperSize = { width: 200, height: 80 }
  const viewport = { width: 1024, height: 768 }

  it.each<[PopperPlacement, number, number]>([
    ['top', 450, 312],
    ['top-start', 500, 312],
    ['top-end', 400, 312],
    ['bottom', 450, 448],
    ['bottom-start', 500, 448],
    ['bottom-end', 400, 448],
    ['left', 292, 380],
    ['left-start', 292, 400],
    ['left-end', 292, 360],
    ['right', 608, 380],
    ['right-start', 608, 400],
    ['right-end', 608, 360],
  ])('places %s at x/y with offset 8', (placement, x, y) => {
    const result = computePosition({
      reference,
      popperSize,
      placement,
      offset: 8,
      viewport,
    })
    expect(Math.round(result.x)).toBe(x)
    expect(Math.round(result.y)).toBe(y)
    expect(result.placement).toBe(placement)
  })

  it('respects custom offset', () => {
    const result = computePosition({
      reference,
      popperSize,
      placement: 'bottom',
      offset: 20,
      viewport,
    })
    expect(result.y).toBe(460)
  })

  it('flips to the opposite side when there is not enough space', () => {
    // Only 50px above the top edge, popper needs 80 + 8
    const result = computePosition({
      reference: { x: 500, y: 50, width: 100, height: 40 },
      popperSize,
      placement: 'top',
      offset: 8,
      viewport,
    })
    expect(result.placement).toBe('bottom')
    expect(result.y).toBe(98)
  })

  it('flips left when not enough horizontal space', () => {
    const result = computePosition({
      reference: { x: 150, y: 400, width: 100, height: 40 },
      popperSize,
      placement: 'left',
      offset: 8,
      viewport,
    })
    expect(result.placement).toBe('right')
    expect(result.x).toBe(258)
  })

  it('does not flip when disabled (main-axis overflow is clamped instead)', () => {
    const result = computePosition({
      reference: { x: 500, y: 50, width: 100, height: 40 },
      popperSize,
      placement: 'top',
      offset: 8,
      viewport,
      flip: false,
    })
    expect(result.placement).toBe('top')
    // y = 50 - 96 - 8 = -54 overflows the top; preventOverflow clamps it to
    // boundaryPadding (8) so the popper stays visible instead of being cut off.
    expect(result.y).toBe(8)
  })

  it('keeps original placement when neither side fits (still flips once)', () => {
    // Tiny viewport: no side fits
    const result = computePosition({
      reference: { x: 10, y: 10, width: 20, height: 20 },
      popperSize,
      placement: 'bottom',
      offset: 8,
      viewport: { width: 100, height: 100 },
    })
    // Should not flip when flipped side is not better
    expect(result.placement).toBe('bottom')
  })

  it('preventOverflow clamps popper inside the viewport padding', () => {
    const result = computePosition({
      reference: { x: 950, y: 400, width: 100, height: 40 },
      popperSize,
      placement: 'bottom',
      offset: 8,
      viewport,
    })
    // Aligned x would be 900 → 900 + 200 > 1024 - 8 → clamped to 816
    expect(result.x).toBe(816)
    expect(result.x + popperSize.width).toBeLessThanOrEqual(viewport.width - 8)
  })

  it('preventOverflow clamps on the left edge', () => {
    const result = computePosition({
      reference: { x: -40, y: 400, width: 100, height: 40 },
      popperSize,
      placement: 'bottom-start',
      offset: 8,
      viewport,
    })
    expect(result.x).toBe(8)
  })

  it('preventOverflow can be disabled', () => {
    const result = computePosition({
      reference: { x: 950, y: 400, width: 100, height: 40 },
      popperSize,
      placement: 'bottom',
      offset: 8,
      viewport,
      preventOverflow: false,
    })
    expect(result.x).toBe(900)
  })

  it('computes arrow position relative to popper (bottom)', () => {
    const result = computePosition({
      reference,
      popperSize,
      placement: 'bottom',
      offset: 8,
      viewport,
      arrowSize: 8,
    })
    expect(result.arrow).toEqual({ x: 100, y: -8 })
  })

  it('computes arrow position for right placement', () => {
    const result = computePosition({
      reference,
      popperSize,
      placement: 'right',
      offset: 8,
      viewport,
      arrowSize: 8,
    })
    expect(result.arrow).toEqual({ x: -8, y: 40 })
  })

  it('supports a virtual (point) reference for context menus', () => {
    const result = computePosition({
      reference: { x: 200, y: 300, width: 0, height: 0 },
      popperSize,
      placement: 'bottom-start',
      offset: 0,
      viewport,
    })
    expect(result.x).toBe(200)
    expect(result.y).toBe(300)
  })
})

describe('ZcPopper usePopper composable', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('computes styles for the popper element from a real reference', async () => {
    const reference = document.createElement('button')
    reference.style.width = '100px'
    reference.style.height = '40px'
    document.body.appendChild(reference)

    const popperEl = document.createElement('div')

    const { styles, actualPlacement } = usePopper({
      reference: () => reference,
      popper: () => popperEl,
      placement: ref<PopperPlacement>('bottom'),
      offset: ref(8),
    })

    expect(actualPlacement.value).toBe('bottom')
    expect(styles.value.position).toBe('fixed')
    expect(styles.value.top).not.toBe('')
    expect(styles.value.left).not.toBe('')
  })

  it('updates position on window resize', async () => {
    const reference = document.createElement('button')
    document.body.appendChild(reference)
    const popperEl = document.createElement('div')

    const { styles } = usePopper({
      reference: () => reference,
      popper: () => popperEl,
      placement: ref<PopperPlacement>('bottom'),
      offset: ref(8),
    })

    const before = styles.value.top
    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 200,
      top: 200,
      bottom: 240,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)

    window.dispatchEvent(new Event('resize'))
    await nextTick()
    // rAF-based scheduler — flush with a tick
    await new Promise((r) => setTimeout(r, 20))

    expect(styles.value.top).not.toBe(before)
    expect(styles.value.top).toBe('248px')
  })

  it('updates position when an ancestor scroll container scrolls', async () => {
    const scroller = document.createElement('div')
    const reference = document.createElement('button')
    scroller.appendChild(reference)
    document.body.appendChild(scroller)
    const popperEl = document.createElement('div')

    const { styles } = usePopper({
      reference: () => reference,
      popper: () => popperEl,
      placement: ref<PopperPlacement>('bottom'),
      offset: ref(8),
    })

    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 300,
      top: 300,
      bottom: 340,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)

    scroller.dispatchEvent(new Event('scroll'))
    await new Promise((r) => setTimeout(r, 20))

    expect(styles.value.top).toBe('348px')
  })

  it('reports flipped placement via actualPlacement', () => {
    const reference = document.createElement('button')
    document.body.appendChild(reference)
    const popperEl = document.createElement('div')

    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 20,
      top: 20,
      bottom: 60,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)
    // Popper element with real size via mock
    Object.defineProperty(popperEl, 'offsetWidth', { value: 200 })
    Object.defineProperty(popperEl, 'offsetHeight', { value: 80 })

    const { actualPlacement } = usePopper({
      reference: () => reference,
      popper: () => popperEl,
      placement: ref<PopperPlacement>('top'),
      offset: ref(8),
    })

    // y=20, only 20px above → flips to bottom
    expect(actualPlacement.value).toBe('bottom')
  })

  it('supports virtual coordinates as reference', () => {
    const popperEl = document.createElement('div')
    const { styles, actualPlacement } = usePopper({
      virtualReference: ref({ x: 200, y: 300 }),
      popper: () => popperEl,
      placement: ref<PopperPlacement>('bottom-start'),
      offset: ref(0),
    })

    expect(styles.value.left).toBe('200px')
    expect(styles.value.top).toBe('300px')
    expect(actualPlacement.value).toBe('bottom-start')
  })
})

describe('ZcPopper component', () => {
  const mountPopper = async (props: Record<string, unknown> = {}) => {
    const reference = document.createElement('button')
    document.body.appendChild(reference)

    const wrapper = mount(Popper, {
      props: {
        reference,
        visible: true,
        placement: 'bottom',
        ...props,
      },
      slots: { default: '<div class="content">hi</div>' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    return wrapper
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders content inside zc-popper wrapper', async () => {
    const wrapper = await mountPopper()
    const el = document.querySelector('.zc-popper') as HTMLElement
    expect(el).not.toBeNull()
    expect(el.textContent).toContain('hi')
    expect(el.style.position).toBe('fixed')
    wrapper.unmount()
  })

  it('renders arrow when showArrow is true', async () => {
    const wrapper = await mountPopper({ showArrow: true })
    expect(document.querySelector('.zc-popper__arrow')).not.toBeNull()
    wrapper.unmount()
  })

  it('does not render arrow by default', async () => {
    const wrapper = await mountPopper()
    expect(document.querySelector('.zc-popper__arrow')).toBeNull()
    wrapper.unmount()
  })

  it('applies data-placement of the actual (possibly flipped) side', async () => {
    const reference = document.createElement('button')
    document.body.appendChild(reference)
    vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 20,
      top: 20,
      bottom: 60,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)
    const owSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200)
    const ohSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80)

    const wrapper = mount(Popper, {
      props: { reference, visible: true, placement: 'top' },
      slots: { default: 'x' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const el = document.querySelector('.zc-popper') as HTMLElement
    // 20px above → must flip to bottom
    expect(el.dataset.placement).toBe('bottom')
    wrapper.unmount()
    owSpy.mockRestore()
    ohSpy.mockRestore()
  })

  it('emits placement-change when the actual placement changes', async () => {
    const reference = document.createElement('button')
    document.body.appendChild(reference)
    const rectSpy = vi.spyOn(reference, 'getBoundingClientRect')
    rectSpy.mockReturnValue({
      x: 100,
      y: 400,
      top: 400,
      bottom: 440,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)
    const owSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200)
    const ohSpy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80)

    const wrapper = mount(Popper, {
      props: { reference, visible: true, placement: 'top' },
      slots: { default: 'x' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    // No flip yet (plenty of space above)
    expect(wrapper.emitted('placement-change')?.at(-1)).toEqual(['top'])

    // Move reference near the top edge → flip
    rectSpy.mockReturnValue({
      x: 100,
      y: 20,
      top: 20,
      bottom: 60,
      left: 100,
      right: 200,
      width: 100,
      height: 40,
      toJSON: () => ({}),
    } as DOMRect)
    window.dispatchEvent(new Event('resize'))
    await new Promise((r) => setTimeout(r, 20))
    await nextTick()

    expect(wrapper.emitted('placement-change')?.at(-1)).toEqual(['bottom'])
    wrapper.unmount()
    owSpy.mockRestore()
    ohSpy.mockRestore()
  })
})
