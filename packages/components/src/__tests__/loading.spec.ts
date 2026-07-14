import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { vLoading, ZcLoadingService } from '../loading/loading'
import LoadingComponent from '../loading/loading.vue'

describe('ZcLoading', () => {
  describe('Loading component', () => {
    it('renders overlay', () => {
      const wrapper = mount(LoadingComponent, {
        props: { fullscreen: false },
      })
      expect(wrapper.find('.zc-loading__overlay').exists()).toBe(true)
      expect(wrapper.find('.zc-loading__spinner').exists()).toBe(true)
    })

    it('applies fullscreen class', () => {
      const wrapper = mount(LoadingComponent, {
        props: { fullscreen: true },
      })
      expect(wrapper.find('.zc-loading__overlay').classes()).toContain('is-fullscreen')
    })

    it('displays text when provided', () => {
      const wrapper = mount(LoadingComponent, {
        props: { text: 'Loading data...' },
      })
      expect(wrapper.find('.zc-loading__text').text()).toBe('Loading data...')
    })

    it('does not display text when not provided', () => {
      const wrapper = mount(LoadingComponent)
      expect(wrapper.find('.zc-loading__text').exists()).toBe(false)
    })

    it('applies custom background', () => {
      const wrapper = mount(LoadingComponent, {
        props: { background: 'rgba(0,0,0,0.5)' },
      })
      const style = wrapper.find('.zc-loading__overlay').attributes('style') || ''
      // jsdom may add spaces: rgba(0, 0, 0, 0.5)
      expect(style).toContain('rgba(0')
      expect(style).toContain('0.5)')
    })

    it('applies spinner size', () => {
      const wrapper = mount(LoadingComponent, {
        props: { size: 48 },
      })
      const style = wrapper.find('.zc-loading__icon').attributes('style') || ''
      expect(style).toContain('48px')
    })

    it('applies custom color', () => {
      const wrapper = mount(LoadingComponent, {
        props: { color: '#ff0000' },
      })
      const style = wrapper.find('.zc-loading__icon').attributes('style') || ''
      // jsdom converts hex to rgb
      expect(style).toContain('color')
      expect(style).not.toContain('color: ;')
    })
  })

  describe('v-loading directive', () => {
    // Test component using template approach
    const TemplateComponent = defineComponent({
      directives: { loading: vLoading },
      props: { isLoading: { type: Boolean, default: true } },
      template: '<div v-loading="isLoading" class="test-container">Content</div>',
    })

    it('shows loading overlay when directive value is true', async () => {
      const wrapper = mount(TemplateComponent, {
        props: { isLoading: true },
      })
      await nextTick()
      const overlay = wrapper.find('.zc-loading__overlay')
      expect(overlay.exists()).toBe(true)
    })

    it('hides loading overlay when directive value is false', async () => {
      const wrapper = mount(TemplateComponent, {
        props: { isLoading: false },
      })
      await nextTick()
      expect(wrapper.find('.zc-loading__overlay').exists()).toBe(false)
    })

    it('toggles loading on prop change', async () => {
      const wrapper = mount(TemplateComponent, {
        props: { isLoading: false },
      })
      await nextTick()
      expect(wrapper.find('.zc-loading__overlay').exists()).toBe(false)

      await wrapper.setProps({ isLoading: true })
      await nextTick()
      expect(wrapper.find('.zc-loading__overlay').exists()).toBe(true)
    })

    it('accepts object options', async () => {
      const ObjectComponent = defineComponent({
        directives: { loading: vLoading },
        data() {
          return {
            options: { text: 'Loading...', size: 48 },
          }
        },
        template: '<div v-loading="options" class="test-container">Content</div>',
      })

      const wrapper = mount(ObjectComponent)
      await nextTick()
      expect(wrapper.find('.zc-loading__text').text()).toBe('Loading...')
    })
  })

  describe('Loading service', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    it('creates a fullscreen loading', () => {
      const instance = ZcLoadingService.service()
      const overlay = document.querySelector('.zc-loading__overlay.is-fullscreen')
      expect(overlay).not.toBeNull()
      instance.close()
    })

    it('closes the loading on close()', () => {
      const instance = ZcLoadingService.service()
      expect(document.querySelector('.zc-loading__overlay')).not.toBeNull()
      instance.close()
      expect(document.querySelector('.zc-loading__overlay')).toBeNull()
    })

    it('accepts text option', () => {
      const instance = ZcLoadingService.service({ text: 'Please wait' })
      expect(document.querySelector('.zc-loading__text')?.textContent).toBe('Please wait')
      instance.close()
    })

    it('locks body scroll when lock is true', () => {
      const instance = ZcLoadingService.service({ lock: true })
      expect(document.body.style.overflow).toBe('hidden')
      instance.close()
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Bug #1: Loading App instance memory leak', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    it('service close() properly unmounts the Vue app', () => {
      const instance = ZcLoadingService.service()
      expect(document.querySelector('.zc-loading__overlay')).not.toBeNull()

      instance.close()
      expect(document.querySelector('.zc-loading__overlay')).toBeNull()
    })

    it('multiple open/close cycles do not leak DOM nodes', () => {
      for (let i = 0; i < 5; i++) {
        const instance = ZcLoadingService.service({ text: `Loading ${i}` })
        instance.close()
      }
      expect(document.querySelectorAll('.zc-loading__overlay').length).toBe(0)
    })

    it('directive properly cleans up app on unmount', async () => {
      const TemplateComponent = defineComponent({
        directives: { loading: vLoading },
        props: { isLoading: { type: Boolean, default: true } },
        template: '<div v-loading="isLoading" class="test-container">Content</div>',
      })

      const wrapper = mount(TemplateComponent, { props: { isLoading: true } })
      await nextTick()
      expect(wrapper.find('.zc-loading__overlay').exists()).toBe(true)

      wrapper.unmount()
      expect(document.querySelector('.zc-loading__overlay')).toBeNull()
    })
  })
})
