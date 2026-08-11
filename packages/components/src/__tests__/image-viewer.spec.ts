import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ImageViewer from '../image-viewer/image-viewer.vue'

const urlList = [
  'https://example.com/img1.jpg',
  'https://example.com/img2.jpg',
  'https://example.com/img3.jpg',
]

describe('ZcImageViewer', () => {
  // Stub Transition to avoid jsdom recursive update issues
  const stubs = { Transition: { template: '<slot />' } }

  function mountViewer(props: any) {
    document.body.innerHTML = ''
    return mount(ImageViewer, {
      props,
      attachTo: document.body,
      global: { stubs },
    })
  }

  it('renders nothing when visible is false', () => {
    mountViewer({ urlList, visible: false })
    expect(document.querySelector('.zc-image-viewer__overlay')).toBeFalsy()
  })

  it('renders overlay when visible', () => {
    mountViewer({ urlList, visible: true })
    expect(document.querySelector('.zc-image-viewer__overlay')).toBeTruthy()
  })

  it('displays the current image url', () => {
    mountViewer({ urlList, visible: true, modelValue: 0 })
    const img = document.querySelector('.zc-image-viewer__img') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('https://example.com/img1.jpg')
  })

  it('switches image via next/prev refs', async () => {
    const wrapper = mountViewer({ urlList, visible: true, modelValue: 0 })
    const vm = wrapper.vm as any
    vm.next()
    await nextTick()
    let img = document.querySelector('.zc-image-viewer__img') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('https://example.com/img2.jpg')

    vm.prev()
    await nextTick()
    img = document.querySelector('.zc-image-viewer__img') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('https://example.com/img1.jpg')
  })

  it('emits switch event when navigating', async () => {
    const wrapper = mountViewer({ urlList, visible: true, modelValue: 0 })
    const vm = wrapper.vm as any
    vm.next()
    await nextTick()
    const switchEvents = wrapper.emitted('switch')
    expect(switchEvents).toBeTruthy()
    expect(switchEvents![0][0]).toBe(1)
  })

  it('emits update:visible and close on close', async () => {
    const wrapper = mountViewer({ urlList, visible: true })
    const closeBtn = document.querySelector('.zc-image-viewer__close') as HTMLElement
    closeBtn.click()
    await nextTick()
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('shows navigation arrows when more than one image', () => {
    mountViewer({ urlList, visible: true })
    const navButtons = document.querySelectorAll('.zc-image-viewer__nav')
    expect(navButtons.length).toBe(2)
  })

  it('hides navigation arrows when only one image', () => {
    mountViewer({ urlList: ['https://example.com/single.jpg'], visible: true })
    const navButtons = document.querySelectorAll('.zc-image-viewer__nav')
    expect(navButtons.length).toBe(0)
  })

  it('shows page indicator with correct index', () => {
    mountViewer({ urlList, visible: true, modelValue: 1 })
    const indicator = document.querySelector('.zc-image-viewer__indicator')
    expect(indicator?.textContent?.trim()).toBe('2 / 3')
  })

  it('shows zoom label', () => {
    mountViewer({ urlList, visible: true })
    const label = document.querySelector('.zc-image-viewer__zoom-label')
    expect(label?.textContent?.trim()).toBe('100%')
  })

  it('zooms in and updates label', async () => {
    mountViewer({ urlList, visible: true, zoomRate: 0.2 })
    const actionBtns = document.querySelectorAll('.zc-image-viewer__action-btn')
    // action-btn[0] = zoom out, action-btn[1] = zoom in
    ;(actionBtns[1] as HTMLElement).click()
    await nextTick()
    const label = document.querySelector('.zc-image-viewer__zoom-label')
    expect(label?.textContent?.trim()).toBe('120%')
  })

  it('rotates image', async () => {
    mountViewer({ urlList, visible: true })
    const actionBtns = document.querySelectorAll('.zc-image-viewer__action-btn')
    // action-btn[2] = rotate
    ;(actionBtns[2] as HTMLElement).click()
    await nextTick()
    const img = document.querySelector('.zc-image-viewer__img') as HTMLElement
    const style = img.getAttribute('style') || ''
    expect(style).toContain('rotate(90deg)')
  })

  it('hides close button when showClose is false', () => {
    mountViewer({ urlList, visible: true, showClose: false })
    expect(document.querySelector('.zc-image-viewer__close')).toBeFalsy()
  })

  it('infinitely loops to first image when at last and infinite=true', async () => {
    const wrapper = mountViewer({
      urlList,
      visible: true,
      modelValue: 2,
      infinite: true,
    })
    const vm = wrapper.vm as any
    vm.next()
    await nextTick()
    const switchEvents = wrapper.emitted('switch')
    expect(switchEvents![0][0]).toBe(0)
  })

  it('does not loop when infinite=false', async () => {
    const wrapper = mountViewer({
      urlList,
      visible: true,
      modelValue: 2,
      infinite: false,
    })
    const vm = wrapper.vm as any
    vm.next()
    await nextTick()
    // Should stay at last — no switch event emitted
    const switchEvents = wrapper.emitted('switch')
    expect(switchEvents).toBeFalsy()
  })
})
