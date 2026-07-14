import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcProgress from '../progress/progress.vue'
import ZcTag from '../tag/tag.vue'
import ZcBadge from '../badge/badge.vue'
import ZcSkeleton from '../skeleton/skeleton.vue'
import ZcEmpty from '../empty/empty.vue'
import ZcAlert from '../alert/alert.vue'
import ZcMessage from '../message/message.vue'

describe('Accessibility: Progress', () => {
  it('should have role="progressbar"', () => {
    const wrapper = mount(ZcProgress)
    expect(wrapper.attributes('role')).toBe('progressbar')
  })

  it('should have aria-valuenow, aria-valuemin, aria-valuemax', () => {
    const wrapper = mount(ZcProgress, { props: { percentage: 50 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('50')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })
})

describe('Accessibility: Tag', () => {
  it('should render close button as <button> element', () => {
    const wrapper = mount(ZcTag, { props: { closable: true } })
    const closeBtn = wrapper.find('.zc-tag__close')
    expect(closeBtn.element.tagName).toBe('BUTTON')
  })

  it('should have aria-label on close button', () => {
    const wrapper = mount(ZcTag, { props: { closable: true } })
    const closeBtn = wrapper.find('.zc-tag__close')
    expect(closeBtn.attributes('aria-label')).toBe('移除标签')
  })
})

describe('Accessibility: Badge', () => {
  it('should have role="status"', () => {
    const wrapper = mount(ZcBadge, { props: { value: 5 } })
    const badge = wrapper.find('.zc-badge__content')
    expect(badge.attributes('role')).toBe('status')
  })

  it('should have aria-label with custom value', () => {
    const wrapper = mount(ZcBadge, {
      props: { value: 3, ariaLabel: '3 条未读消息' },
    })
    const badge = wrapper.find('.zc-badge__content')
    expect(badge.attributes('aria-label')).toBe('3 条未读消息')
  })

  it('should have aria-label with display value by default', () => {
    const wrapper = mount(ZcBadge, { props: { value: 5 } })
    const badge = wrapper.find('.zc-badge__content')
    expect(badge.attributes('aria-label')).toBe('5')
  })
})

describe('Accessibility: Skeleton', () => {
  it('should have role="status" and aria-busy="true"', () => {
    const wrapper = mount(ZcSkeleton, { props: { loading: true } })
    const skeleton = wrapper.find('.zc-skeleton')
    expect(skeleton.exists()).toBe(true)
    expect(skeleton.attributes('role')).toBe('status')
    expect(skeleton.attributes('aria-busy')).toBe('true')
    expect(skeleton.attributes('aria-live')).toBe('polite')
  })
})

describe('Accessibility: Empty', () => {
  it('should have role="status"', () => {
    const wrapper = mount(ZcEmpty)
    const el = wrapper.find('.zc-empty')
    expect(el.attributes('role')).toBe('status')
  })

  it('should have aria-hidden on default SVG', () => {
    const wrapper = mount(ZcEmpty)
    const svg = wrapper.find('.zc-empty__default')
    expect(svg.attributes('aria-hidden')).toBe('true')
  })
})

describe('Accessibility: Alert', () => {
  it('should have role="alert"', () => {
    const wrapper = mount(ZcAlert)
    const el = wrapper.find('.zc-alert')
    expect(el.attributes('role')).toBe('alert')
  })

  it('should render close button as <button> element', () => {
    const wrapper = mount(ZcAlert)
    const closeBtn = wrapper.find('.zc-alert__close')
    expect(closeBtn.element.tagName).toBe('BUTTON')
  })

  it('should have aria-label on close button', () => {
    const wrapper = mount(ZcAlert)
    const closeBtn = wrapper.find('.zc-alert__close')
    expect(closeBtn.attributes('aria-label')).toBe('关闭')
  })

  it('should have aria-hidden on icon SVG', () => {
    const wrapper = mount(ZcAlert, { props: { showIcon: true } })
    const iconSvg = wrapper.find('.zc-alert__icon-svg')
    expect(iconSvg.exists()).toBe(true)
  })
})

describe('Accessibility: Message', () => {
  it('should have role="status" and aria-live="polite"', () => {
    const wrapper = mount(ZcMessage, { props: { message: 'Hello' } })
    const el = wrapper.find('.zc-message')
    expect(el.attributes('role')).toBe('status')
    expect(el.attributes('aria-live')).toBe('polite')
  })
})
