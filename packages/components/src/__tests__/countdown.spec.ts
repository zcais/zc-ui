import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Countdown from '../countdown/countdown.vue'

describe('ZcCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  /* --------------------------- Rendering --------------------------- */

  it('renders the root element', () => {
    const wrapper = mount(Countdown, { props: { value: 0 } })
    expect(wrapper.find('.zc-countdown').exists()).toBe(true)
  })

  it('renders title via prop', () => {
    const wrapper = mount(Countdown, {
      props: { value: 0, title: 'Flash Sale' },
    })
    expect(wrapper.find('.zc-countdown__title').text()).toBe('Flash Sale')
  })

  it('renders title via slot', () => {
    const wrapper = mount(Countdown, {
      props: { value: 0 },
      slots: { title: '<span class="t">Custom Title</span>' },
    })
    expect(wrapper.find('.t').exists()).toBe(true)
  })

  it('renders prefix and suffix via props', () => {
    const wrapper = mount(Countdown, {
      props: { value: 0, prefix: '⏰', suffix: 'left' },
    })
    expect(wrapper.find('.zc-countdown__prefix').text()).toBe('⏰')
    expect(wrapper.find('.zc-countdown__suffix').text()).toBe('left')
  })

  it('renders prefix and suffix via slots', () => {
    const wrapper = mount(Countdown, {
      props: { value: 0 },
      slots: {
        prefix: '<span class="pre">PRE</span>',
        suffix: '<span class="suf">SUF</span>',
      },
    })
    expect(wrapper.find('.pre').exists()).toBe(true)
    expect(wrapper.find('.suf').exists()).toBe(true)
  })

  it('applies valueStyle', () => {
    const wrapper = mount(Countdown, {
      props: { value: 0, valueStyle: { color: 'red', fontSize: '32px' } },
    })
    const style = wrapper.find('.zc-countdown__value').attributes('style')
    expect(style).toContain('color: red')
    expect(style).toContain('font-size: 32px')
  })

  /* --------------------------- Format ------------------------------ */

  it('formats with default HH:mm:ss', () => {
    const wrapper = mount(Countdown, { props: { value: 0 } })
    // value=0 → remaining=0 → all zeros
    const text = wrapper.find('.zc-countdown__value').text()
    expect(text).toBe('00:00:00')
  })

  it('formats DD天HH小时mm分ss秒', () => {
    // 1 day 2 hours 3 min 4 sec = 93784000 ms
    const ms = 1 * 86400000 + 2 * 3600000 + 3 * 60000 + 4 * 1000
    const wrapper = mount(Countdown, {
      props: { value: ms, format: 'DD天HH小时mm分ss秒' },
    })
    const text = wrapper.find('.zc-countdown__value').text()
    // The initial tick happens synchronously in onMounted
    expect(text).toContain('01天')
    expect(text).toContain('02小时')
    expect(text).toContain('03分')
    expect(text).toContain('04秒')
  })

  it('formats with mm:ss', () => {
    const wrapper = mount(Countdown, {
      props: { value: 65000, format: 'mm:ss' }, // 1 min 5 sec
    })
    const text = wrapper.find('.zc-countdown__value').text()
    expect(text).toBe('01:05')
  })

  /* --------------------------- Events ------------------------------ */

  it('emits change on each tick', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 3000, interval: 1000 },
    })
    // Initial tick in onMounted emits change
    const changes1 = wrapper.emitted('change')
    expect(changes1).toBeTruthy()
    expect(changes1!.length).toBeGreaterThanOrEqual(1)

    // Advance 1 second
    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.emitted('change')!.length).toBeGreaterThanOrEqual(2)
  })

  it('emits change with correct remaining value', () => {
    const wrapper = mount(Countdown, {
      props: { value: 5000, interval: 1000 },
    })
    const changes = wrapper.emitted('change')!
    // First emit is from onMounted tick
    const firstRemaining = changes[0][0] as number
    expect(firstRemaining).toBeGreaterThan(0)
    expect(firstRemaining).toBeLessThanOrEqual(5000)
  })

  it('emits finish when countdown reaches zero', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 1000, interval: 1000 },
    })
    // Should not be finished yet
    expect(wrapper.emitted('finish')).toBeFalsy()

    // Advance past the countdown duration
    vi.advanceTimersByTime(2000)
    await flushPromises()
    expect(wrapper.emitted('finish')).toBeTruthy()
    expect(wrapper.emitted('finish')!.length).toBe(1)
  })

  it('emits finish only once', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 500, interval: 200 },
    })
    vi.advanceTimersByTime(2000)
    await flushPromises()
    expect(wrapper.emitted('finish')!.length).toBe(1)
  })

  /* --------------------------- Methods ----------------------------- */

  it('pause() stops the timer', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 10000, interval: 1000 },
    })
    const vm = wrapper.vm as any
    const beforePause = wrapper.emitted('change')!.length

    vm.pause()
    vi.advanceTimersByTime(5000)
    await flushPromises()

    // No new change events after pause
    expect(wrapper.emitted('change')!.length).toBe(beforePause)
  })

  it('resume() restarts the timer', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 10000, interval: 1000 },
    })
    const vm = wrapper.vm as any

    vm.pause()
    const beforeResume = wrapper.emitted('change')!.length

    vi.advanceTimersByTime(2000)
    await flushPromises()

    vm.resume()
    vi.advanceTimersByTime(1000)
    await flushPromises()

    // New change events after resume
    expect(wrapper.emitted('change')!.length).toBeGreaterThan(beforeResume)
  })

  it('reset() restarts from initial value', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 2000, interval: 1000 },
    })
    const vm = wrapper.vm as any

    // Let countdown tick down
    vi.advanceTimersByTime(1500)
    await flushPromises()

    // Reset
    vm.reset()
    await flushPromises()

    // After reset, remaining should be back near initial
    const lastChange = wrapper.emitted('change')!
    const lastRemaining = lastChange[lastChange.length - 1][0] as number
    expect(lastRemaining).toBeGreaterThan(1000)
  })

  it('does not pause when already finished', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 500, interval: 100 },
    })
    const vm = wrapper.vm as any

    vi.advanceTimersByTime(1000)
    await flushPromises()
    expect(wrapper.emitted('finish')).toBeTruthy()

    // Pause after finish should be a no-op
    expect(() => vm.pause()).not.toThrow()
    expect(() => vm.resume()).not.toThrow()
  })

  /* --------------------- Absolute Timestamp Mode ------------------- */

  it('accepts absolute timestamp as value', async () => {
    // Use a timestamp 5 seconds in the future
    const future = Date.now() + 5000
    const wrapper = mount(Countdown, {
      props: { value: future, interval: 1000 },
    })
    const changes = wrapper.emitted('change')!
    const remaining = changes[0][0] as number
    expect(remaining).toBeGreaterThan(4000)
    expect(remaining).toBeLessThanOrEqual(5000)
  })

  /* ------------------------- Watch value --------------------------- */

  it('restarts when value prop changes', async () => {
    const wrapper = mount(Countdown, {
      props: { value: 3000, interval: 1000 },
    })
    await wrapper.setProps({ value: 10000 })
    await flushPromises()

    const changes = wrapper.emitted('change')!
    const lastRemaining = changes[changes.length - 1][0] as number
    expect(lastRemaining).toBeGreaterThan(5000)
  })

  /* ----------------------- Milliseconds format --------------------- */

  it('uses faster interval when format contains S', () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    const wrapper = mount(Countdown, {
      props: { value: 5000, format: 'HH:mm:ss:SSS' },
    })

    // Advance by 50ms (the auto-detected interval for ms formats)
    vi.spyOn(Date, 'now').mockReturnValue(now + 50)
    vi.advanceTimersByTime(50)
    const changes = wrapper.emitted('change')!
    expect(changes.length).toBeGreaterThan(1)
  })

  /* ----------------------- Cleanup on unmount ---------------------- */

  it('clears timer on unmount', () => {
    const wrapper = mount(Countdown, {
      props: { value: 10000, interval: 1000 },
    })
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
