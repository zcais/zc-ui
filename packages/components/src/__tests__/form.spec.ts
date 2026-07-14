import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import Form from '../form/form.vue'
import FormItem from '../form/form-item.vue'
import Input from '../input/input.vue'

describe('ZcForm', () => {
  it('renders as a form element', () => {
    const wrapper = mount(Form, {
      props: { model: {} },
      slots: { default: '<div>content</div>' },
    })
    expect(wrapper.element.tagName).toBe('FORM')
    expect(wrapper.classes()).toContain('zc-form')
  })

  it('applies label position class', () => {
    const wrapper = mount(Form, {
      props: { model: {}, labelPosition: 'top' },
    })
    expect(wrapper.classes()).toContain('zc-form--label-top')
  })

  it('applies label position right by default', () => {
    const wrapper = mount(Form, { props: { model: {} } })
    expect(wrapper.classes()).toContain('zc-form--label-right')
  })

  it('applies inline class', () => {
    const wrapper = mount(Form, {
      props: { model: {}, inline: true },
    })
    expect(wrapper.classes()).toContain('is-inline')
  })
})

describe('ZcFormItem', () => {
  it('renders with zc-form-item class', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Name' },
    })
    expect(wrapper.classes()).toContain('zc-form-item')
  })

  it('renders label text', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Username' },
    })
    expect(wrapper.text()).toContain('Username')
  })

  it('renders label element', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Email' },
    })
    expect(wrapper.find('.zc-form-item__label').text()).toBe('Email')
  })

  it('shows required asterisk when required prop is set', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Field', required: true },
    })
    expect(wrapper.classes()).toContain('is-required')
  })

  it('does not show required asterisk by default', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Field' },
    })
    expect(wrapper.classes()).not.toContain('is-required')
  })

  it('applies label width style', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'X', labelWidth: 120 },
    })
    const label = wrapper.find('.zc-form-item__label')
    expect(label.attributes('style')).toContain('width: 120px')
  })

  it('renders default slot content', () => {
    const wrapper = mount(FormItem, {
      props: { label: 'Input' },
      slots: { default: '<input />' },
    })
    expect(wrapper.find('.zc-form-item__content input').exists()).toBe(true)
  })
})

describe('ZcForm + ZcFormItem Validation', () => {
  it('validates required field fails when empty', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '' })
        const rules = { name: { required: true, message: 'Name is required' } }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validate()
    expect(valid).toBe(false)
    expect(wrapper.find('.zc-form-item__error').text()).toContain('Name is required')
  })

  it('validates required field passes when value provided', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: 'John' })
        const rules = { name: { required: true, message: 'Name is required' } }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validate()
    expect(valid).toBe(true)
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(false)
  })

  it('validates min/max length rules', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: 'ab' })
        const rules = { name: { min: 3, max: 10, message: '3-10 chars' } }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validate()
    expect(valid).toBe(false)
    expect(wrapper.find('.zc-form-item__error').text()).toContain('3-10 chars')
  })

  it('validates pattern rules', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ email: 'not-an-email' })
        const rules = {
          email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Email" prop="email">
            <Input v-model="model.email" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validate()
    expect(valid).toBe(false)
    expect(wrapper.find('.zc-form-item__error').text()).toContain('Invalid email')
  })

  it('validates custom validator function', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ age: 5 })
        const rules = {
          age: {
            validator: (_rule: unknown, value: unknown) => (value as number) >= 18,
            message: 'Must be 18+',
          },
        }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Age" prop="age">
            <Input v-model="model.age" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validate()
    expect(valid).toBe(false)
    expect(wrapper.find('.zc-form-item__error').text()).toContain('Must be 18+')
  })

  it('validateField validates a specific field', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '', age: 25 })
        const rules = {
          name: { required: true, message: 'Name required' },
        }
        return { model, rules }
      },
      template: `
        <Form ref="formRef" :model="model" :rules="rules">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
          <FormItem label="Age" prop="age">
            <Input v-model="model.age" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    const formRef = wrapper.findComponent(Form).vm
    const valid = await formRef.validateField('name')
    expect(valid).toBe(false)
  })

  it('hides error messages when showMessage=false', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '' })
        const rules = { name: { required: true, message: 'Required' } }
        return { model, rules }
      },
      template: `
        <Form :model="model" :rules="rules" :show-message="false">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()
    // Trigger validation manually via form item
    const formItem = wrapper.findComponent(FormItem)
    await formItem.vm.validate()
    await wrapper.vm.$nextTick()
    // Error message should not be visible
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(false)
  })

  // ---- Bug #12: Form resetFields preserves validation system ----
  it('resetFields clears validation without breaking the validator system', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '' })
        const rules = { name: { required: true, message: 'Required' } }
        return { model, rules }
      },
      template: `
        <Form :model="model" :rules="rules" ref="formRef">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()

    // Validate (should show error)
    const form = wrapper.findComponent(Form)
    await form.vm.validate()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(true)

    // Reset fields
    form.vm.resetFields()
    await wrapper.vm.$nextTick()

    // Error should be cleared
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(false)

    // Validation should still work after reset
    await form.vm.validate()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.zc-form-item__error').exists()).toBe(true)
  })

  // ---- Bug #13: FormItem cleans up on unmount ----
  it('FormItem unregisters from form on unmount', async () => {
    const TestComp = defineComponent({
      components: { Form, FormItem, Input },
      setup() {
        const model = ref({ name: '', email: '' })
        const rules = {
          name: { required: true, message: 'Required' },
          email: { required: true, message: 'Required' },
        }
        const showEmail = ref(true)
        return { model, rules, showEmail }
      },
      template: `
        <Form :model="model" :rules="rules" ref="formRef">
          <FormItem label="Name" prop="name">
            <Input v-model="model.name" />
          </FormItem>
          <FormItem v-if="showEmail" label="Email" prop="email">
            <Input v-model="model.email" />
          </FormItem>
        </Form>
      `,
    })
    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()

    const form = wrapper.findComponent(Form)
    // Validate should check both fields
    await form.vm.validate()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.zc-form-item__error').length).toBe(2)

    // Remove email field
    wrapper.vm.showEmail = false
    await wrapper.vm.$nextTick()

    // Validate again — should only check name field
    await form.vm.validate()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.zc-form-item__error').length).toBe(1)
  })
})
