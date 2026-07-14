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
import ZcSelect from '../../packages/components/src/select/select.vue'
import ZcTable from '../../packages/components/src/table/table.vue'
import ZcCheckbox from '../../packages/components/src/checkbox/checkbox.vue'
import ZcRadio from '../../packages/components/src/radio/radio.vue'
import ZcForm from '../../packages/components/src/form/form.vue'
import ZcFormItem from '../../packages/components/src/form/form-item.vue'
import ZcPagination from '../../packages/components/src/pagination/pagination.vue'
import { ZcMessage } from '../../packages/components/src/message/message.ts'

const app = createApp({
  setup() {
    const dialogVisible = ref(false)
    const inputValue = ref('')
    const switchValue = ref(false)
    const selectValue = ref('')
    const checkboxValue = ref([])
    const radioValue = ref('')
    const currentPage = ref(1)
    const messageShown = ref('')

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
            h(
              ZcButton,
              { id: 'btn-disabled', disabled: true },
              () => 'Disabled'
            ),
          ]),
        ]),

        // --- Form Section ---
        h('section', { id: 'form-controls', class: 'demo-section' }, [
          h('h2', { class: 'demo-title' }, 'Form Controls'),
          h('div', { style: 'display: flex; flex-direction: column; gap: 12px; max-width: 400px;' }, [
            h(ZcInput, {
              id: 'test-input',
              placeholder: 'Enter text...',
              modelValue: inputValue.value,
              'onUpdate:modelValue': (v: string) => (inputValue.value = v),
            }),
            h('div', { style: 'display: flex; align-items: center; gap: 8px;' }, [
              h(ZcSwitch, {
                id: 'test-switch',
                modelValue: switchValue.value,
                'onUpdate:modelValue': (v: boolean) => (switchValue.value = v),
              }),
              h('span', () => `Switch: ${switchValue.value ? 'ON' : 'OFF'}`),
            ]),
            h(ZcCheckbox, {
              modelValue: checkboxValue.value.includes('apple'),
              'onUpdate:modelValue': (v: boolean) => {
                if (v) checkboxValue.value.push('apple')
                else checkboxValue.value = checkboxValue.value.filter((i) => i !== 'apple')
              },
            }, () => 'Apple'),
            h(ZcRadio, {
              modelValue: radioValue.value === 'option1',
              'onUpdate:modelValue': (v: boolean) => {
                if (v) radioValue.value = 'option1'
              },
            }, () => 'Option 1'),
          ]),
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
      ])
  },
})

app.mount('#app')
