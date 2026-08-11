import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import ErrorBoundary from '../error-boundary/error-boundary.vue'

/** Suppress Vue's default error logging in tests */
const silentErrorHandler = () => {}

/** Helper: a component that throws during setup */
const ThrowingComponent = defineComponent({
  name: 'ThrowingComponent',
  setup() {
    throw new Error('Test error from child')
  },
  render() {
    return h('div', 'should not render')
  },
})

/** Helper: a normal component */
const NormalComponent = defineComponent({
  name: 'NormalComponent',
  render() {
    return h('p', { class: 'normal-content' }, 'Hello from child')
  },
})

/** Mount helper with error handler suppressed */
function mountEB(options: Parameters<typeof mount>[1] = {}) {
  return mount(ErrorBoundary, {
    global: { config: { errorHandler: silentErrorHandler } },
    ...options,
  })
}

describe('ZcErrorBoundary', () => {
  // ---- Normal rendering ----
  it('renders slot content when no error occurs', () => {
    const wrapper = mountEB({
      slots: { default: h(NormalComponent) },
    })
    expect(wrapper.find('.normal-content').exists()).toBe(true)
    expect(wrapper.find('.zc-error-boundary').exists()).toBe(false)
  })

  // ---- Error capture ----
  it('displays fallback UI when child throws', async () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary').exists()).toBe(true)
    expect(wrapper.find('.zc-error-boundary__retry-btn').exists()).toBe(true)
    // Normal content should not be visible
    expect(wrapper.find('.normal-content').exists()).toBe(false)
  })

  it('emits "error" event with Error and info when child throws', () => {
    const onError = vi.fn()
    const wrapper = mountEB({
      attrs: { onError },
      slots: { default: h(ThrowingComponent) },
    })
    expect(onError).toHaveBeenCalledTimes(1)
    const [err, info] = onError.mock.calls[0]
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Test error from child')
    expect(typeof info).toBe('string')
  })

  // ---- catchErrors = false (error propagation) ----
  it('does not capture error when catchErrors is false (propagates to outer)', async () => {
    // When catchErrors=false, the error should propagate to the outer boundary.
    const OuterBoundary = defineComponent({
      setup() {
        return () =>
          h(ErrorBoundary, { catchErrors: true }, () =>
            h(ErrorBoundary, { catchErrors: false }, () => h(ThrowingComponent))
          )
      },
    })
    const wrapper = mount(OuterBoundary, {
      global: { config: { errorHandler: silentErrorHandler } },
    })
    await flushPromises()
    // The outer boundary should have caught it (showing its fallback UI)
    expect(wrapper.find('.zc-error-boundary').exists()).toBe(true)
  })

  // ---- reset() method ----
  it('reset() clears the error state and emits reset event', async () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    // Initially showing error UI
    expect(wrapper.find('.zc-error-boundary').exists()).toBe(true)

    // Call reset
    wrapper.vm.reset()
    await flushPromises()

    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('exposes reset method via defineExpose', () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    expect(typeof wrapper.vm.reset).toBe('function')
  })

  // ---- Custom props ----
  it('renders custom errorTitle', async () => {
    const wrapper = mountEB({
      props: { errorTitle: 'Custom Title' },
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary__title').text()).toBe('Custom Title')
  })

  it('renders errorDescription when provided', async () => {
    const wrapper = mountEB({
      props: { errorDescription: 'Something broke' },
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary__description').text()).toBe('Something broke')
  })

  it('does not render description element when errorDescription is empty', async () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary__description').exists()).toBe(false)
  })

  // ---- Details toggle ----
  it('shows details toggle when showDetails is true', async () => {
    const wrapper = mountEB({
      props: { showDetails: true },
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    const toggle = wrapper.find('.zc-error-boundary__details-toggle')
    expect(toggle.exists()).toBe(true)

    // Stack should not be visible initially
    expect(wrapper.find('.zc-error-boundary__stack').exists()).toBe(false)

    // Click to expand
    await toggle.trigger('click')
    expect(wrapper.find('.zc-error-boundary__stack').exists()).toBe(true)
    expect(wrapper.find('.zc-error-boundary__stack code').text()).toContain('Test error from child')
  })

  it('hides details section when showDetails is false', async () => {
    const wrapper = mountEB({
      props: { showDetails: false },
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary__details').exists()).toBe(false)
  })

  it('displays errorInfo in stack when expanded', async () => {
    const wrapper = mountEB({
      props: { showDetails: true },
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    await wrapper.find('.zc-error-boundary__details-toggle').trigger('click')
    const stackText = wrapper.find('.zc-error-boundary__stack code').text()
    // Should contain the Info section
    expect(stackText).toContain('Info:')
  })

  // ---- Error slot (using render function for scoped slot) ----
  it('renders custom error slot with error and reset params', async () => {
    const CustomErrorSlot = defineComponent({
      props: ['error', 'reset'],
      render() {
        return h('div', { class: 'custom-error' }, [
          h('span', { class: 'custom-msg' }, this.error?.message || ''),
          h('button', { class: 'custom-reset', onClick: this.reset }, 'Custom Reset'),
        ])
      },
    })

    const wrapper = mountEB({
      slots: {
        default: h(ThrowingComponent),
        error: ({ error, reset }: { error: Error; reset: () => void }) =>
          h(CustomErrorSlot, { error, reset }),
      },
    })
    await flushPromises()
    expect(wrapper.find('.custom-error').exists()).toBe(true)
    expect(wrapper.find('.custom-msg').text()).toBe('Test error from child')
    expect(wrapper.find('.custom-reset').exists()).toBe(true)
    // Default UI should not render
    expect(wrapper.find('.zc-error-boundary__retry-btn').exists()).toBe(false)
  })

  // ---- aria-live ----
  it('has role="alert" and aria-live="polite" on fallback container', async () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    const container = wrapper.find('.zc-error-boundary')
    expect(container.attributes('role')).toBe('alert')
    expect(container.attributes('aria-live')).toBe('polite')
  })

  // ---- Icon accessibility ----
  it('has aria-hidden on icon', async () => {
    const wrapper = mountEB({
      slots: { default: h(ThrowingComponent) },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary__icon').attributes('aria-hidden')).toBe('true')
  })
})
