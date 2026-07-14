import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Steps from '../steps/steps.vue'
import Step from '../steps/step.vue'

const createStep = (props: any) => h(Step, props)

describe('ZcSteps', () => {
  it('renders steps container', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [
          createStep({ title: 'Step 1', description: 'First' }),
          createStep({ title: 'Step 2', description: 'Second' }),
          createStep({ title: 'Step 3', description: 'Third' }),
        ],
      },
    })
    expect(wrapper.find('.zc-steps').exists()).toBe(true)
  })

  it('applies horizontal direction by default', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: { default: () => [createStep({ title: 'S1' })] },
    })
    expect(wrapper.find('.zc-steps').classes()).toContain('zc-steps--horizontal')
  })

  it('applies vertical direction', () => {
    const wrapper = mount(Steps, {
      props: { current: 0, direction: 'vertical' },
      slots: { default: () => [createStep({ title: 'S1' })] },
    })
    expect(wrapper.find('.zc-steps').classes()).toContain('zc-steps--vertical')
  })

  it('renders child step components', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [createStep({ title: 'Step 1' }), createStep({ title: 'Step 2' })],
      },
    })
    expect(wrapper.findAll('.zc-step')).toHaveLength(2)
  })
})

describe('ZcStep', () => {
  const mountWithParent = (current = 0, stepProps = {}, parentProps = {}) => {
    return mount(Steps, {
      props: { current, ...parentProps },
      slots: {
        default: () => [
          createStep({ title: 'Step 1', description: 'First' }),
          createStep({ title: 'Step 2', description: 'Second', ...stepProps }),
        ],
      },
    })
  }

  it('shows process status for current step', () => {
    const wrapper = mountWithParent(0)
    const firstStep = wrapper.findAll('.zc-step')[0]
    expect(firstStep.classes()).toContain('is-process')
  })

  it('shows wait status for future steps', () => {
    const wrapper = mountWithParent(0)
    const secondStep = wrapper.findAll('.zc-step')[1]
    expect(secondStep.classes()).toContain('is-wait')
  })

  it('shows finish status for completed steps', () => {
    const wrapper = mountWithParent(1)
    const firstStep = wrapper.findAll('.zc-step')[0]
    expect(firstStep.classes()).toContain('is-finish')
  })

  it('shows error status when error is true', () => {
    const wrapper = mountWithParent(0, {}, { error: true })
    const firstStep = wrapper.findAll('.zc-step')[0]
    expect(firstStep.classes()).toContain('is-error')
  })

  it('displays step title', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: { default: () => [createStep({ title: 'My Custom Title' })] },
    })
    expect(wrapper.find('.zc-step__title').text()).toBe('My Custom Title')
  })

  it('displays step description', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [createStep({ title: 'T', description: 'Detailed description' })],
      },
    })
    expect(wrapper.find('.zc-step__description').text()).toBe('Detailed description')
  })

  it('shows check icon for finished step', () => {
    const wrapper = mount(Steps, {
      props: { current: 1 },
      slots: {
        default: () => [createStep({ title: 'S1' }), createStep({ title: 'S2' })],
      },
    })
    const firstStep = wrapper.findAll('.zc-step')[0]
    expect(firstStep.find('.zc-step__icon').classes()).toContain('is-finish')
  })

  it('renders vertical steps', () => {
    const wrapper = mount(Steps, {
      props: { current: 0, direction: 'vertical' },
      slots: {
        default: () => [createStep({ title: 'S1' }), createStep({ title: 'S2' })],
      },
    })
    expect(wrapper.find('.zc-steps').classes()).toContain('zc-steps--vertical')
    expect(wrapper.findAll('.zc-step.is-vertical')).toHaveLength(2)
  })

  it('renders simple mode', () => {
    const wrapper = mount(Steps, {
      props: { current: 0, type: 'simple' },
      slots: {
        default: () => [createStep({ title: 'S1' }), createStep({ title: 'S2' })],
      },
    })
    expect(wrapper.find('.zc-steps').classes()).toContain('is-simple')
  })

  it('shows step number for current step', () => {
    const wrapper = mount(Steps, {
      props: { current: 1 },
      slots: {
        default: () => [
          createStep({ title: 'S1' }),
          createStep({ title: 'S2' }),
          createStep({ title: 'S3' }),
        ],
      },
    })
    const steps = wrapper.findAll('.zc-step')
    expect(steps[1].find('.zc-step__icon-text').exists()).toBe(true)
  })

  it('hides connector line for last step', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [createStep({ title: 'S1' }), createStep({ title: 'S2' })],
      },
    })
    const steps = wrapper.findAll('.zc-step')
    expect(steps[1].classes()).toContain('is-last')
  })

  it('allows status override', () => {
    const wrapper = mount(Steps, {
      props: { current: 0 },
      slots: {
        default: () => [createStep({ title: 'S1', status: 'error' }), createStep({ title: 'S2' })],
      },
    })
    const steps = wrapper.findAll('.zc-step')
    expect(steps[0].classes()).toContain('is-error')
  })
})
