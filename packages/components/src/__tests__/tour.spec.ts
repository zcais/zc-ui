import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import Tour from '../tour/tour.vue'
import type { TourStep } from '../tour/types'

// Helper to create a target element in the DOM
function createTarget(id: string, text = 'Target'): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  el.textContent = text
  el.getBoundingClientRect = () => ({
    left: 100,
    top: 100,
    right: 200,
    bottom: 140,
    width: 100,
    height: 40,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  })
  document.body.appendChild(el)
  return el
}

describe('ZcTour', () => {
  beforeEach(() => {
    // jsdom default innerWidth / innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  // ── Rendering ─────────────────────────────────────────────
  it('renders nothing when closed by default', () => {
    mount(Tour)
    expect(document.querySelector('.zc-tour__overlay')).toBeNull()
  })

  it('renders overlay when open via v-model', async () => {
    const wrapper = mount(Tour, {
      props: { modelValue: true, steps: [{ title: 'T', description: 'D' }] },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__overlay')).not.toBeNull()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('T')
    expect(document.querySelector('.zc-tour__body')?.textContent).toContain('D')
    wrapper.unmount()
  })

  it('renders overlay when open via open prop', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, steps: [{ title: 'T2', description: 'D2' }] },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__overlay')).not.toBeNull()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('T2')
    wrapper.unmount()
  })

  // ── v-model update ────────────────────────────────────────
  it('emits update:modelValue(false) on close', async () => {
    const wrapper = mount(Tour, {
      props: { modelValue: true, steps: [{ title: 'T', description: 'D' }] },
    })
    await nextTick()
    wrapper.vm.close()
    await nextTick()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBe(true)
    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits update:open(false) on close', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, steps: [{ title: 'T', description: 'D' }] },
    })
    await nextTick()
    wrapper.vm.close()
    await nextTick()
    expect(
      wrapper.emitted('update:open')?.some((v) => v[0] === false),
    ).toBe(true)
    wrapper.unmount()
  })

  // ── Steps content ─────────────────────────────────────────
  it('renders correct step title and description', async () => {
    const steps: TourStep[] = [
      { title: 'Step 1', description: 'First step description' },
      { title: 'Step 2', description: 'Second step description' },
    ]
    const wrapper = mount(Tour, {
      props: { modelValue: true, steps },
    })
    await nextTick()
    await nextTick()
    const panel = document.querySelector('.zc-tour__panel')
    expect(panel?.textContent).toContain('Step 1')
    expect(panel?.textContent).toContain('First step description')
    wrapper.unmount()
  })

  // ── Navigation: next / prev ───────────────────────────────
  it('navigates to next step', async () => {
    const steps: TourStep[] = [
      { title: 'Step 1', description: 'D1' },
      { title: 'Step 2', description: 'D2' },
    ]
    const wrapper = mount(Tour, {
      props: { modelValue: true, steps },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('Step 1')

    wrapper.vm.next()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('Step 2')
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
    wrapper.unmount()
  })

  it('navigates to previous step', async () => {
    const steps: TourStep[] = [
      { title: 'Step 1', description: 'D1' },
      { title: 'Step 2', description: 'D2' },
    ]
    const wrapper = mount(Tour, {
      props: { modelValue: true, steps, current: 1 },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('Step 2')

    wrapper.vm.prev()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('Step 1')
    wrapper.unmount()
  })

  it('does not go prev on first step', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'Step 1', description: 'D1' },
          { title: 'Step 2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    wrapper.vm.prev()
    await nextTick()
    expect(wrapper.emitted('change')).toBeFalsy()
    wrapper.unmount()
  })

  it('emits finish and closes on last step next', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'Last', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    wrapper.vm.next()
    await nextTick()
    expect(wrapper.emitted('finish')).toBeTruthy()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBe(true)
    wrapper.unmount()
  })

  // ── Buttons ───────────────────────────────────────────────
  it('clicks next button to advance', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const nextBtn = document.querySelector('.zc-tour__btn--next') as HTMLElement
    expect(nextBtn).not.toBeNull()
    nextBtn.click()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('S2')
    wrapper.unmount()
  })

  it('clicks prev button to go back', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        current: 1,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const prevBtn = document.querySelector('.zc-tour__btn--prev') as HTMLElement
    expect(prevBtn).not.toBeNull()
    prevBtn.click()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('S1')
    wrapper.unmount()
  })

  it('clicks close button to skip', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'S1', description: 'D1' }],
      },
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.zc-tour__close-btn') as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    await nextTick()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBe(true)
    wrapper.unmount()
  })

  it('shows finish text on last step', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        finishButtonText: 'Done!',
        steps: [{ title: 'Last', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    const nextBtn = document.querySelector('.zc-tour__btn--next') as HTMLElement
    expect(nextBtn.textContent).toContain('Done!')
    wrapper.unmount()
  })

  it('hides prev button on first step', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__btn--prev')).toBeNull()
    wrapper.unmount()
  })

  it('hides skip button when showSkipButton is false', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        showSkipButton: false,
        steps: [{ title: 'S1', description: 'D1' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__close-btn')).toBeNull()
    wrapper.unmount()
  })

  // ── Indicator ─────────────────────────────────────────────
  it('shows default page-number indicator', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        indicator: 'default',
        steps: [
          { title: 'S1', description: 'D' },
          { title: 'S2', description: 'D' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const indicator = document.querySelector('.zc-tour__indicator-text')
    expect(indicator?.textContent).toContain('1')
    expect(indicator?.textContent).toContain('2')
    wrapper.unmount()
  })

  it('shows dot indicator', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        indicator: 'dot',
        steps: [
          { title: 'S1', description: 'D' },
          { title: 'S2', description: 'D' },
          { title: 'S3', description: 'D' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const dots = document.querySelectorAll('.zc-tour__indicator-dot')
    expect(dots.length).toBe(3)
    expect(dots[0].classList.contains('is-active')).toBe(true)
    expect(dots[1].classList.contains('is-active')).toBe(false)
    wrapper.unmount()
  })

  it('hides indicator when set to none', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        indicator: 'none',
        steps: [{ title: 'S1', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__indicator-text')).toBeNull()
    expect(document.querySelector('.zc-tour__indicator-dots')).toBeNull()
    wrapper.unmount()
  })

  // ── Placement ─────────────────────────────────────────────
  it('applies placement class to panel', async () => {
    const target = createTarget('target-placement')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        placement: 'top-start',
        steps: [{ title: 'T', description: 'D', target: '#target-placement' }],
      },
    })
    await nextTick()
    await nextTick()
    const panel = document.querySelector('.zc-tour__panel')
    expect(panel?.classList.contains('zc-tour-panel--top-start')).toBe(true)
    wrapper.unmount()
  })

  it('uses step-level placement override', async () => {
    const target = createTarget('target-step-placement')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        placement: 'bottom',
        steps: [
          {
            title: 'T',
            description: 'D',
            target: '#target-step-placement',
            placement: 'right',
          },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const panel = document.querySelector('.zc-tour__panel')
    expect(panel?.classList.contains('zc-tour-panel--right')).toBe(true)
    wrapper.unmount()
  })

  // ── Arrow ─────────────────────────────────────────────────
  it('shows arrow by default', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__arrow')).not.toBeNull()
    wrapper.unmount()
  })

  it('hides arrow when arrow is false', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        arrow: false,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__arrow')).toBeNull()
    wrapper.unmount()
  })

  it('applies arrow placement class', async () => {
    const target = createTarget('target-arrow')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        placement: 'left',
        steps: [{ title: 'T', description: 'D', target: '#target-arrow' }],
      },
    })
    await nextTick()
    await nextTick()
    const arrow = document.querySelector('.zc-tour__arrow')
    expect(arrow?.classList.contains('zc-tour-arrow--left')).toBe(true)
    wrapper.unmount()
  })

  // ── Mask ──────────────────────────────────────────────────
  it('shows SVG mask by default', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__mask')).not.toBeNull()
    expect(document.querySelector('.zc-tour__mask path')).not.toBeNull()
    wrapper.unmount()
  })

  it('hides mask when showMask is false', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        showMask: false,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__mask')).toBeNull()
    wrapper.unmount()
  })

  it('generates cutout path when target has rect', async () => {
    const target = createTarget('target-cutout')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D', target: '#target-cutout' }],
      },
    })
    await nextTick()
    await nextTick()
    const path = document.querySelector('.zc-tour__mask path') as SVGPathElement
    expect(path).not.toBeNull()
    // The path should contain multiple M commands (evenodd: viewport + target)
    const d = path.getAttribute('d') || ''
    expect(d.split('M').length).toBeGreaterThan(2)
    wrapper.unmount()
  })

  // ── keyboard ──────────────────────────────────────────────
  it('closes tour on Escape key', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        keyboard: true,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await nextTick()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBe(true)
    wrapper.unmount()
  })

  it('advances to next step on ArrowRight', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        keyboard: true,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
    wrapper.unmount()
  })

  it('goes back on ArrowLeft', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        current: 1,
        keyboard: true,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.emitted('change')?.[0]).toEqual([0])
    wrapper.unmount()
  })

  it('does not respond to keyboard when disabled', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        keyboard: false,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.emitted('change')).toBeFalsy()
    wrapper.unmount()
  })

  // ── Exposed methods ───────────────────────────────────────
  it('exposes open / close / next / prev / goTo methods', async () => {
    const wrapper = mount(Tour, {
      props: {
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2' },
          { title: 'S3', description: 'D3' },
        ],
      },
    })
    const vm = wrapper.vm as any

    // Open
    vm.open()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__overlay')).not.toBeNull()
    expect(wrapper.emitted('update:modelValue')?.some((v) => v[0] === true)).toBe(true)

    // goTo
    vm.goTo(2)
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('S3')

    // prev
    vm.prev()
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__title')?.textContent).toContain('S2')

    // close
    vm.close()
    await nextTick()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBe(true)
    wrapper.unmount()
  })

  // ── Slots ────────────────────────────────────────────────
  it('renders title slot', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'Default', description: 'D' }],
      },
      slots: {
        title: '<div class="custom-title">Custom Title</div>',
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.custom-title')).not.toBeNull()
    expect(document.querySelector('.custom-title')?.textContent).toContain(
      'Custom Title',
    )
    wrapper.unmount()
  })

  it('renders description slot', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'Default' }],
      },
      slots: {
        description: '<div class="custom-desc">Custom Description</div>',
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.custom-desc')).not.toBeNull()
    wrapper.unmount()
  })

  it('renders indicator slot', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'T', description: 'D' },
          { title: 'T2', description: 'D2' },
        ],
      },
      slots: {
        indicator: '<div class="custom-indicator">Custom Indicator</div>',
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.custom-indicator')).not.toBeNull()
    wrapper.unmount()
  })

  it('renders actions slot', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D' }],
      },
      slots: {
        actions: '<div class="custom-actions">Custom Actions</div>',
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.custom-actions')).not.toBeNull()
    wrapper.unmount()
  })

  // ── Target resolution ─────────────────────────────────────
  it('accepts HTMLElement as target', async () => {
    const target = createTarget('target-el')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D', target }],
      },
    })
    await nextTick()
    await nextTick()
    // Panel should be positioned
    const panel = document.querySelector('.zc-tour__panel') as HTMLElement
    expect(panel).not.toBeNull()
    wrapper.unmount()
  })

  it('accepts function returning HTMLElement as target', async () => {
    const target = createTarget('target-fn')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'T', description: 'D', target: () => target },
        ],
      },
    })
    await nextTick()
    await nextTick()
    const panel = document.querySelector('.zc-tour__panel') as HTMLElement
    expect(panel).not.toBeNull()
    wrapper.unmount()
  })

  // ── Close on overlay click ──────────────────────────────
  it('does not close when closeOnOverlayClick is false', async () => {
    const target = createTarget('target-no-close')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        closeOnOverlayClick: false,
        steps: [{ title: 'T', description: 'D', target: '#target-no-close' }],
      },
    })
    await nextTick()
    await nextTick()

    // Dispatch click event on the mask path
    const maskPath = document.querySelector('.zc-tour__mask path') as SVGPathElement
    expect(maskPath).not.toBeNull()
    maskPath.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    // Should still be open
    expect(document.querySelector('.zc-tour__overlay')).not.toBeNull()
    expect(
      wrapper.emitted('update:modelValue')?.some((v) => v[0] === false),
    ).toBeFalsy()
    wrapper.unmount()
  })

  // ── scrollIntoView ───────────────────────────────────────
  it('calls scrollIntoView when navigating to a step', async () => {
    const scrollSpy = vi.fn()
    const target = createTarget('target-scroll')
    target.scrollIntoView = scrollSpy

    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          { title: 'S1', description: 'D1' },
          { title: 'S2', description: 'D2', target: '#target-scroll' },
        ],
      },
    })
    await nextTick()
    await nextTick()

    // Navigate to step 2 which has a target
    wrapper.vm.next()
    await nextTick()
    await nextTick()

    expect(scrollSpy).toHaveBeenCalled()
    wrapper.unmount()
  })

  // ── Gap / Offset ─────────────────────────────────────────
  it('applies gap to mask cutout path', async () => {
    const target = createTarget('target-gap')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        gap: 20,
        steps: [{ title: 'T', description: 'D', target: '#target-gap' }],
      },
    })
    await nextTick()
    await nextTick()

    const path = document.querySelector('.zc-tour__mask path') as SVGPathElement
    const d = path.getAttribute('d') || ''
    // Target rect: left=100, top=100, right=200, bottom=140
    // With gap=20: cutout left=80, top=80, right=220, bottom=160
    expect(d).toContain('80') // left - gap
    expect(d).toContain('220') // right + gap
    wrapper.unmount()
  })

  it('uses step-level gap override', async () => {
    const target = createTarget('target-step-gap')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        gap: 6,
        steps: [
          {
            title: 'T',
            description: 'D',
            target: '#target-step-gap',
            gap: 30,
          },
        ],
      },
    })
    await nextTick()
    await nextTick()

    const path = document.querySelector('.zc-tour__mask path') as SVGPathElement
    const d = path.getAttribute('d') || ''
    // Target rect: left=100, top=100, right=200, bottom=140
    // With step gap=30: cutout left=70, right=230
    expect(d).toContain('70') // left - gap
    expect(d).toContain('230') // right + gap
    wrapper.unmount()
  })

  it('applies offset to popover panel position', async () => {
    const target = createTarget('target-offset')
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        placement: 'bottom',
        offset: 50,
        steps: [{ title: 'T', description: 'D', target: '#target-offset' }],
      },
    })
    await nextTick()
    await nextTick()

    const panel = document.querySelector('.zc-tour__panel') as HTMLElement
    // Target rect: bottom=140, gap=6 (default), offset=50
    // bottom placement top = 140 + 6 + 50 = 196
    expect(panel.style.top).toContain('196')
    wrapper.unmount()
  })

  // ── Payload in slot scope ───────────────────────────────
  it('passes payload to slot scope', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          {
            title: 'T',
            description: 'D',
            payload: 'my-payload-data',
          },
        ],
      },
      slots: {
        actions: ({ payload }: { payload: unknown }) =>
          h('div', { class: 'payload-actions' }, String(payload)),
      },
    })
    await nextTick()
    await nextTick()
    const actionsEl = document.querySelector('.payload-actions')
    expect(actionsEl?.textContent).toContain('my-payload-data')
    wrapper.unmount()
  })

  // ── skipButtonText a11y ──────────────────────────────────
  it('renders skipButtonText as close button title for a11y', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        skipButtonText: '跳过引导',
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    const closeBtn = document.querySelector('.zc-tour__close-btn') as HTMLElement
    expect(closeBtn).not.toBeNull()
    expect(closeBtn.getAttribute('title')).toBe('跳过引导')
    expect(closeBtn.getAttribute('aria-label')).toBe('跳过引导')
    wrapper.unmount()
  })

  // ── Cleanup ───────────────────────────────────────────────
  it('removes DOM on unmount', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: 'T', description: 'D' }],
      },
    })
    await nextTick()
    await nextTick()
    expect(document.querySelector('.zc-tour__overlay')).not.toBeNull()
    wrapper.unmount()
    expect(document.querySelector('.zc-tour__overlay')).toBeNull()
  })
})
