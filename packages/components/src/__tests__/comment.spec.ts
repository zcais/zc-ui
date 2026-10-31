import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Comment from '../comment/comment.vue'

describe('ZcComment', () => {
  it('renders root element with author', () => {
    const wrapper = mount(Comment, { props: { author: 'Alice' } })
    expect(wrapper.find('.zc-comment').exists()).toBe(true)
    expect(wrapper.find('.zc-comment__author').text()).toBe('Alice')
  })

  it('renders avatar image when avatar prop is provided', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice', avatar: 'https://example.com/a.png' },
    })
    const img = wrapper.find('.zc-comment__avatar-img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/a.png')
    expect(img.attributes('alt')).toBe('Alice')
  })

  it('shows initials placeholder when avatar is empty', () => {
    const wrapper = mount(Comment, { props: { author: 'bob' } })
    const placeholder = wrapper.find('.zc-comment__avatar-placeholder')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('B')
  })

  it('applies avatarSize to avatar style', () => {
    const wrapper = mount(Comment, { props: { author: 'A', avatarSize: 60 } })
    const avatar = wrapper.find('.zc-comment__avatar')
    expect(avatar.attributes('style')).toContain('width: 60px')
    expect(avatar.attributes('style')).toContain('height: 60px')
  })

  it('allows avatar slot to override prop avatar', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice', avatar: 'https://example.com/a.png' },
      slots: { avatar: '<span class="custom-avatar">X</span>' },
    })
    expect(wrapper.find('.custom-avatar').exists()).toBe(true)
    expect(wrapper.find('.zc-comment__avatar-img').exists()).toBe(false)
  })

  it('renders datetime in header', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice', datetime: '2024-01-01 10:00' },
    })
    const datetime = wrapper.find('.zc-comment__datetime')
    expect(datetime.exists()).toBe(true)
    expect(datetime.text()).toBe('2024-01-01 10:00')
  })

  it('does not render header when no author/datetime given', () => {
    const wrapper = mount(Comment)
    expect(wrapper.find('.zc-comment__header').exists()).toBe(false)
  })

  it('renders content prop in body', () => {
    const wrapper = mount(Comment, { props: { content: 'Hello world' } })
    expect(wrapper.find('.zc-comment__body').text()).toBe('Hello world')
  })

  it('default slot overrides content prop', () => {
    const wrapper = mount(Comment, {
      props: { content: 'fallback' },
      slots: { default: '<p class="custom-body">Slot content</p>' },
    })
    expect(wrapper.find('.custom-body').exists()).toBe(true)
    expect(wrapper.find('.zc-comment__body').text()).toBe('Slot content')
  })

  it('renders default Reply and Like action buttons when no actions slot', () => {
    const wrapper = mount(Comment, { props: { author: 'Alice' } })
    expect(wrapper.find('.zc-comment__action--reply').exists()).toBe(true)
    expect(wrapper.find('.zc-comment__action--like').exists()).toBe(true)
  })

  it('emits reply with author when default reply button clicked', async () => {
    const wrapper = mount(Comment, { props: { author: 'Alice' } })
    await wrapper.find('.zc-comment__action--reply').trigger('click')
    expect(wrapper.emitted('reply')).toBeTruthy()
    expect(wrapper.emitted('reply')![0]).toEqual(['Alice'])
  })

  it('emits like when default like button clicked', async () => {
    const wrapper = mount(Comment, { props: { author: 'Alice' } })
    await wrapper.find('.zc-comment__action--like').trigger('click')
    expect(wrapper.emitted('like')).toBeTruthy()
  })

  it('actions slot replaces default buttons and receives handlers', async () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice' },
      slots: {
        actions: (slotProps: { reply: () => void; like: () => void }) =>
          h('button', { class: 'custom-action', onClick: slotProps.reply }, 'custom reply'),
      },
    })
    expect(wrapper.find('.zc-comment__action--reply').exists()).toBe(false)
    expect(wrapper.find('.custom-action').exists()).toBe(true)
    await wrapper.find('.custom-action').trigger('click')
    expect(wrapper.emitted('reply')![0]).toEqual(['Alice'])
  })

  it('author slot overrides author prop rendering', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice' },
      slots: { author: '<span class="custom-author">Alice Wang</span>' },
    })
    expect(wrapper.find('.custom-author').exists()).toBe(true)
    expect(wrapper.find('.custom-author').text()).toBe('Alice Wang')
  })

  it('renders nested comment-list slot when nested is true', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice', nested: true },
      slots: { 'comment-list': '<div class="nested-replies"> replies </div>' },
    })
    expect(wrapper.find('.zc-comment__nested').exists()).toBe(true)
    expect(wrapper.find('.nested-replies').exists()).toBe(true)
  })

  it('does not render nested area when nested is false', () => {
    const wrapper = mount(Comment, {
      props: { author: 'Alice', nested: false },
      slots: { 'comment-list': '<div class="nested-replies"> replies </div>' },
    })
    expect(wrapper.find('.zc-comment__nested').exists()).toBe(false)
  })
})
