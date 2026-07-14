import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Anchor from '../anchor/anchor.vue'
import AnchorLink from '../anchor/anchor-link.vue'

describe('ZcAnchor', () => {
  it('renders with default props', () => {
    const wrapper = mount(Anchor)
    expect(wrapper.classes()).toContain('zc-anchor')
    expect(wrapper.classes()).toContain('zc-anchor--vertical')
  })

  it('renders horizontal direction', () => {
    const wrapper = mount(Anchor, { props: { direction: 'horizontal' } })
    expect(wrapper.classes()).toContain('zc-anchor--horizontal')
  })

  it('renders anchor links via slots', () => {
    const wrapper = mount(Anchor, {
      slots: {
        default: {
          template: '<ZcAnchorLink href="#section1" title="Section 1"></ZcAnchorLink>',
        },
      },
      global: { components: { ZcAnchorLink: AnchorLink } },
    })
    expect(wrapper.findComponent(AnchorLink).exists()).toBe(true)
    expect(wrapper.text()).toContain('Section 1')
  })

  it('registers links on mount', () => {
    const wrapper = mount(Anchor, {
      slots: {
        default: [
          { template: '<ZcAnchorLink href="#a" title="A"></ZcAnchorLink>' },
          { template: '<ZcAnchorLink href="#b" title="B"></ZcAnchorLink>' },
        ],
      },
      global: { components: { ZcAnchorLink: AnchorLink } },
    })
    expect(wrapper.findAllComponents(AnchorLink)).toHaveLength(2)
  })

  it('handles click event', async () => {
    const wrapper = mount(Anchor, {
      slots: {
        default: {
          template: '<ZcAnchorLink href="#section1" title="Section 1"></ZcAnchorLink>',
        },
      },
      global: { components: { ZcAnchorLink: AnchorLink } },
    })
    const link = wrapper.findComponent(AnchorLink)
    await link.find('a').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  // ---- Bug #8: Anchor active state works correctly ----
  it('updates active state on link click', async () => {
    const wrapper = mount(Anchor, {
      slots: {
        default: [
          { template: '<ZcAnchorLink href="#a" title="A"></ZcAnchorLink>' },
          { template: '<ZcAnchorLink href="#b" title="B"></ZcAnchorLink>' },
        ],
      },
      global: { components: { ZcAnchorLink: AnchorLink } },
    })
    const links = wrapper.findAllComponents(AnchorLink)
    const linkB = links[1]

    // Click link B
    await linkB.find('a').trigger('click')

    // Link B should now be active
    const activeLinks = wrapper.findAll('.zc-anchor__link.is-active')
    expect(activeLinks.length).toBeGreaterThanOrEqual(1)
    expect(activeLinks[activeLinks.length - 1].text()).toContain('B')
  })
})
