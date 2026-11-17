/**
 * E2E Test Playground - Mounts ZC UI components for Playwright testing
 *
 * This file creates a Vue app with various component demos that are used
 * for E2E tests, visual regression, and accessibility scanning.
 */
import { createApp, h, ref } from 'vue'
import ZcButton from '../../packages/components/src/button/button.vue'
import ZcInput from '../../packages/components/src/input/input.vue'
import ZcSwitch from '../../packages/components/src/switch/switch.vue'
import ZcDialog from '../../packages/components/src/dialog/dialog.vue'
import ZcTag from '../../packages/components/src/tag/tag.vue'
import ZcTable from '../../packages/components/src/table/table.vue'
import ZcCheckbox from '../../packages/components/src/checkbox/checkbox.vue'
import ZcRadio from '../../packages/components/src/radio/radio.vue'
import ZcPagination from '../../packages/components/src/pagination/pagination.vue'
import { ZcMessage } from '../../packages/components/src/message/message'
import ZcMenu from '../../packages/components/src/menu/menu.vue'
import ZcMenuItem from '../../packages/components/src/menu/menu-item.vue'
import ZcSubmenu from '../../packages/components/src/menu/submenu.vue'

const app = createApp({
  setup() {
    const dialogVisible = ref(false)
    const inputValue = ref('')
    const switchValue = ref(false)
    const checkboxValue = ref<string[]>([])
    const radioValue = ref('')
    const currentPage = ref(1)
    const messageShown = ref('')
    const menuActive = ref('1')
    const menuCollapsed = ref(true)

    const tableData = ref(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'Member',
      }))
    )

    const columns = [
      { prop: 'id', label: 'ID', width: 80 },
      { prop: 'name', label: 'Name' },
      { prop: 'email', label: 'Email' },
      { prop: 'role', label: 'Role' },
    ]

    const showMessage = (type: string) => {
      ZcMessage({ message: `This is a ${type} message`, type: type as any })
      messageShown.value = type
    }

    return () =>
      h('div', { id: 'app-content' }, [
        // --- Button Section ---
        h('section', { id: 'buttons', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Buttons'),
          h('div', { style: 'display: flex; gap: 8px; flex-wrap: wrap;' }, [
            h(ZcButton, { id: 'btn-default' }, () => 'Default'),
            h(ZcButton, { id: 'btn-primary', type: 'primary' }, () => 'Primary'),
            h(ZcButton, { id: 'btn-success', type: 'success' }, () => 'Success'),
            h(ZcButton, { id: 'btn-warning', type: 'warning' }, () => 'Warning'),
            h(ZcButton, { id: 'btn-danger', type: 'danger' }, () => 'Danger'),
            h(ZcButton, { id: 'btn-disabled', disabled: true }, () => 'Disabled'),
          ]),
        ]),

        // --- Form Section ---
        h('section', { id: 'form-controls', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Form Controls'),
          h(
            'div',
            { style: 'display: flex; flex-direction: column; gap: 12px; max-width: 400px;' },
            [
              h(ZcInput, {
                id: 'test-input',
                placeholder: 'Enter text...',
                modelValue: inputValue.value,
                'onUpdate:modelValue': (v: string | number) => (inputValue.value = String(v)),
              }),
              h('div', { style: 'display: flex; align-items: center; gap: 8px;' }, [
                h(ZcSwitch, {
                  id: 'test-switch',
                  modelValue: switchValue.value,
                  'onUpdate:modelValue': (v: boolean) => (switchValue.value = v),
                }),
                h('span', { style: 'margin-left: 8px;' }, [
                  `Switch: ${switchValue.value ? 'ON' : 'OFF'}`,
                ]),
              ]),
              h(
                ZcCheckbox,
                {
                  modelValue: checkboxValue.value.includes('apple'),
                  'onUpdate:modelValue': (v: boolean) => {
                    if (v) checkboxValue.value.push('apple')
                    else
                      checkboxValue.value = checkboxValue.value.filter((i: string) => i !== 'apple')
                  },
                },
                () => 'Apple'
              ),
              h(
                ZcRadio,
                {
                  modelValue: radioValue.value === 'option1',
                  'onUpdate:modelValue': (v: string | number | boolean) => {
                    if (v) radioValue.value = 'option1'
                  },
                },
                () => 'Option 1'
              ),
            ]
          ),
        ]),

        // --- Tag Section ---
        h('section', { id: 'tags', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Tags'),
          h('div', { style: 'display: flex; gap: 8px; flex-wrap: wrap;' }, [
            h(ZcTag, () => 'Default'),
            h(ZcTag, { type: 'success' }, () => 'Success'),
            h(ZcTag, { type: 'warning' }, () => 'Warning'),
            h(ZcTag, { type: 'danger' }, () => 'Danger'),
          ]),
        ]),

        // --- Table Section ---
        h('section', { id: 'table', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Table'),
          h(ZcTable, {
            data: tableData.value,
            columns,
          }),
        ]),

        // --- Dialog Section ---
        h('section', { id: 'dialog', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Dialog'),
          h(
            ZcButton,
            {
              id: 'open-dialog',
              type: 'primary',
              onClick: () => (dialogVisible.value = true),
            },
            () => 'Open Dialog'
          ),
          h(
            ZcDialog,
            {
              modelValue: dialogVisible.value,
              'onUpdate:modelValue': (v: boolean) => (dialogVisible.value = v),
              title: 'Test Dialog',
              width: '400px',
            },
            () => h('p', () => 'This is a dialog content for testing.')
          ),
        ]),

        // --- Message Section ---
        h('section', { id: 'message', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Message'),
          h('div', { style: 'display: flex; gap: 8px;' }, [
            h(
              ZcButton,
              {
                id: 'msg-success',
                onClick: () => showMessage('success'),
              },
              () => 'Success Message'
            ),
            h(
              ZcButton,
              {
                id: 'msg-warning',
                onClick: () => showMessage('warning'),
              },
              () => 'Warning Message'
            ),
            h(
              ZcButton,
              {
                id: 'msg-error',
                onClick: () => showMessage('error'),
              },
              () => 'Error Message'
            ),
          ]),
        ]),

        // --- Pagination Section ---
        h('section', { id: 'pagination', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Pagination'),
          h(ZcPagination, {
            total: 100,
            pageSize: 10,
            currentPage: currentPage.value,
            'onUpdate:currentPage': (v: number) => (currentPage.value = v),
          }),
        ]),

        // --- Menu Section ---
        // Icons are span-wrapped (same shape as ZcIconName in the docs) to
        // guard the collapse-mode CSS: text spans must be hidden while
        // span-wrapped icons stay visible and centered.
        h('section', { id: 'menu', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Menu'),
          h(
            ZcMenu,
            {
              id: 'menu-collapsed',
              mode: 'vertical',
              defaultActive: menuActive.value,
              collapse: menuCollapsed.value,
            },
            () => [
              h(ZcMenuItem, { index: '1' }, () => [
                h(
                  'span',
                  {
                    id: 'menu-icon-home',
                    style: 'width: 18px; height: 18px; display: inline-flex;',
                    'aria-label': 'home',
                    role: 'img',
                  },
                  [
                    h(
                      'svg',
                      {
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': 2,
                        style: 'width: 100%; height: 100%;',
                      },
                      h('path', { d: 'M3 12 L12 3 L21 12' })
                    ),
                  ]
                ),
                h('span', { class: 'menu-item-label' }, '首页'),
              ]),
              h(
                ZcSubmenu,
                { index: '2' },
                {
                  title: () => [
                    h(
                      'span',
                      {
                        id: 'menu-icon-star',
                        style: 'width: 18px; height: 18px; display: inline-flex;',
                        'aria-label': 'star',
                        role: 'img',
                      },
                      [
                        h(
                          'svg',
                          {
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-width': 2,
                            style: 'width: 100%; height: 100%;',
                          },
                          h('path', {
                            d: 'M12 2 L15 9 L22 9 L17 14 L19 21 L12 17 L5 21 L7 14 L2 9 L9 9 Z',
                          })
                        ),
                      ]
                    ),
                    h('span', { class: 'menu-item-label' }, '管理'),
                  ],
                  default: () => [
                    h(ZcMenuItem, { index: '2-1' }, () => '用户'),
                    h(ZcMenuItem, { index: '2-2' }, () => '设置'),
                  ],
                }
              ),
            ]
          ),
          // Vertical expanded submenu: children must flatten into the
          // sidebar (no card chrome) and indent by nesting depth.
          h(
            ZcMenu,
            {
              id: 'menu-expanded',
              mode: 'vertical',
              defaultActive: '1',
            },
            () => [
              h(ZcMenuItem, { index: '1' }, () => '首页'),
              h(
                ZcSubmenu,
                { index: '2' },
                {
                  title: () => '系统管理',
                  default: () => [
                    h(ZcMenuItem, { index: '2-1' }, () => '用户管理'),
                    h(
                      ZcSubmenu,
                      { index: '2-2' },
                      {
                        title: () => '安全设置',
                        default: () => [
                          h(ZcMenuItem, { index: '2-2-1' }, () => '登录日志'),
                          h(ZcMenuItem, { index: '2-2-2' }, () => '操作日志'),
                        ],
                      }
                    ),
                  ],
                }
              ),
              h(ZcMenuItem, { index: '3' }, () => '数据分析'),
            ]
          ),
          // Custom dark sidebar colors: text-color/active-text-color must
          // reach submenu titles too (docs "自定义颜色" demo).
          h(
            ZcMenu,
            {
              id: 'menu-dark',
              mode: 'vertical',
              defaultActive: '2-1',
              backgroundColor: '#1f2d3d',
              textColor: '#bfcbd9',
              activeTextColor: '#409eff',
            },
            () => [
              h(ZcMenuItem, { index: '1' }, () => '首页'),
              h(
                ZcSubmenu,
                { index: '2' },
                {
                  title: () => '系统管理',
                  default: () => [
                    h(ZcMenuItem, { index: '2-1' }, () => '用户管理'),
                    h(ZcMenuItem, { index: '2-2' }, () => '角色管理'),
                  ],
                }
              ),
              h(ZcMenuItem, { index: '3' }, () => '日志'),
            ]
          ),
          // Horizontal click-trigger popups: opening one submenu must close
          // the sibling's popup so the two panels never stay open together.
          h(
            ZcMenu,
            {
              id: 'menu-horiz-click',
              mode: 'horizontal',
              defaultActive: '1',
              menuTrigger: 'click',
            },
            () => [
              h(ZcMenuItem, { index: '1' }, () => '首页'),
              h(
                ZcSubmenu,
                { index: '2' },
                {
                  title: () => '组件',
                  default: () => [
                    h(ZcMenuItem, { index: '2-1' }, () => '基础组件'),
                    h(ZcMenuItem, { index: '2-2' }, () => '表单组件'),
                  ],
                }
              ),
              h(
                ZcSubmenu,
                { index: '3' },
                {
                  title: () => '文档',
                  default: () => [
                    h(ZcMenuItem, { index: '3-1' }, () => '快速上手'),
                    h(ZcMenuItem, { index: '3-2' }, () => '主题定制'),
                  ],
                }
              ),
            ]
          ),
        ]),
      ])
  },
})

app.mount('#app')
