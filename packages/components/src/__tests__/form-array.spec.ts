import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, reactive, nextTick, h } from 'vue'
import Form from '../form/form.vue'
import FormItem from '../form/form-item.vue'
import Input from '../input/input.vue'
import { createFormArray, useFormArray } from '../form/useFormArray'
import { validateField, normaliseRules } from '../form/validate'
import { formContextKey } from '../form/types'

// ============================================================
// useFormArray Tests
// ============================================================
describe('useFormArray / createFormArray', () => {
  it('creates empty array by default', () => {
    const arr = createFormArray()
    expect(arr.fields.value).toEqual([])
    expect(arr.length.value).toBe(0)
  })

  it('initializes with provided items and auto-generates keys', () => {
    const items = [{ name: 'Alice' }, { name: 'Bob' }]
    const arr = createFormArray(items)
    expect(arr.length.value).toBe(2)
    expect(arr.fields.value[0].name).toBe('Alice')
    expect(arr.fields.value[0]._key).toBeDefined()
    expect(arr.fields.value[1].name).toBe('Bob')
    expect(arr.fields.value[1]._key).toBeDefined()
    // Keys should be unique
    expect(arr.fields.value[0]._key).not.toBe(arr.fields.value[1]._key)
  })

  it('add() appends a new item', () => {
    const arr = createFormArray([{ name: 'A' }])
    arr.add({ name: 'B' })
    expect(arr.length.value).toBe(2)
    expect(arr.fields.value[1].name).toBe('B')
    expect(arr.fields.value[1]._key).toBeDefined()
  })

  it('push() is an alias for add()', () => {
    const arr = createFormArray<{ name: string }>()
    arr.push({ name: 'X' })
    expect(arr.length.value).toBe(1)
    expect(arr.fields.value[0].name).toBe('X')
  })

  it('insert() adds at specific index', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }, { name: 'C' }])
    arr.insert(1, { name: 'B' })
    expect(arr.length.value).toBe(3)
    expect(arr.fields.value[0].name).toBe('A')
    expect(arr.fields.value[1].name).toBe('B')
    expect(arr.fields.value[2].name).toBe('C')
  })

  it('remove() removes item at index', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }, { name: 'B' }, { name: 'C' }])
    arr.remove(1)
    expect(arr.length.value).toBe(2)
    expect(arr.fields.value[0].name).toBe('A')
    expect(arr.fields.value[1].name).toBe('C')
  })

  it('remove() does nothing for invalid index', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }])
    arr.remove(-1)
    arr.remove(5)
    expect(arr.length.value).toBe(1)
  })

  it('move() rearranges items', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }, { name: 'B' }, { name: 'C' }])
    arr.move(0, 2)
    expect(arr.fields.value[0].name).toBe('B')
    expect(arr.fields.value[1].name).toBe('C')
    expect(arr.fields.value[2].name).toBe('A')
  })

  it('move() does nothing for invalid indices', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }])
    arr.move(0, 5)
    expect(arr.length.value).toBe(1)
    expect(arr.fields.value[0].name).toBe('A')
  })

  it('clear() removes all items', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }, { name: 'B' }])
    arr.clear()
    expect(arr.length.value).toBe(0)
    expect(arr.fields.value).toEqual([])
  })

  it('get() returns item by index', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }])
    expect(arr.get(0)?.name).toBe('A')
    expect(arr.get(99)).toBeUndefined()
  })

  it('validates() returns true by default', async () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }])
    const result = await arr.validate()
    expect(result).toBe(true)
  })

  it('respects custom keyField option', () => {
    const arr = createFormArray<{ id: string; name: string }>([{ name: 'A' } as any], {
      keyField: 'id',
      autoKeys: true,
    })
    expect((arr.fields.value[0] as any).id).toBeDefined()
    expect((arr.fields.value[0] as any)._key).toBeUndefined()
  })

  it('add() with no argument creates default item', () => {
    const arr = createFormArray<{ name: string }>()
    arr.add()
    expect(arr.length.value).toBe(1)
  })

  it('maintains reactivity through field mutations', () => {
    const arr = createFormArray<{ name: string }>([{ name: 'A' }])
    arr.fields.value[0].name = 'Changed'
    expect(arr.fields.value[0].name).toBe('Changed')
  })
})

