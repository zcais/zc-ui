import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Skeleton from '../skeleton/skeleton.vue'
import SkeletonItem from '../skeleton/skeleton-item.vue'

describe('ZcSkeleton', () => {
  it('renders skeleton when loading is true (default)', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.zc-skeleton').exists()).toBe(true)
  })

  it('renders slot content when loading is false', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<p>Real content</p>' },
    })
    expect(wrapper.text()).toContain('Real content')
    expect(wrapper.find('.zc-skeleton').exists()).toBe(false)
  })

  // ---- Title ----
  it('renders title bar by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.zc-skeleton__title').exists()).toBe(true)
  })

  it('hides title when title is false', () => {
    const wrapper = mount(Skeleton, { props: { title: false } })
    expect(wrapper.find('.zc-skeleton__title').exists()).toBe(false)
  })

  // ---- Paragraph ----
  it('renders paragraph lines by default', () => {
    const wrapper = mount(Skeleton)
    const lines = wrapper.findAll('.zc-skeleton__line')
    expect(lines.length).toBe(3) // default 3 rows
  })

  it('hides paragraph when paragraph is false', () => {
    const wrapper = mount(Skeleton, { props: { paragraph: false } })
    expect(wrapper.find('.zc-skeleton__paragraph').exists()).toBe(false)
  })

  // ---- Custom rows ----
  it('renders custom number of rows via rows prop', () => {
    const wrapper = mount(Skeleton, { props: { rows: 5 } })
    const lines = wrapper.findAll('.zc-skeleton__line')
    expect(lines.length).toBe(5)
  })

  // ---- Avatar ----
  it('renders avatar when avatar is true', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true } })
    expect(wrapper.find('.zc-skeleton__avatar').exists()).toBe(true)
  })

  it('does not render avatar by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.zc-skeleton__avatar').exists()).toBe(false)
  })

  it('renders avatar with circle shape', () => {
    const wrapper = mount(Skeleton, {
      props: { avatar: { shape: 'circle' } },
    })
    expect(wrapper.find('.zc-skeleton__avatar--circle').exists()).toBe(true)
  })

  it('renders avatar with large size', () => {
    const wrapper = mount(Skeleton, {
      props: { avatar: { size: 'large' } },
    })
    expect(wrapper.find('.zc-skeleton__avatar--large').exists()).toBe(true)
  })

  // ---- Animation ----
  it('applies animated class by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('.zc-skeleton').classes()).toContain('is-animated')
  })

  it('does not apply animated class when animated is false', () => {
    const wrapper = mount(Skeleton, { props: { animated: false } })
    expect(wrapper.find('.zc-skeleton').classes()).not.toContain('is-animated')
  })

  // ---- Title width ----
  it('applies custom title width', () => {
    const wrapper = mount(Skeleton, {
      props: { title: { width: '60%' } },
    })
    expect(wrapper.find('.zc-skeleton__title').attributes('style')).toContain('width: 60%')
  })

  // ---- #template slot integration with SkeletonItem ----
  describe('#template slot (SkeletonItem integration)', () => {
    it('renders #template slot when loading is true', () => {
      const wrapper = mount(Skeleton, {
        slots: {
          template: '<div class="custom-skeleton">Custom</div>',
        },
      })
      expect(wrapper.find('.custom-skeleton').exists()).toBe(true)
    })

    it('does not render built-in skeleton when #template slot is provided', () => {
      const wrapper = mount(Skeleton, {
        slots: {
          template: '<div class="custom-skeleton">Custom</div>',
        },
      })
      expect(wrapper.find('.zc-skeleton__container').exists()).toBe(false)
    })

    it('renders SkeletonItem inside #template slot', () => {
      const wrapper = mount(Skeleton, {
        slots: {
          template: () => h(SkeletonItem),
        },
      })
      expect(wrapper.find('.zc-skeleton-item').exists()).toBe(true)
    })

    it('renders multiple SkeletonItems inside #template slot', () => {
      const wrapper = mount(Skeleton, {
        slots: {
          template: `
            <ZcSkeletonItem variant="circle" width="48" height="48" />
            <ZcSkeletonItem variant="text" :rows="3" />
          `,
        },
        global: {
          components: { ZcSkeletonItem: SkeletonItem },
        },
      })
      const items = wrapper.findAll('.zc-skeleton-item')
      expect(items.length).toBeGreaterThanOrEqual(2)
    })

    it('shows default slot content when loading is false', () => {
      const wrapper = mount(Skeleton, {
        props: { loading: false },
        slots: {
          default: '<p>Real content</p>',
          template: '<div class="custom-skeleton">Custom</div>',
        },
      })
      expect(wrapper.text()).toContain('Real content')
      expect(wrapper.find('.custom-skeleton').exists()).toBe(false)
    })

    it('prefers #template slot over built-in skeleton when loading', () => {
      const wrapper = mount(Skeleton, {
        props: { loading: true },
        slots: {
          template: '<div class="my-template">Template</div>',
        },
      })
      expect(wrapper.find('.my-template').exists()).toBe(true)
      expect(wrapper.find('.zc-skeleton__title').exists()).toBe(false)
      expect(wrapper.find('.zc-skeleton__paragraph').exists()).toBe(false)
    })

    it('renders built-in skeleton when loading but no #template slot', () => {
      const wrapper = mount(Skeleton, {
        props: { loading: true },
      })
      expect(wrapper.find('.zc-skeleton__title').exists()).toBe(true)
      expect(wrapper.find('.zc-skeleton__paragraph').exists()).toBe(true)
    })
  })
})
