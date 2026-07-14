# Form 表单

由输入框、选择器、单选框、多选框等控件组成，用于收集、校验和提交数据。

## 基础用法

通过 `model` 绑定表单数据，`rules` 配置校验规则。

<DemoBlock>

```vue
<template>
  <ZcForm ref="formRef" :model="formData" :rules="rules" labelWidth="80px">
    <ZcFormItem label="用户名" prop="username">
      <ZcInput v-model="formData.username" placeholder="请输入用户名" />
    </ZcFormItem>
    <ZcFormItem label="密码" prop="password">
      <ZcInput v-model="formData.password" type="password" placeholder="请输入密码" />
    </ZcFormItem>
    <ZcFormItem>
      <ZcButton type="primary" @click="submitForm">提交</ZcButton>
    </ZcFormItem>
  </ZcForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formData = reactive({
  username: '',
  password: '',
})

const formRef = ref()

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function submitForm() {
  formRef.value?.validate()
}
</script>
```

</DemoBlock>

## 标签位置

通过 `labelPosition` 属性控制标签的位置：`left`（左对齐）、`right`（右对齐）、`top`（顶部对齐）。

<DemoBlock>

```vue
<template>
  <ZcForm :model="formData" labelPosition="top" labelWidth="80px">
    <ZcFormItem label="姓名" prop="name">
      <ZcInput v-model="formData.name" />
    </ZcFormItem>
    <ZcFormItem label="邮箱" prop="email">
      <ZcInput v-model="formData.email" />
    </ZcFormItem>
  </ZcForm>
</template>

<script setup>
import { reactive } from 'vue'
const formData = reactive({ name: '', email: '' })
</script>
```

</DemoBlock>

## 行内表单

通过 `inline` 属性开启行内排列模式。

<DemoBlock>

```vue
<template>
  <ZcForm :model="formData" inline>
    <ZcFormItem label="姓名" prop="name">
      <ZcInput v-model="formData.name" />
    </ZcFormItem>
    <ZcFormItem label="年龄" prop="age">
      <ZcInput v-model="formData.age" />
    </ZcFormItem>
    <ZcFormItem>
      <ZcButton type="primary">查询</ZcButton>
    </ZcFormItem>
  </ZcForm>
</template>

<script setup>
import { reactive } from 'vue'
const formData = reactive({ name: '', age: '' })
</script>
```

</DemoBlock>

## 动态表单

通过 `useFormArray` / `createFormArray` 组合式函数管理动态字段列表，支持增删改移操作。每个表单项自动获得唯一 `_key`，确保 Vue 列表渲染高效稳定。

<DemoBlock>
  
  ```vue
  <template>
  <ZcForm ref="formRef" :model="formData" :rules="rules" labelWidth="80px">
  <ZcFormItem
  v-for="(item, index) in users.fields.value"
:key="item._key"
:label="`用户 ${index + 1}`"
:prop="`users.${index}.name`"
:rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]"
>
  <ZcInput v-model="formData.users[index].name" placeholder="请输入姓名" />
<ZcButton size="small" type="danger" @click="users.remove(index)" style="margin-left: 8px">
删除
</ZcButton>
</ZcFormItem>

  <ZcFormItem>
  <ZcButton @click="users.add({ name: '' })">添加用户</ZcButton>
  </ZcFormItem>
  </ZcForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createFormArray } from '@zc-ui/components'
  
  interface User {
  name: string
  }
  
  const formData = reactive<{ users: User[] }>({ users: [] })
const users = createFormArray<User>([{ name: '' }])
const formRef = ref()

// Sync formArray fields to form model
users.fields.value = formData.users as any
  const rules = {}
  </script>

````

</DemoBlock>

## 联动校验

validator 函数现在接收第三个参数 `model`，即完整的表单数据模型。这使得一个字段的校验可以引用其他字段的值。

<DemoBlock>

```vue
<template>
<ZcForm ref="formRef" :model="formData" :rules="rules" labelWidth="120px">
  <ZcFormItem label="密码" prop="password">
    <ZcInput v-model="formData.password" type="password" />
  </ZcFormItem>
  <ZcFormItem label="确认密码" prop="confirm">
    <ZcInput v-model="formData.confirm" type="password" />
  </ZcFormItem>
  <ZcFormItem>
    <ZcButton type="primary" @click="submitForm">提交</ZcButton>
  </ZcFormItem>
</ZcForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formData = reactive({
password: '',
confirm: '',
})

const formRef = ref()

const rules = {
password: [
  { required: true, message: '请输入密码', trigger: 'blur' },
  { min: 6, message: '密码至少6位', trigger: 'blur' },
],
confirm: [
  { required: true, message: '请确认密码', trigger: 'blur' },
  {
    validator: (_rule: any, value: unknown, model?: Record<string, unknown>) => {
      return value === model?.password
    },
    message: '两次输入的密码不一致',
    trigger: 'change',
  },
],
}

function submitForm() {
formRef.value?.validate()
}
</script>
````

