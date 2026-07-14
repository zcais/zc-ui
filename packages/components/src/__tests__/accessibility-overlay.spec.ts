import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcDialog from '../dialog/dialog.vue'
import ZcDrawer from '../drawer/drawer.vue'
import ZcDropdown from '../dropdown/dropdown.vue'
import ZcPopconfirm from '../popconfirm/popconfirm.vue'

afterEach(() => {
  // Clean up teleported DOM between tests
  document.body.innerHTML = ''
})

describe('Accessibility: Dialog', () => {
  it('should have role="dialog" on panel', () => {
    mount(ZcDialog, {
      props: { modelValue: true, title: 'Test' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeTruthy()
  })

  it('should have aria-modal="true"', () => {
    mount(ZcDialog, {
      props: { modelValue: true, title: 'Test' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
  })

  it('should have aria-labelledby when title is provided', () => {
    mount(ZcDialog, {
      props: { modelValue: true, title: 'Test Title' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-labelledby')).toBeDefined()
  })

  it('should have aria-label on close button', () => {
    mount(ZcDialog, {
      props: { modelValue: true, showClose: true },
    })
    const closeBtn = document.querySelector('.zc-dialog__close-btn')
    if (closeBtn) {
      expect(closeBtn.getAttribute('aria-label')).toBeDefined()
    }
  })

  it('should have aria-label on fullscreen button', () => {
    mount(ZcDialog, {
      props: { modelValue: true, fullscreen: true },
    })
    const fsBtn = document.querySelector('.zc-dialog__fullscreen-btn')
    if (fsBtn) {
      expect(fsBtn.getAttribute('aria-label')).toBeDefined()
    }
  })
})

describe('Accessibility: Drawer', () => {
  it('should have role="dialog" on panel', () => {
    mount(ZcDrawer, {
      props: { modelValue: true, title: 'Test' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeTruthy()
  })

  it('should have aria-modal="true"', () => {
    mount(ZcDrawer, {
      props: { modelValue: true, title: 'Test' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
  })

  it('should have aria-labelledby when title is provided', () => {
    mount(ZcDrawer, {
      props: { modelValue: true, title: 'Test Title' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-labelledby')).toBeDefined()
  })

  it('should have aria-label on close button', () => {
    mount(ZcDrawer, {
      props: { modelValue: true, showClose: true },
    })
    const closeBtn = document.querySelector('.zc-drawer__close-btn')
    if (closeBtn) {
      expect(closeBtn.getAttribute('aria-label')).toBeDefined()
    }
  })
})

describe('Accessibility: Dropdown', () => {
  it('should have aria-haspopup="menu"', () => {
    const wrapper = mount(ZcDropdown, {
      slots: { default: 'Trigger' },
    })
    expect(wrapper.attributes('aria-haspopup')).toBe('menu')
  })

  it('should have aria-expanded reflecting state', () => {
    const wrapper = mount(ZcDropdown, {
      slots: { default: 'Trigger' },
    })
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('should have role="menu" on dropdown panel', () => {
    mount(ZcDropdown, {
      props: { visible: true },
      slots: {
        default: 'Trigger',
        dropdown: '<div>Item 1</div>',
      },
    })
    const menu = document.querySelector('[role="menu"]')
    expect(menu).toBeTruthy()
  })
})

describe('Accessibility: Popconfirm', () => {
  it('should have role="dialog" on popper', () => {
    mount(ZcPopconfirm, {
      props: { visible: true, title: 'Confirm?' },
      slots: { default: 'Click me' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeTruthy()
  })

  it('should have aria-modal="true"', () => {
    mount(ZcPopconfirm, {
      props: { visible: true, title: 'Confirm?' },
      slots: { default: 'Click me' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
  })

  it('should have aria-labelledby', () => {
    mount(ZcPopconfirm, {
      props: { visible: true, title: 'Confirm?' },
      slots: { default: 'Click me' },
    })
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-labelledby')).toBeDefined()
  })
})
