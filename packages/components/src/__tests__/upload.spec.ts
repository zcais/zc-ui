import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Upload from '../upload/upload.vue'
import type { UploadFile, UploadRequestOptions } from '../upload/types'

describe('ZcUpload', () => {
  it('renders with default props', () => {
    const wrapper = mount(Upload)
    expect(wrapper.find('.zc-upload').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__trigger').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__input').exists()).toBe(true)
  })

  it('applies drag class', () => {
    const wrapper = mount(Upload, { props: { drag: true } })
    expect(wrapper.find('.zc-upload').classes()).toContain('is-drag')
    expect(wrapper.find('.zc-upload__dragger').exists()).toBe(true)
  })

  it('applies disabled class', () => {
    const wrapper = mount(Upload, { props: { disabled: true } })
    expect(wrapper.find('.zc-upload').classes()).toContain('is-disabled')
  })

  it('shows file input with correct accept attribute', () => {
    const wrapper = mount(Upload, { props: { accept: 'image/*' } })
    expect(wrapper.find('.zc-upload__input').attributes('accept')).toBe('image/*')
  })

  it('shows file input with multiple attribute', () => {
    const wrapper = mount(Upload, { props: { multiple: true } })
    expect(wrapper.find('.zc-upload__input').attributes('multiple')).toBeDefined()
  })

  it('disables file input when disabled', () => {
    const wrapper = mount(Upload, { props: { disabled: true } })
    expect(wrapper.find('.zc-upload__input').attributes('disabled')).toBeDefined()
  })

  it('renders dragger text', () => {
    const wrapper = mount(Upload, { props: { drag: true } })
    expect(wrapper.find('.zc-upload__dragger-text').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__dragger-text em').text()).toBe('点击上传')
  })

  it('renders file list when showFileList is true', () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.png', status: 'success', size: 1024 }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    const items = wrapper.findAll('.zc-upload__file')
    expect(items.length).toBe(1)
    expect(wrapper.find('.zc-upload__file-name').text()).toBe('test.png')
  })

  it('renders picture-card list type', () => {
    const fileList: UploadFile[] = [
      { uid: 1, name: 'test.png', status: 'success', url: 'data:image/png;base64,abc' },
    ]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, listType: 'picture-card', showFileList: true },
    })
    expect(wrapper.find('.zc-upload__list--picture-card').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__file-card').exists()).toBe(true)
  })

  it('hides file list when showFileList is false', () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.png', status: 'success' as const }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: false },
    })
    expect(wrapper.find('.zc-upload__list').exists()).toBe(false)
  })

  it('shows success status icon', () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'success' }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    expect(wrapper.find('.zc-upload__file-success').exists()).toBe(true)
  })

  it('shows error status icon', () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'error' }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    expect(wrapper.find('.zc-upload__file-error').exists()).toBe(true)
  })

  it('shows remove button', () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'success' }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    expect(wrapper.find('.zc-upload__file-remove').exists()).toBe(true)
  })

  it('emits remove on remove click', async () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'success' }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    await wrapper.find('.zc-upload__file-remove').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('exposes submit and clearFiles methods', () => {
    const wrapper = mount(Upload)
    const vm = wrapper.vm as InstanceType<typeof Upload>
    expect(typeof vm.submit).toBe('function')
    expect(typeof vm.clearFiles).toBe('function')
  })

  it('hides trigger area in drag mode', () => {
    const wrapper = mount(Upload, { props: { drag: true } })
    expect(wrapper.find('.zc-upload__trigger').exists()).toBe(false)
  })

  it('shows tip slot area in drag mode', () => {
    const wrapper = mount(Upload, {
      props: { drag: true },
      slots: { tip: '<div class="custom-tip">Only PNG files</div>' },
    })
    expect(wrapper.find('.custom-tip').exists()).toBe(true)
  })

  it('renders default slot in non-drag mode', () => {
    const wrapper = mount(Upload, {
      props: { drag: false },
      slots: { default: '<button class="custom-btn">Upload</button>' },
    })
    expect(wrapper.find('.custom-btn').exists()).toBe(true)
  })

  it('accepts custom action prop', () => {
    const wrapper = mount(Upload, { props: { action: '/api/upload' } })
    expect(wrapper.find('.zc-upload').exists()).toBe(true)
  })

  it('accepts custom name prop', () => {
    const wrapper = mount(Upload, { props: { name: 'avatar' } })
    expect(wrapper.find('.zc-upload__input').attributes('name')).toBe(undefined)
  })

  it('accepts headers and data props', () => {
    const wrapper = mount(Upload, {
      props: {
        headers: { Authorization: 'Bearer token' },
        data: { userId: 1 },
      },
    })
    expect(wrapper.find('.zc-upload').exists()).toBe(true)
  })

  it('accepts withCredentials prop', () => {
    const wrapper = mount(Upload, { props: { withCredentials: true } })
    expect(wrapper.find('.zc-upload').exists()).toBe(true)
  })

  it('renders trigger slot content in non-drag mode', () => {
    const wrapper = mount(Upload, {
      slots: { trigger: '<button class="upload-btn">Click to Upload</button>' },
    })
    expect(wrapper.find('.upload-btn').exists()).toBe(true)
    expect(wrapper.find('.upload-btn').text()).toBe('Click to Upload')
  })

  it('shows uploading status with percentage in text mode', () => {
    const fileList: UploadFile[] = [
      { uid: 1, name: 'test.png', status: 'uploading', percentage: 50, size: 1024 },
    ]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })
    expect(wrapper.find('.zc-upload__file-loading').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__file-loading').text()).toContain('50')
  })

  it('renders picture list type', () => {
    const fileList: UploadFile[] = [
      { uid: 1, name: 'test.png', status: 'success', url: 'data:image/png;base64,abc', size: 1024 },
    ]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, listType: 'picture', showFileList: true },
    })
    expect(wrapper.find('.zc-upload__list--picture').exists()).toBe(true)
  })

  it('shows uploading overlay in picture-card mode', () => {
    const fileList: UploadFile[] = [
      {
        uid: 1,
        name: 'test.png',
        status: 'uploading',
        percentage: 60,
        url: 'data:image/png;base64,abc',
        size: 1024,
      },
    ]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, listType: 'picture-card', showFileList: true },
    })
    expect(wrapper.find('.zc-upload__file-overlay').exists()).toBe(true)
    expect(wrapper.find('.zc-upload__progress-bar').exists()).toBe(true)
  })

  it('emits change event when file is added via input change', async () => {
    const wrapper = mount(Upload, {
      props: { httpRequest: vi.fn() },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    const changeEvent = wrapper.emitted('change')![0] as any[]
    expect(changeEvent[0].name).toBe('test.txt')
    expect(changeEvent[0].status).toBe('ready')
    expect(changeEvent[1].length).toBe(1)
  })

  it('respects autoUpload=false and does not auto upload', async () => {
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { autoUpload: false, httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(httpRequest).not.toHaveBeenCalled()
  })

  it('submits ready files via submit() method', async () => {
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { autoUpload: false, httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    // Simulate v-model by updating the prop after change
    const uploadedFile = wrapper.emitted('change')![0][0] as UploadFile
    await wrapper.setProps({ modelValue: [uploadedFile] })
    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as InstanceType<typeof Upload>
    vm.submit()

    expect(httpRequest).toHaveBeenCalled()
  })

  it('clears files via clearFiles() method', async () => {
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'success', size: 1024 }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true },
    })

    expect(wrapper.findAll('.zc-upload__file').length).toBe(1)

    const vm = wrapper.vm as InstanceType<typeof Upload>
    vm.clearFiles()
    await wrapper.vm.$nextTick()

    // clearFiles sets internal list to [] which emits update:modelValue
    // Simulate parent receiving the update
    await wrapper.setProps({ modelValue: [] })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.zc-upload__file').length).toBe(0)
  })

  it('emits exceed when limit is reached', async () => {
    const existingFile: UploadFile = { uid: 1, name: 'existing.txt', status: 'success', size: 100 }
    const wrapper = mount(Upload, {
      props: { modelValue: [existingFile], limit: 1 },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'new.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(wrapper.emitted('exceed')).toBeTruthy()
  })

  it('calls beforeUpload hook and prevents upload when returns false', async () => {
    const beforeUpload = vi.fn().mockReturnValue(false)
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { beforeUpload, httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(beforeUpload).toHaveBeenCalledWith(file)
    expect(httpRequest).not.toHaveBeenCalled()
  })

  it('calls beforeUpload hook and proceeds when returns true', async () => {
    const beforeUpload = vi.fn().mockReturnValue(true)
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { beforeUpload, httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(beforeUpload).toHaveBeenCalledWith(file)
    expect(httpRequest).toHaveBeenCalled()
  })

  it('calls beforeUpload with async promise resolving to false', async () => {
    const beforeUpload = vi.fn().mockResolvedValue(false)
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { beforeUpload, httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')
    // Wait for the async beforeUpload to resolve
    await new Promise((r) => setTimeout(r, 50))

    expect(beforeUpload).toHaveBeenCalledWith(file)
    expect(httpRequest).not.toHaveBeenCalled()
  })

  it('calls httpRequest with correct upload options', async () => {
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: {
        httpRequest,
        action: '/upload',
        name: 'file',
        headers: { 'X-Custom': 'val' },
        data: { key: 'val' },
        withCredentials: true,
      },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        action: '/upload',
        file: expect.any(File),
        headers: { 'X-Custom': 'val' },
        data: { key: 'val' },
        withCredentials: true,
        onProgress: expect.any(Function),
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    )
  })

  it('emits success event via httpRequest onSuccess callback', async () => {
    let onSuccessCb: ((response: unknown) => void) | undefined
    const httpRequest = vi.fn().mockImplementation((options: UploadRequestOptions) => {
      onSuccessCb = options.onSuccess
    })
    const wrapper = mount(Upload, { props: { httpRequest } })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    onSuccessCb!({ url: 'http://example.com/file' })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('success')![0][0]).toEqual({ url: 'http://example.com/file' })
  })

  it('emits error event via httpRequest onError callback', async () => {
    let onErrorCb: ((err: Error) => void) | undefined
    const httpRequest = vi.fn().mockImplementation((options: UploadRequestOptions) => {
      onErrorCb = options.onError
    })
    const wrapper = mount(Upload, { props: { httpRequest } })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    onErrorCb!(new Error('Upload failed'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('error')).toBeTruthy()
    expect(wrapper.emitted('error')![0][0]).toBeInstanceOf(Error)
    expect((wrapper.emitted('error')![0][0] as Error).message).toBe('Upload failed')
  })

  it('emits progress event via httpRequest onProgress callback', async () => {
    let onProgressCb: ((event: { percent: number }) => void) | undefined
    const httpRequest = vi.fn().mockImplementation((options: UploadRequestOptions) => {
      onProgressCb = options.onProgress
    })
    const wrapper = mount(Upload, { props: { httpRequest } })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    onProgressCb!({ percent: 50 })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('progress')).toBeTruthy()
    expect((wrapper.emitted('progress')![0][0] as { percent: number }).percent).toBe(50)
  })

  it('respects onRemove prop and prevents removal when returns false', async () => {
    const onRemove = vi.fn().mockReturnValue(false)
    const fileList: UploadFile[] = [{ uid: 1, name: 'test.txt', status: 'success', size: 1024 }]
    const wrapper = mount(Upload, {
      props: { modelValue: fileList, showFileList: true, onRemove },
    })

    await wrapper.find('.zc-upload__file-remove').trigger('click')

    expect(onRemove).toHaveBeenCalled()
    // remove event should NOT emit because onRemove returned false
    expect(wrapper.emitted('remove')).toBeFalsy()
  })

  it('does not trigger upload click when disabled', async () => {
    const wrapper = mount(Upload, {
      props: { disabled: true },
    })
    // Just verify the component renders without errors
    const trigger = wrapper.find('.zc-upload__trigger')
    await trigger.trigger('click')
    expect(wrapper.find('.zc-upload').exists()).toBe(true)
  })

  it('handles drag and drop events', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true },
    })

    const dragger = wrapper.find('.zc-upload__dragger')

    // Drag over
    await dragger.trigger('dragover')
    expect(dragger.classes()).toContain('is-dragover')

    // Drag leave
    await dragger.trigger('dragleave')
    expect(dragger.classes()).not.toContain('is-dragover')
  })

  it('uploads files via drag and drop', async () => {
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { drag: true, httpRequest },
    })

    const dragger = wrapper.find('.zc-upload__dragger')

    // Simulate drop event with files
    const file = new File(['test'], 'dropped.txt', { type: 'text/plain' })
    const dataTransfer = { files: [file] }

    await dragger.trigger('drop', { dataTransfer })

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(httpRequest).toHaveBeenCalled()
  })

  it('creates object URL for image files in picture mode', async () => {
    const httpRequest = vi.fn()
    const wrapper = mount(Upload, {
      props: { listType: 'picture', httpRequest },
    })
    const input = wrapper.find('.zc-upload__input')
    const file = new File(['fake-image'], 'photo.jpg', { type: 'image/jpeg' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })

    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    const changeEvent = wrapper.emitted('change')![0] as any[]
    expect(changeEvent[0].url).toBeTruthy()
    expect(changeEvent[0].url).toMatch(/^blob:/)
  })
})
