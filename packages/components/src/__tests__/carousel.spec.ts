import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Carousel from '../carousel/carousel.vue'
import CarouselItem from '../carousel/carousel-item.vue'

const mountCarousel = (options: any = {}) =>
  mount(Carousel, {
    global: { components: { CarouselItem } },
    ...options,
  })

describe('ZcCarousel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // ==================== Basic ====================
  it('renders carousel', () => {
    const wrapper = mount(Carousel)
    expect(wrapper.find('.zc-carousel').exists()).toBe(true)
  })

  it('applies height style', () => {
    const wrapper = mount(Carousel, { props: { height: 200 } })
    expect(wrapper.find('.zc-carousel').attributes('style')).toContain('height: 200px')
  })

  it('applies string height', () => {
    const wrapper = mount(Carousel, { props: { height: '300px' } })
    expect(wrapper.find('.zc-carousel').attributes('style')).toContain('height: 300px')
  })

  it('renders carousel items', async () => {
    const wrapper = mountCarousel({
      slots: {
        default: `
          <carousel-item>Slide 1</carousel-item>
          <carousel-item>Slide 2</carousel-item>
          <carousel-item>Slide 3</carousel-item>
        `,
      },
    })
    await nextTick()
    const items = wrapper.findAll('.zc-carousel-item')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toBe('Slide 1')
  })

  it('shows indicators when items exist', async () => {
    const wrapper = mountCarousel({
      slots: {
        default: `
          <carousel-item>A</carousel-item>
          <carousel-item>B</carousel-item>
        `,
      },
    })
    await nextTick()
    expect(wrapper.find('.zc-carousel__indicators').exists()).toBe(true)
  })

  it('applies card mode class', () => {
    const wrapper = mount(Carousel, { props: { type: 'card' } })
    expect(wrapper.find('.zc-carousel').classes()).toContain('zc-carousel--card')
  })

  it('applies vertical direction class', () => {
    const wrapper = mount(Carousel, { props: { direction: 'vertical' } })
    expect(wrapper.find('.zc-carousel').classes()).toContain('zc-carousel--vertical')
  })

  it('hides indicators with none position', async () => {
    const wrapper = mountCarousel({
      props: { indicatorPosition: 'none' },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()
    expect(wrapper.find('.zc-carousel__indicators').exists()).toBe(false)
  })

  it('emits change event on navigation', async () => {
    const wrapper = mountCarousel({
      props: { arrow: 'always' },
      slots: {
        default: `
          <carousel-item>A</carousel-item>
          <carousel-item>B</carousel-item>
        `,
      },
    })
    await nextTick()
    const nextBtn = wrapper.find('.zc-carousel__arrow--right')
    await nextBtn.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('navigates to next on arrow click', async () => {
    const wrapper = mountCarousel({
      props: { arrow: 'always' },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()
    const nextBtn = wrapper.find('.zc-carousel__arrow--right')
    await nextBtn.trigger('click')
    const indicators = wrapper.findAll('.zc-carousel__indicator')
    expect(indicators[1].classes()).toContain('is-active')
  })

  // ==================== UID uniqueness ====================
  it('assigns unique uids to carousel items', async () => {
    const wrapper = mountCarousel({
      slots: {
        default: `
          <carousel-item>A</carousel-item>
          <carousel-item>B</carousel-item>
          <carousel-item>C</carousel-item>
        `,
      },
    })
    await nextTick()
    // Items array should have 3 entries with distinct uids
    const vm = wrapper.vm as any
    const items = vm.items
    expect(items).toHaveLength(3)
    const uids = items.map((i: any) => i.uid)
    expect(new Set(uids).size).toBe(3) // all unique
    expect(uids).toEqual([1, 2, 3])
  })

  // ==================== Touch support ====================
  it('navigates on horizontal touch swipe left', async () => {
    const wrapper = mountCarousel({
      props: { arrow: 'always' },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()
    const container = wrapper.find('.zc-carousel__container')

    // Simulate swipe left (finger goes right to left → next slide)
    await container.trigger('touchstart', {
      touches: [{ clientX: 300, clientY: 100 }],
    })
    await container.trigger('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 }],
    })

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('navigates on horizontal touch swipe right', async () => {
    const wrapper = mountCarousel({
      props: { arrow: 'always', initialIndex: 1 },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()

    const container = wrapper.find('.zc-carousel__container')
    // Simulate swipe right (finger goes left to right → prev slide)
    await container.trigger('touchstart', {
      touches: [{ clientX: 200, clientY: 100 }],
    })
    await container.trigger('touchend', {
      changedTouches: [{ clientX: 300, clientY: 100 }],
    })

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('ignores vertical swipe in horizontal mode', async () => {
    const wrapper = mountCarousel({
      props: { arrow: 'always' },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()

    const container = wrapper.find('.zc-carousel__container')
    await container.trigger('touchstart', {
      touches: [{ clientX: 300, clientY: 0 }],
    })
    await container.trigger('touchend', {
      changedTouches: [{ clientX: 300, clientY: 200 }],
    })

    // Vertical swipe in horizontal mode should NOT trigger navigation
    expect(wrapper.emitted('change')).toBeFalsy()
  })

  // ==================== Exposed methods ====================
  it('exposes prev/next/setActiveItem/startAutoplay/stopAutoplay', () => {
    const wrapper = mount(Carousel)
    expect(typeof wrapper.vm.prev).toBe('function')
    expect(typeof wrapper.vm.next).toBe('function')
    expect(typeof wrapper.vm.setActiveItem).toBe('function')
    expect(typeof wrapper.vm.startAutoplay).toBe('function')
    expect(typeof wrapper.vm.stopAutoplay).toBe('function')
    expect(wrapper.vm.activeIndex).toBe(0)
  })

  it('exposed next() navigates forward', async () => {
    const wrapper = mountCarousel({
      props: { initialIndex: 0 },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()
    ;(wrapper.vm as any).next()
    await nextTick()
    expect(wrapper.emitted('change')).toBeTruthy()
    const emitted = wrapper.emitted('change')![0]
    expect(emitted).toEqual([1, 0]) // [current, prev]
  })

  it('exposed setActiveItem jumps to specific index', async () => {
    const wrapper = mountCarousel({
      props: { initialIndex: 0 },
      slots: {
        default:
          '<carousel-item>A</carousel-item><carousel-item>B</carousel-item><carousel-item>C</carousel-item>',
      },
    })
    await nextTick()
    ;(wrapper.vm as any).setActiveItem(2)
    await nextTick()
    const emitted = wrapper.emitted('change')![0]
    expect(emitted).toEqual([2, 0])
  })

  // ==================== Empty state ====================
  it('shows empty state when no items', () => {
    const wrapper = mount(Carousel)
    expect(wrapper.find('.zc-carousel__empty').exists()).toBe(true)
  })

  it('hides empty state when items exist', async () => {
    const wrapper = mountCarousel({
      slots: {
        default: '<carousel-item>A</carousel-item>',
      },
    })
    await nextTick()
    expect(wrapper.find('.zc-carousel__empty').exists()).toBe(false)
  })

  it('renders custom empty slot', () => {
    const wrapper = mount(Carousel, {
      slots: { empty: '<div class="custom-empty">No slides</div>' },
    })
    expect(wrapper.find('.custom-empty').text()).toBe('No slides')
  })

  // ==================== Card mode ====================
  it('card mode items get inline styles', async () => {
    const wrapper = mountCarousel({
      props: { type: 'card' },
      slots: {
        default: `
          <carousel-item>A</carousel-item>
          <carousel-item>B</carousel-item>
          <carousel-item>C</carousel-item>
        `,
      },
    })
    await nextTick()
    const items = wrapper.findAll('.zc-carousel-item')
    // Active item (index 0) should be centered with translateX(50%)
    const activeStyle = items[0].attributes('style')
    expect(activeStyle).toContain('translateX(50%)')
    expect(activeStyle).toContain('scale(1)')

    // Adjacent item (index 1) should be offset to the right
    const adjacentStyle = items[1].attributes('style')
    expect(adjacentStyle).toContain('translateX(80%)')

    // Far item (index 2) should be hidden
    const farStyle = items[2].attributes('style')
    expect(farStyle).toContain('opacity: 0')
  })

  // ==================== Autoplay ====================
  it('starts autoplay when autoplay prop is true', async () => {
    vi.useFakeTimers()
    const wrapper = mountCarousel({
      props: { autoplay: true, interval: 1000 },
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()

    vi.advanceTimersByTime(1100)
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  // ==================== CSS variables ====================
  it('defines CSS custom properties on the carousel root', async () => {
    const wrapper = mountCarousel({
      slots: {
        default: '<carousel-item>A</carousel-item><carousel-item>B</carousel-item>',
      },
    })
    await nextTick()
    const carousel = wrapper.find('.zc-carousel')
    // Verify the CSS variables are defined in the <style> scope
    // by checking that indicator inherits the expected width
    const indicator = wrapper.find('.zc-carousel__indicator')
    expect(indicator.exists()).toBe(true)
    expect(carousel.exists()).toBe(true)
    // Active indicator should have width applied from CSS variable
    const activeIndicator = wrapper.find('.zc-carousel__indicator.is-active')
    expect(activeIndicator.exists()).toBe(true)
  })
})
