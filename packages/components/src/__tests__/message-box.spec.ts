import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { ZcMessageBox } from '../message-box/message-box'
import MessageBox from '../message-box/message-box.vue'

// Helper: find a button by its text content within message-box footer
function findBtnByText(text: string): HTMLElement | null {
  const btns = document.querySelectorAll('.zc-message-box__btn')
  for (const btn of btns) {
    if (btn.textContent?.trim() === text) return btn as HTMLElement
  }
  return null
}

describe('ZcMessageBox (imperative API)', () => {
  it('alert resolves on confirm', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.alert('操作成功', '提示')
    await flushPromises()
    await nextTick()
    // Should have rendered the message box panel
    const panel = document.querySelector('.zc-message-box__panel')
    expect(panel).toBeTruthy()
    // The confirm button has text '确定' (default)
    const confirmBtn = findBtnByText('确定')
    expect(confirmBtn).toBeTruthy()
    confirmBtn!.click()
    const result = await promise
    expect(result.action).toBe('confirm')
  })

  it('alert displays message and title', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.alert('Hello World', 'My Title')
    await flushPromises()
    await nextTick()
    expect(document.querySelector('.zc-message-box__title')?.textContent).toContain('My Title')
    expect(document.querySelector('.zc-message-box__message')?.textContent).toContain('Hello World')
    // Close
    findBtnByText('确定')!.click()
    await promise
  })

  it('confirm rejects on cancel', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.confirm('确定删除？', '警告')
    await flushPromises()
    await nextTick()
    // Click cancel button (text '取消')
    const cancelBtn = findBtnByText('取消')
    expect(cancelBtn).toBeTruthy()
    cancelBtn!.click()
    await expect(promise).rejects.toBe('cancel')
  })

  it('confirm resolves on confirm', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.confirm('确定操作？')
    await flushPromises()
    await nextTick()
    const confirmBtn = findBtnByText('确定')
    confirmBtn!.click()
    const result = await promise
    expect(result.action).toBe('confirm')
  })

  it('prompt resolves with input value', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.prompt('请输入名称', '重命名')
    await flushPromises()
    await nextTick()
    // Type in the input
    const input = document.querySelector('.zc-message-box__input') as HTMLInputElement
    input.value = 'MyName'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    // Click confirm
    findBtnByText('确定')!.click()
    const result = await promise
    expect(result.action).toBe('confirm')
    expect(result.value).toBe('MyName')
  })

  it('prompt rejects on cancel', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.prompt('请输入邮箱')
    await flushPromises()
    await nextTick()
    const cancelBtn = findBtnByText('取消')
    cancelBtn!.click()
    await expect(promise).rejects.toBe('cancel')
  })

  it('accepts options object', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.alert({
      message: 'Options message',
      title: 'Options title',
      confirmText: 'OK',
    })
    await flushPromises()
    await nextTick()
    const confirmBtn = findBtnByText('OK')
    expect(confirmBtn).toBeTruthy()
    confirmBtn!.click()
    await promise
  })

  it('applies custom confirmText', async () => {
    document.body.innerHTML = ''
    const promise = ZcMessageBox.alert('msg', 'title', {
      confirmText: 'Got it',
    })
    await flushPromises()
    await nextTick()
    const btn = findBtnByText('Got it')
    expect(btn).toBeTruthy()
    btn!.click()
    await promise
  })
})

describe('ZcMessageBox (component)', () => {
  function mountComponent(props: any) {
    document.body.innerHTML = ''
    const wrapper = mount(MessageBox, {
      props,
      attachTo: document.body,
    })
    return wrapper
  }

  it('renders alert type correctly', async () => {
    mountComponent({ type: 'alert', message: 'Test message', title: 'Test Title' })
    await flushPromises()
    await nextTick()
    expect(document.querySelector('.zc-message-box__panel')).toBeTruthy()
    expect(document.querySelector('.zc-message-box__title')?.textContent).toContain('Test Title')
    expect(document.querySelector('.zc-message-box__message')?.textContent).toContain(
      'Test message'
    )
  })

  it('shows cancel button for confirm type', async () => {
    mountComponent({ type: 'confirm', message: 'Confirm?' })
    await flushPromises()
    await nextTick()
    expect(findBtnByText('取消')).toBeTruthy()
  })

  it('hides cancel button for alert type', async () => {
    mountComponent({ type: 'alert', message: 'Alert!' })
    await flushPromises()
    await nextTick()
    expect(findBtnByText('取消')).toBeFalsy()
  })

  it('shows input field for prompt type', async () => {
    mountComponent({ type: 'prompt', message: 'Enter name' })
    await flushPromises()
    await nextTick()
    expect(document.querySelector('.zc-message-box__input')).toBeTruthy()
  })

  it('emits confirm event with input value for prompt', async () => {
    const wrapper = mountComponent({
      type: 'prompt',
      message: 'Enter',
      inputValue: 'default',
    })
    await flushPromises()
    await nextTick()
    const confirmBtn = findBtnByText('确定')
    confirmBtn!.click()
    await nextTick()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')![0][0]).toBe('default')
  })
})
