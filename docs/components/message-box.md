# MessageBox 消息框

用于显示重要信息的模态对话框，支持 alert、confirm、prompt 三种模式。

## Alert 提示框

使用 `ZcMessageBox.alert()` 显示一个带确认按钮的提示框。

<DemoBlock>

```vue
<script setup>
import { ZcMessageBox } from 'zc-ui'

async function showAlert() {
  await ZcMessageBox.alert('操作成功完成', '提示')
}
</script>

<template>
  <ZcButton @click="showAlert">显示 Alert</ZcButton>
</template>
```

</DemoBlock>

## Confirm 确认框

使用 `ZcMessageBox.confirm()` 显示确认对话框，返回 Promise。

<DemoBlock>

```vue
<script setup>
import { ZcMessageBox, ZcMessage } from 'zc-ui'

async function showConfirm() {
  try {
    await ZcMessageBox.confirm('确定要删除这条数据吗？', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      confirmButtonType: 'danger',
    })
    ZcMessage.success('已删除')
  } catch {
    ZcMessage.info('已取消')
  }
}
</script>

<template>
  <ZcButton type="danger" @click="showConfirm">删除数据</ZcButton>
</template>
```

</DemoBlock>

## Prompt 输入框

使用 `ZcMessageBox.prompt()` 显示带输入框的对话框。

<DemoBlock>

```vue
<script setup>
import { ZcMessageBox, ZcMessage } from 'zc-ui'

async function showPrompt() {
  try {
    const { value } = await ZcMessageBox.prompt('请输入新的名称', '重命名', {
      inputPlaceholder: '请输入名称',
      inputValue: '默认值',
    })
    ZcMessage.success(`已设置为：${value}`)
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <ZcButton @click="showPrompt">重命名</ZcButton>
</template>
```

</DemoBlock>

## API

### ZcMessageBox.alert(message, title?, options?)

显示提示框，返回 `Promise<MessageBoxResult>`。

### ZcMessageBox.confirm(message, title?, options?)

显示确认框，确认时 resolve，取消时 reject。

### ZcMessageBox.prompt(message, title?, options?)

显示输入框，确认时 resolve `{ action, value }`，取消时 reject。

### Options

| 属性                     | 说明                          | 类型                                                        | 默认值      |
| ------------------------ | ----------------------------- | ----------------------------------------------------------- | ----------- |
| title                    | 标题                          | `string`                                                    | —           |
| message                  | 消息内容                      | `string`                                                    | —           |
| confirmText              | 确认按钮文本                  | `string`                                                    | `'确定'`    |
| cancelText               | 取消按钮文本                  | `string`                                                    | `'取消'`    |
| confirmButtonType        | 确认按钮类型                  | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| cancelButtonType         | 取消按钮类型                  | `'default' \| 'primary' \| 'text'`                          | `'default'` |
| inputPlaceholder         | 输入框占位文本（prompt）      | `string`                                                    | `'请输入'`  |
| inputValue               | 输入框初始值（prompt）        | `string`                                                    | —           |
| inputType                | 输入框类型（prompt）          | `string`                                                    | `'text'`    |
| inputValidator           | 输入验证函数（prompt）        | `(value: string) => boolean \| string`                      | —           |
| showClose                | 是否显示关闭按钮              | `boolean`                                                   | `true`      |
| closeOnClickOverlay      | 点击遮罩层关闭                | `boolean`                                                   | `false`     |
| center                   | 是否居中显示                  | `boolean`                                                   | `false`     |
| width                    | 弹窗宽度                      | `string \| number`                                          | `'420px'`   |
| dangerouslyUseHTMLString | 是否将 message 作为 HTML 渲染 | `boolean`                                                   | `false`     |