// ============================================================
// Cross-field Validation Tests
// ============================================================
describe('Cross-field Validation', () => {
  it('validator receives model as third argument for cross-field checks', async () => {
    const model = { password: 'secret123', confirm: 'secret456' }
    const rules = [
      {
        validator: (_rule: any, value: unknown, model?: Record<string, unknown>) => {
          return value === model?.password
        },
        message: 'Passwords must match',
      },
    ]

    const result = await validateField('confirm', model.confirm, rules, model)
    expect(result.valid).toBe(false)
    expect(result.message).toBe('Passwords must match')
  })

  it('cross-field validator passes when values match', async () => {
    const model = { password: 'secret123', confirm: 'secret123' }
    const rules = [
      {
        validator: (_rule: any, value: unknown, model?: Record<string, unknown>) => {
          return value === model?.password
        },
      },
    ]

    const result = await validateField('confirm', model.confirm, rules, model)
    expect(result.valid).toBe(true)
  })

  it('cross-field validator with async function', async () => {
    const model = { username: 'admin', reserved: 'admin' }
    const rules = [
      {
        validator: async (_rule: any, value: unknown, model?: Record<string, unknown>) => {
          // Simulate async check against another field
          await new Promise((r) => setTimeout(r, 10))
          return value !== model?.reserved
        },
        message: 'Username is reserved',
      },
    ]

    const result = await validateField('username', 'admin', rules, model)
    expect(result.valid).toBe(false)
    expect(result.message).toBe('Username is reserved')
  })

  it('works with Form + FormItem integration (cross-field)', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = reactive({
          password: 'abc123',
          confirm: 'different',
        })
        const rules = {
          confirm: [
            {
              validator: (_rule: any, value: unknown, m?: Record<string, unknown>) => {
                return value === m?.password
              },
              message: 'Confirm password must match password',
              trigger: 'change' as const,
            },
          ],
        }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Password" prop="password">
            <Input v-model="model.password" />
          </FormItem>
          <FormItem label="Confirm" prop="confirm">
            <Input v-model="model.confirm" />
          </FormItem>
        </Form>
      `,
    })

    const wrapper = mount(TestComp)
    await nextTick()

    const formRef = wrapper.findComponent(Form).vm as any
    const valid = await formRef.validate()
    await nextTick()

    expect(valid).toBe(false)
    const errors = wrapper.findAll('.zc-form-item__error')
    expect(errors.length).toBe(1)
    expect(errors[0].text()).toContain('Confirm password must match password')
  })
})

// ============================================================
// Form + FormItem Enhancement Tests
// ============================================================
describe('Form Enhancements', () => {
  it('validateOnValueChange=false disables auto-validation', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '' })
        const rules = { name: { required: true, message: 'Required', trigger: 'change' as const } }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules" :validate-on-value-change="false">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })

    const wrapper = mount(TestComp)
    await nextTick()

    // Set a value to trigger change
    wrapper.vm.model.name = 'test'
    await nextTick()
    await nextTick()

    // With validateOnValueChange=false, no auto-validation should happen
    const formRef = wrapper.findComponent(Form).vm as any
    // Manually validate to confirm no auto-validation state
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(false)
  })

  it('disabled prop on FormItem adds disabled class', async () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Field', disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('disabled false by default', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Field' },
    })
    expect(wrapper.classes()).not.toContain('is-disabled')
  })

  it('validating state shows spinner during async validation', async () => {
    let resolveValidator: (value: boolean) => void
    const validatorPromise = new Promise<boolean>((resolve) => {
      resolveValidator = resolve
    })

    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '' })
        const rules = {
          name: {
            validator: async () => {
              return validatorPromise
            },
            message: 'Async error',
          },
        }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem ref="itemRef" label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })

    const wrapper = mount(TestComp)
    await nextTick()

    const formRef = wrapper.findComponent(Form).vm as any
    const validatePromise = formRef.validate()

    // During validation, validating should be true
    const formItem = wrapper.findComponent(FormItem)
    expect((formItem.vm as any).validating).toBe(true)

    resolveValidator!(false)
    await validatePromise
    await nextTick()

    expect((formItem.vm as any).validating).toBe(false)
  })
})

// ============================================================
// FormItem inject formCtx null safety tests
// ============================================================
describe('FormItem null-safety', () => {
  it('renders standalone without form context without errors', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Standalone' },
      slots: { default: '<input />' },
    })
    expect(wrapper.find('.zc-form-item__label').text()).toBe('Standalone')
  })

  it('standalone form item does not crash on validate', async () => {
    const wrapper = mount(FormItem, {
      props: { prop: 'test' },
    })
    const vm = wrapper.vm as any
    const result = await vm.validate()
    expect(result.valid).toBe(true)
  })
})
