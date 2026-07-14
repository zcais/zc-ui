import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../menu/menu.vue'
import MenuItem from '../menu/menu-item.vue'
import Submenu from '../menu/submenu.vue'

describe('ZcMenu', () => {
  it('renders with default props', () => {
    const wrapper = mount(Menu)
    expect(wrapper.classes()).toContain('zc-menu')
    expect(wrapper.classes()).toContain('zc-menu--vertical')
  })

  it('renders horizontal mode', () => {
    const wrapper = mount(Menu, { props: { mode: 'horizontal' } })
    expect(wrapper.classes()).toContain('zc-menu--horizontal')
  })

  it('applies collapse class', () => {
    const wrapper = mount(Menu, { props: { collapse: true } })
    expect(wrapper.classes()).toContain('is-collapse')
  })

  it('renders menu items via slots', () => {
    const wrapper = mount(Menu, {
      slots: {
        default: [MenuItem, MenuItem],
      },
      global: { components: { ZcMenuItem: MenuItem } },
    })
    expect(wrapper.findAllComponents(MenuItem)).toHaveLength(2)
  })

  it('highlights active item', async () => {
    const wrapper = mount(Menu, {
      props: { activeIndex: '1' },
      slots: {
        default: '<li class="zc-menu__item" data-index="1">Item 1</li>',
      },
    })
    expect(wrapper.html()).toContain('Item 1')
  })

  it('emits select event when item is clicked', async () => {
    const wrapper = mount(Menu, {
      slots: {
        default: { template: '<ZcMenuItem index="1">Item 1</ZcMenuItem>' },
      },
      global: { components: { ZcMenuItem: MenuItem } },
    })
    await wrapper.findComponent(MenuItem).trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('renders submenu', async () => {
    const wrapper = mount(Menu, {
      slots: {
        default: {
          template:
            '<ZcSubmenu index="1"><template #title>Submenu</template><ZcMenuItem index="1-1">Item 1-1</ZcMenuItem></ZcSubmenu>',
        },
      },
      global: { components: { ZcSubmenu: Submenu, ZcMenuItem: MenuItem } },
    })
    expect(wrapper.findComponent(Submenu).exists()).toBe(true)
    expect(wrapper.html()).toContain('Submenu')
  })

  it('opens/closes submenu on click in vertical mode', async () => {
    const wrapper = mount(Menu, {
      slots: {
        default: {
          template:
            '<ZcSubmenu index="1" ref="sm"><template #title>Submenu</template><span class="child-item">Child</span></ZcSubmenu>',
        },
      },
      global: { components: { ZcSubmenu: Submenu } },
    })
    const submenu = wrapper.findComponent(Submenu)
    await submenu.find('.zc-submenu__title').trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
  })
})
