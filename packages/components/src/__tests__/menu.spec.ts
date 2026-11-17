import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Menu from '../menu/menu.vue'
import MenuItem from '../menu/menu-item.vue'
import Submenu from '../menu/submenu.vue'
import MenuItemGroup from '../menu/menu-item-group.vue'

const globalComponents = {
  global: {
    components: { ZcMenuItem: MenuItem, ZcSubmenu: Submenu, ZcMenuItemGroup: MenuItemGroup },
  },
}

const submenuTemplate = `
  <ZcMenuItem index="1">首页</ZcMenuItem>
  <ZcSubmenu index="2">
    <template #title>系统管理</template>
    <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
    <ZcMenuItem index="2-2">角色管理</ZcMenuItem>
  </ZcSubmenu>
  <ZcSubmenu index="3">
    <template #title>数据分析</template>
    <ZcMenuItem index="3-1">概览</ZcMenuItem>
  </ZcSubmenu>
`

function mountMenu(template: string, props: Record<string, unknown> = {}) {
  return mount(Menu, {
    props,
    slots: { default: { template } },
    ...globalComponents,
  })
}

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
      slots: { default: [MenuItem, MenuItem] },
      ...globalComponents,
    })
    expect(wrapper.findAllComponents(MenuItem)).toHaveLength(2)
  })

  it('highlights the item matching activeIndex', async () => {
    const wrapper = mountMenu(
      `<ZcMenuItem index="1">Item 1</ZcMenuItem><ZcMenuItem index="2">Item 2</ZcMenuItem>`,
      { activeIndex: '1' }
    )
    const items = wrapper.findAll('.zc-menu__item')
    expect(items[0].classes()).toContain('is-active')
    expect(items[1].classes()).not.toContain('is-active')

    await items[1].trigger('click')
    expect(items[1].classes()).toContain('is-active')
    expect(items[0].classes()).not.toContain('is-active')
  })

  it('responds to external activeIndex prop changes', async () => {
    const wrapper = mountMenu(
      `<ZcMenuItem index="1">Item 1</ZcMenuItem><ZcMenuItem index="2">Item 2</ZcMenuItem>`,
      { activeIndex: '1' }
    )
    await wrapper.setProps({ activeIndex: '2' })
    const items = wrapper.findAll('.zc-menu__item')
    expect(items[0].classes()).not.toContain('is-active')
    expect(items[1].classes()).toContain('is-active')
  })

  it('emits select with real indexPath for nested items', async () => {
    const wrapper = mountMenu(submenuTemplate)
    await wrapper.find('.zc-submenu__title').trigger('click')
    const subItem = wrapper.findAll('.zc-menu__item').find((i) => i.text() === '用户管理')!
    await subItem.trigger('click')
    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['2-1', ['2', '2-1']])
  })

  it('does not select a disabled item', async () => {
    const wrapper = mountMenu(
      `<ZcMenuItem index="1" disabled>禁用项</ZcMenuItem><ZcMenuItem index="2">可用项</ZcMenuItem>`
    )
    await wrapper.findAll('.zc-menu__item')[0].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    await wrapper.findAll('.zc-menu__item')[1].trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('does not emit active styles without menu context (standalone item)', () => {
    const wrapper = mount(MenuItem, { props: { index: '1' }, slots: { default: '独立' } })
    expect(wrapper.classes()).toContain('zc-menu__item')
    expect(wrapper.attributes('role')).toBe('menuitem')
  })

  it('opens/closes submenu on click in vertical mode', async () => {
    const wrapper = mountMenu(submenuTemplate)
    const title = wrapper.find('.zc-submenu__title')
    await title.trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
    expect(wrapper.emitted('open')![0]).toEqual(['2', ['2']])
    await title.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')![0]).toEqual(['2', ['2']])
  })

  it('keeps only one submenu open when uniqueOpened', async () => {
    const wrapper = mountMenu(submenuTemplate, { uniqueOpened: true })
    const titles = wrapper.findAll('.zc-submenu__title')
    await titles[0].trigger('click')
    await titles[1].trigger('click')
    const opened = wrapper.findAll('.zc-submenu.is-opened')
    expect(opened).toHaveLength(1)
    expect(opened[0].text()).toContain('数据分析')
  })

  it('closes popup submenus after selecting an item (horizontal)', async () => {
    vi.useFakeTimers()
    const wrapper = mountMenu(submenuTemplate, { mode: 'horizontal' })
    const submenuRoot = wrapper.find('.zc-submenu')
    await submenuRoot.trigger('mouseenter')
    vi.advanceTimersByTime(350)
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    const subItem = wrapper.findAll('.zc-menu__item').find((i) => i.text() === '用户管理')!
    await subItem.trigger('click')
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
    vi.useRealTimers()
  })

  it('opens submenu via hover in horizontal mode with delay', async () => {
    vi.useFakeTimers()
    const wrapper = mountMenu(submenuTemplate, { mode: 'horizontal' })
    const submenuRoot = wrapper.find('.zc-submenu')
    await submenuRoot.trigger('mouseenter')
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
    vi.advanceTimersByTime(350)
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    await submenuRoot.trigger('mouseleave')
    vi.advanceTimersByTime(350)
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
    vi.useRealTimers()
  })

  it('opens submenu in collapsed vertical mode via click (popup)', async () => {
    const wrapper = mountMenu(submenuTemplate, { collapse: true })
    const title = wrapper.find('.zc-submenu__title')
    await title.trigger('click')
    expect(wrapper.emitted('open')).toBeTruthy()
    const popup = wrapper.find('.zc-submenu__children--popup')
    expect(popup.exists()).toBe(true)
    expect(popup.isVisible()).toBe(true)
  })

  it('renders popup class on submenu children', async () => {
    const wrapper = mountMenu(
      `<ZcSubmenu index="2" popper-class="my-popper"><template #title>管理</template><ZcMenuItem index="2-1">用户</ZcMenuItem></ZcSubmenu>`,
      { mode: 'horizontal' }
    )
    await wrapper.find('.zc-submenu__title').trigger('click')
    expect(wrapper.find('.my-popper').exists()).toBe(true)
  })

  it('exposes custom colors as root CSS variables consumed by items and submenu titles', async () => {
    const wrapper = mountMenu(
      `<ZcMenuItem index="1">首页</ZcMenuItem><ZcSubmenu index="2"><template #title>系统</template><ZcMenuItem index="2-1">用户</ZcMenuItem></ZcSubmenu>`,
      {
        activeIndex: '1',
        textColor: '#bfcbd9',
        activeTextColor: '#ffd04b',
        backgroundColor: '#1f2d3d',
      }
    )
    const style = wrapper.find('.zc-menu').attributes('style') ?? ''
    // Colors are delegated through CSS variables on the menu root (same
    // approach as Element Plus useMenuCssVar) so submenu titles inherit too.
    expect(style).toContain('--zc-menu-text-color: #bfcbd9')
    expect(style).toContain('--zc-menu-active-color: #ffd04b')
    expect(style).toContain('background-color: rgb(31, 45, 61)')
    // hover bg is derived by shading the custom background 20% darker
    expect(style).toContain('--zc-menu-hover-bg-color: rgb(25, 36, 49)')
    // items/submenu titles no longer carry per-node inline colors
    expect(wrapper.findAll('.zc-menu__item')[0].attributes('style')).toBeUndefined()
    expect(wrapper.find('.zc-submenu__title').attributes('style')).toBeUndefined()
  })

  it('supports keyboard activation on submenu title', async () => {
    const wrapper = mountMenu(submenuTemplate)
    await wrapper.find('.zc-submenu__title').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('does not open a disabled submenu', async () => {
    const wrapper = mountMenu(
      `<ZcSubmenu index="2" disabled><template #title>禁用</template><ZcMenuItem index="2-1">用户</ZcMenuItem></ZcSubmenu>`
    )
    await wrapper.find('.zc-submenu__title').trigger('click')
    expect(wrapper.emitted('open')).toBeUndefined()
  })

  // ---- Element Plus API alignment ----

  it('supports default-active as the EP-compatible prop name', async () => {
    const wrapper = mountMenu(
      `<ZcMenuItem index="1">Item 1</ZcMenuItem><ZcMenuItem index="2">Item 2</ZcMenuItem>`,
      { defaultActive: '2' }
    )
    const items = wrapper.findAll('.zc-menu__item')
    expect(items[1].classes()).toContain('is-active')
    await wrapper.setProps({ defaultActive: '1' })
    expect(wrapper.findAll('.zc-menu__item')[0].classes()).toContain('is-active')
  })

  it('opens horizontal submenu by click when menu-trigger is click', async () => {
    const wrapper = mountMenu(submenuTemplate, { mode: 'horizontal', menuTrigger: 'click' })
    const submenuRoot = wrapper.find('.zc-submenu')
    // hover must NOT open it anymore
    await submenuRoot.trigger('mouseenter')
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
    // click toggles it open
    await wrapper.find('.zc-submenu__title').trigger('click')
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    // click again toggles it closed
    await wrapper.find('.zc-submenu__title').trigger('click')
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
  })

  it('closes the previous popup when opening another one (click trigger)', async () => {
    const wrapper = mountMenu(submenuTemplate, { mode: 'horizontal', menuTrigger: 'click' })
    const titles = wrapper.findAll('.zc-submenu__title')
    await titles[0].trigger('click')
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    // open the sibling submenu — the first popup must close so panels
    // never overlap
    await titles[1].trigger('click')
    const opened = wrapper.findAll('.zc-submenu.is-opened')
    expect(opened).toHaveLength(1)
    expect(opened[0].text()).toContain('数据分析')
    expect(wrapper.emitted('close')![0]).toEqual(['2', ['2']])
  })

  it('closes the previous popup when hovering another one (hover trigger)', async () => {
    vi.useFakeTimers()
    const wrapper = mountMenu(submenuTemplate, { mode: 'horizontal' })
    const submenuRoots = wrapper.findAll('.zc-submenu')
    await submenuRoots[0].trigger('mouseenter')
    vi.advanceTimersByTime(350)
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    // move to the sibling submenu — the first popup must close
    await submenuRoots[1].trigger('mouseenter')
    vi.advanceTimersByTime(350)
    await nextTick()
    const opened = wrapper.findAll('.zc-submenu.is-opened')
    expect(opened).toHaveLength(1)
    expect(opened[0].text()).toContain('数据分析')
    vi.useRealTimers()
  })

  it('renders menu item groups with a title and denser items', () => {
    const wrapper = mountMenu(
      `<ZcMenuItemGroup title="分组一">
         <ZcMenuItem index="1-1">选项一</ZcMenuItem>
         <ZcMenuItem index="1-2">选项二</ZcMenuItem>
       </ZcMenuItemGroup>`
    )
    const group = wrapper.find('.zc-menu-item-group')
    expect(group.exists()).toBe(true)
    expect(group.find('.zc-menu-item-group__title').text()).toBe('分组一')
    expect(group.findAll('.zc-menu__item')).toHaveLength(2)
  })

  it('renders the group title slot when provided', () => {
    const wrapper = mountMenu(
      `<ZcMenuItemGroup><template #title>自定义标题</template><ZcMenuItem index="1-1">A</ZcMenuItem></ZcMenuItemGroup>`
    )
    expect(wrapper.find('.zc-menu-item-group__title').text()).toBe('自定义标题')
  })

  it('navigates via router in router mode (route prop wins)', async () => {
    const push = vi.fn()
    const wrapper = mount(Menu, {
      props: { router: true },
      slots: {
        default: {
          template: `<ZcMenuItem index="home" route="/home-page">首页</ZcMenuItem>`,
        },
      },
      global: {
        components: { ZcMenuItem: MenuItem },
        config: { globalProperties: { $router: { push } } },
      },
    })
    await wrapper.find('.zc-menu__item').trigger('click')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/home-page')
  })

  it('navigates to index when no route is given (router mode)', async () => {
    const push = vi.fn()
    const wrapper = mount(Menu, {
      props: { router: true },
      slots: {
        default: { template: `<ZcMenuItem index="profile">个人中心</ZcMenuItem>` },
      },
      global: {
        components: { ZcMenuItem: MenuItem },
        config: { globalProperties: { $router: { push } } },
      },
    })
    await wrapper.find('.zc-menu__item').trigger('click')
    expect(push).toHaveBeenCalledWith('profile')
  })

  it('navigates from a nested item inside a submenu (router mode)', async () => {
    const push = vi.fn()
    const wrapper = mount(Menu, {
      props: { router: true },
      slots: {
        default: {
          template: `<ZcSubmenu index="1"><template #title>管理</template><ZcMenuItem index="1-1" route="/users">用户</ZcMenuItem></ZcSubmenu>`,
        },
      },
      global: {
        components: { ZcSubmenu: Submenu, ZcMenuItem: MenuItem },
        config: { globalProperties: { $router: { push } } },
      },
    })
    await wrapper.find('.zc-menu__item').trigger('click')
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/users')
  })

  it('does not navigate when router mode is off', async () => {
    const push = vi.fn()
    const wrapper = mount(Menu, {
      slots: {
        default: { template: `<ZcMenuItem index="home">首页</ZcMenuItem>` },
      },
      global: {
        components: { ZcMenuItem: MenuItem },
        mocks: { $router: { push } },
      },
    })
    await wrapper.find('.zc-menu__item').trigger('click')
    expect(push).not.toHaveBeenCalled()
  })

  it('does not crash without a router instance in router mode', async () => {
    const wrapper = mountMenu(`<ZcMenuItem index="home">首页</ZcMenuItem>`, { router: true })
    await wrapper.find('.zc-menu__item').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('exposes open/close instance methods', async () => {
    const wrapper = mountMenu(submenuTemplate)
    wrapper.vm.open('2')
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(1)
    wrapper.vm.close('2')
    await nextTick()
    expect(wrapper.findAll('.zc-submenu.is-opened')).toHaveLength(0)
  })

  it('applies dark popper effect class to popup children', async () => {
    const wrapper = mountMenu(submenuTemplate, {
      mode: 'horizontal',
      popperEffect: 'dark',
    })
    const submenuRoot = wrapper.find('.zc-submenu')
    await submenuRoot.trigger('mouseenter')
    vi.useFakeTimers()
    vi.advanceTimersByTime(350)
    await nextTick()
    const popup = wrapper.find('.zc-submenu__children--popup')
    expect(popup.classes()).toContain('zc-submenu--dark')
    vi.useRealTimers()
  })
})