</DemoBlock>

## 异步校验与 Loading 状态

当 validator 返回 Promise 时，`ZcFormItem` 会自动展示旋转加载动画。`validating` 状态通过 `FormItemContext` 暴露给子组件。

<DemoBlock>

```vue
<template>
  <ZcForm ref="formRef" :model="formData" :rules="rules" labelWidth="100px">
    <ZcFormItem label="用户名" prop="username">
      <ZcInput v-model="formData.username" placeholder="输入用户名检查是否可用" />
    </ZcFormItem>
    <ZcFormItem>
      <ZcButton type="primary" @click="submitForm">提交</ZcButton>
    </ZcFormItem>
  </ZcForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formData = reactive({ username: '' })
const formRef = ref()

// 模拟异步校验
function checkUsername(_rule: any, value: unknown): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== 'admin')
    }, 800)
  })
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: checkUsername, message: '用户名已存在', trigger: 'blur' },
  ],
}

function submitForm() {
  formRef.value?.validate()
}
</script>
```

</DemoBlock>

## Watch 模式

通过 `validate-on-value-change` 属性控制是否在值变化时自动校验（默认开启）。设为 `false` 可关闭实时校验，仅在提交时触发。

```vue
<ZcForm :model="formData" :rules="rules" :validate-on-value-change="false">
  <ZcFormItem label="姓名" prop="name">
    <ZcInput v-model="formData.name" />
  </ZcFormItem>
</ZcForm>
```

## useFormArray API

`createFormArray` / `useFormArray` 用于管理动态字段列表。

### 类型定义

```ts
interface FormArrayOptions {
  /** 唯一键的属性名（默认 '_key'） */
  keyField?: string
  /** 是否自动生成唯一键（默认 true） */
  autoKeys?: boolean
}

interface UseFormArrayReturn<T> {
  fields: Ref<FormArrayItem<T>[]> // 响应式数组
  add: (item?: Partial<T>) => void // 追加
  push: (item: Partial<T>) => void // 追加（别名）
  insert: (index: number, item: Partial<T>) => void // 插入
  remove: (index: number) => void // 删除
  move: (from: number, to: number) => void // 移动
  clear: () => void // 清空
  get: (index: number) => FormArrayItem<T> | undefined // 获取
  length: Ref<number> // 长度
  validate: () => Promise<boolean> // 校验
}
```

## Form API

### Form Props

<ApiTable type="props" :data="[
  { name: 'model', description: '表单数据对象', type: 'Record<string, unknown>', default: '—' },
  { name: 'rules', description: '表单校验规则', type: 'FormRules', default: '{}' },
  { name: 'labelWidth', description: '标签宽度', type: 'string | number', default: '' },
  { name: 'labelPosition', description: '标签对齐方式', type: 'left | right | top', default: 'right' },
  { name: 'showMessage', description: '是否显示校验错误信息', type: 'boolean', default: 'true' },
  { name: 'inline', description: '是否行内排列', type: 'boolean', default: 'false' },
  { name: 'validateOnValueChange', description: '是否在值变化时自动校验（Watch 模式）', type: 'boolean', default: 'true' },
  { name: 'disabled', description: '表单级禁用状态', type: 'boolean', default: 'false' }
]" />

### Form Events

<ApiTable type="events" :data="[
  { name: 'validate', description: '任一表单项校验后触发', parameters: '(prop: string, success: boolean, message: string)' }
]" />

### Form 方法

<ApiTable type="props" :data="[
  { name: 'validate', description: '校验所有表单项，返回是否通过', type: '() => Promise<boolean>', default: '—' },
  { name: 'validateField', description: '校验指定表单项', type: '(name: string) => Promise<boolean>', default: '—' },
  { name: 'resetFields', description: '重置所有表单项校验状态', type: '() => void', default: '—' },
  { name: 'clearValidate', description: '清除所有校验信息', type: '() => void', default: '—' }
]" />

### FormItem Props

<ApiTable type="props" :data="[
  { name: 'prop', description: '字段路径（如 user.name）', type: 'string', default: '—' },
  { name: 'label', description: '标签文本', type: 'string', default: '—' },
  { name: 'labelWidth', description: '标签宽度覆盖', type: 'string | number', default: '—' },
  { name: 'rules', description: '自定义校验规则', type: 'FormItemRule | FormItemRule[]', default: '—' },
  { name: 'required', description: '是否必填（显示 * 号）', type: 'boolean', default: 'false' },
  { name: 'showMessage', description: '是否显示错误信息', type: 'boolean', default: 'true' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' }
]" />

### FormItem Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '表单项内容' },
  { name: 'label', description: '标签自定义内容' },
  { name: 'error', description: '校验错误信息自定义内容', params: '{ error: string }' }
]" />

### FormItem 暴露的方法

<ApiTable type="props" :data="[
  { name: 'validating', description: '是否正在异步校验中', type: 'Ref<boolean>', default: 'false' }
]" />
