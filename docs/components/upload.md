# Upload 上传

通过点击或者拖拽上传文件。

## 点击上传

通过设置 `action` 属性指定上传接口地址。

<DemoBlock>

```vue
<template>
  <ZcUpload action="https://example.com/upload" :limit="3">
    <ZcButton type="primary">点击上传</ZcButton>
    <template #tip>
      <div style="color: #909399; font-size: 12px; margin-top: 8px;">
        只能上传 jpg/png 文件，且不超过 2MB
      </div>
    </template>
  </ZcUpload>
</template>
```

</DemoBlock>

## 拖拽上传

设置 `drag` 属性可开启拖拽上传。

<DemoBlock>

```vue
<template>
  <ZcUpload action="https://example.com/upload" drag multiple>
    <template #tip>
      <div style="color: #909399; font-size: 12px;">
        将文件拖到此处，或 <em style="color: #409eff; cursor: pointer;">点击上传</em>
      </div>
    </template>
  </ZcUpload>
</template>
```

</DemoBlock>

## 照片墙

设置 `list-type` 为 `picture-card` 可展示照片墙模式。

<DemoBlock>

```vue
<template>
  <ZcUpload action="https://example.com/upload" list-type="picture-card" :limit="4" />
</template>
```

</DemoBlock>

## Upload API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '文件列表 (v-model)', type: 'UploadFile[]', default: '[]' },
{ name: 'action', description: '上传的地址', type: 'string', default: `'#'` },
{ name: 'multiple', description: '是否支持多选文件', type: 'boolean', default: 'false' },
{ name: 'accept', description: '接受上传的文件类型', type: 'string', default: `''` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'limit', description: '最大允许上传个数', type: 'number', default: '0' },
{ name: 'autoUpload', description: '是否在选取文件后立即进行上传', type: 'boolean', default: 'true' },
{ name: 'withCredentials', description: '上传请求是否携带 cookie', type: 'boolean', default: 'false' },
{ name: 'headers', description: '上传请求的额外 headers', type: 'object', default: '{}' },
{ name: 'data', description: '上传请求的额外参数', type: 'object', default: '{}' },
{ name: 'name', description: '上传的文件字段名', type: 'string', default: `'file'` },
{ name: 'drag', description: '是否启用拖拽上传', type: 'boolean', default: 'false' },
{ name: 'listType', description: '文件列表的类型', type: `'text' | 'picture' | 'picture-card'`, default: `'text'` },
{ name: 'showFileList', description: '是否显示已上传文件列表', type: 'boolean', default: 'true' },
{ name: 'httpRequest', description: '覆盖默认上传行为', type: 'Function', default: 'undefined' },
{ name: 'beforeUpload', description: '上传文件之前的钩子', type: '(file: File) => boolean | Promise<boolean>', default: 'undefined' },
{ name: 'onRemove', description: '文件移除时的钩子', type: '(file: UploadFile) => boolean | Promise<boolean>', default: 'undefined' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '文件状态改变时触发', parameters: '(file: UploadFile, fileList: UploadFile[])' },
  { name: 'success', description: '文件上传成功时触发', parameters: '(response, file, fileList)' },
  { name: 'error', description: '文件上传失败时触发', parameters: '(error, file, fileList)' },
  { name: 'progress', description: '文件上传时触发', parameters: '(event: { percent: number }, file: UploadFile)' },
  { name: 'remove', description: '文件列表移除文件时触发', parameters: '(file: UploadFile, fileList: UploadFile[])' },
  { name: 'exceed', description: '文件超出个数限制时触发', parameters: '(files: File[], fileList: UploadFile[])' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '上传区域内容' },
  { name: 'file', description: '自定义文件项内容' },
  { name: 'tip', description: '提示说明文字' },
]" />
