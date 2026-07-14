import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Container from '../container/container.vue'
import Header from '../container/header.vue'
import Aside from '../container/aside.vue'
import Main from '../container/main.vue'
import Footer from '../container/footer.vue'

describe('ZcContainer', () => {
  it('renders with default props', () => {
    const wrapper = mount(Container)
    expect(wrapper.classes()).toContain('zc-container')
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Container, { props: { tag: 'div' } })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('applies vertical direction class when direction=vertical', () => {
    const wrapper = mount(Container, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('is-vertical')
  })

  it('does NOT have is-vertical class by default (horizontal is default)', () => {
    const wrapper = mount(Container, { props: { direction: 'horizontal' } })
    expect(wrapper.classes()).not.toContain('is-vertical')
  })

  it('does NOT output is-horizontal class (horizontal is the default state)', () => {
    const wrapper = mount(Container, { props: { direction: 'horizontal' } })
    expect(wrapper.classes()).not.toContain('is-horizontal')
  })

  it('auto-detects vertical when children contain ZcHeader', () => {
    const wrapper = mount({
      components: { Container, Header },
      template: `
        <Container>
          <Header>Header</Header>
        </Container>
      `,
    })
    const container = wrapper.find('.zc-container')
    expect(container.classes()).toContain('is-vertical')
  })

  it('auto-detects vertical when children contain ZcFooter', () => {
    const wrapper = mount({
      components: { Container, Footer },
      template: `
        <Container>
          <Footer>Footer</Footer>
        </Container>
      `,
    })
    const container = wrapper.find('.zc-container')
    expect(container.classes()).toContain('is-vertical')
  })

  it('stays horizontal when children are only Aside + Main', () => {
    const wrapper = mount({
      components: { Container, Aside, Main },
      template: `
        <Container>
          <Aside width="200px">Aside</Aside>
          <Main>Main</Main>
        </Container>
      `,
    })
    const container = wrapper.find('.zc-container')
    expect(container.classes()).not.toContain('is-vertical')
  })

  it('renders slot content', () => {
    const wrapper = mount(Container, {
      slots: { default: '<div class="inner">content</div>' },
    })
    expect(wrapper.find('.inner').exists()).toBe(true)
  })
})

describe('ZcHeader', () => {
  it('renders with default props', () => {
    const wrapper = mount(Header)
    expect(wrapper.classes()).toContain('zc-header')
    expect(wrapper.element.tagName).toBe('HEADER')
  })

  it('sets default height via CSS variable', () => {
    const wrapper = mount(Header)
    expect(wrapper.attributes('style')).toContain('--zc-header-height: 60px')
  })

  it('sets custom height via CSS variable', () => {
    const wrapper = mount(Header, { props: { height: '80px' } })
    expect(wrapper.attributes('style')).toContain('--zc-header-height: 80px')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Header, { props: { tag: 'div' } })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const wrapper = mount(Header, {
      slots: { default: '<span>Header text</span>' },
    })
    expect(wrapper.text()).toContain('Header text')
  })
})

describe('ZcAside', () => {
  it('renders with default props', () => {
    const wrapper = mount(Aside)
    expect(wrapper.classes()).toContain('zc-aside')
    expect(wrapper.element.tagName).toBe('ASIDE')
  })

  it('sets default width via CSS variable', () => {
    const wrapper = mount(Aside)
    expect(wrapper.attributes('style')).toContain('--zc-aside-width: 200px')
  })

  it('sets custom width via CSS variable', () => {
    const wrapper = mount(Aside, { props: { width: '300px' } })
    expect(wrapper.attributes('style')).toContain('--zc-aside-width: 300px')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Aside, { props: { tag: 'nav' } })
    expect(wrapper.element.tagName).toBe('NAV')
  })

  it('renders slot content', () => {
    const wrapper = mount(Aside, {
      slots: { default: '<div>Sidebar</div>' },
    })
    expect(wrapper.text()).toContain('Sidebar')
  })
})

describe('ZcMain', () => {
  it('renders with default props', () => {
    const wrapper = mount(Main)
    expect(wrapper.classes()).toContain('zc-main')
    expect(wrapper.element.tagName).toBe('MAIN')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Main, { props: { tag: 'article' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('renders slot content', () => {
    const wrapper = mount(Main, {
      slots: { default: '<p>Main body</p>' },
    })
    expect(wrapper.text()).toContain('Main body')
  })
})

describe('ZcFooter', () => {
  it('renders with default props', () => {
    const wrapper = mount(Footer)
    expect(wrapper.classes()).toContain('zc-footer')
    expect(wrapper.element.tagName).toBe('FOOTER')
  })

  it('sets default height via CSS variable', () => {
    const wrapper = mount(Footer)
    expect(wrapper.attributes('style')).toContain('--zc-footer-height: 60px')
  })

  it('sets custom height via CSS variable', () => {
    const wrapper = mount(Footer, { props: { height: '40px' } })
    expect(wrapper.attributes('style')).toContain('--zc-footer-height: 40px')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Footer, { props: { tag: 'div' } })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders slot content', () => {
    const wrapper = mount(Footer, {
      slots: { default: '<span>Footer text</span>' },
    })
    expect(wrapper.text()).toContain('Footer text')
  })
})

describe('ZcContainer full layout integration', () => {
  it('renders complete page layout with all components', () => {
    const wrapper = mount({
      components: { Container, Header, Aside, Main, Footer },
      template: `
        <Container direction="vertical">
          <Header>Header</Header>
          <Container direction="horizontal">
            <Aside width="200px">Aside</Aside>
            <Main>Main</Main>
          </Container>
          <Footer>Footer</Footer>
        </Container>
      `,
    })

    expect(wrapper.find('.zc-header').exists()).toBe(true)
    expect(wrapper.find('.zc-aside').exists()).toBe(true)
    expect(wrapper.find('.zc-main').exists()).toBe(true)
    expect(wrapper.find('.zc-footer').exists()).toBe(true)
    expect(wrapper.findAll('.zc-container')).toHaveLength(2)
    expect(wrapper.text()).toContain('Header')
    expect(wrapper.text()).toContain('Aside')
    expect(wrapper.text()).toContain('Main')
    expect(wrapper.text()).toContain('Footer')
  })
})
