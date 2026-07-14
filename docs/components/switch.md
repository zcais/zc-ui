# Switch 开关

表示两种相互对立状态的切换，常用于开关某项功能。

## 基础用法

使用 `v-model` 绑定开关状态。

<DemoBlock>

```vue
<template>
  <ZcSwitch v-model="value1" />
  <ZcSwitch v-model="value2" activeText="开启" inactiveText="关闭" />
</template>
```

</DemoBlock>

## 尺寸

通过 `size` 属性调整开关尺寸。

<DemoBlock>

```vue
<template>
  <ZcSwitch v-model="value1" size="large" />
  <ZcSwitch v-model="value2" size="medium" />
  <ZcSwitch v-model="value3" size="small" />
</template>
```

</DemoBlock>

## 自定义颜色

通过 `activeColor` 和 `inactiveColor` 属性自定义开关颜色。

<DemoBlock>

```vue
<template>
  <ZcSwitch v-model="value1" activeColor="#67c23a" inactiveColor="#e4e7ed" />
  <ZcSwitch v-model="value2" activeColor="#f56c6c" inactiveColor="#e4e7ed" />
</template>
```

</DemoBlock>

## 禁用与加载状态

通过 `disabled` 和 `loading` 属性控制开关交互。

<DemoBlock>

```vue
<template>
  <ZcSwitch v-model="value1" disabled />
  <ZcSwitch v-model="value2" loading />
</template>
```

</DemoBlock>

## Switch API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值', type: 'boolean', default: 'false' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'loading', description: '是否显示加载状态', type: 'boolean', default: 'false' },
  { name: 'size', description: '开关尺寸', type: 'large | medium | small', default: 'medium' },
  { name: 'activeText', description: '打开时的文字描述', type: 'string', default: '' },
  { name: 'inactiveText', description: '关闭时的文字描述', type: 'string', default: '' },
  { name: 'activeColor', description: '打开时的自定义颜色', type: 'string', default: '' },
  { name: 'inactiveColor', description: '关闭时的自定义颜色', type: 'string', default: '' },
  { name: 'width', description: '开关宽度（像素）', type: 'number', default: '40' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: boolean)' },
  { name: 'change', description: '值变更时触发', parameters: '(value: boolean)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'active', description: '打开状态的自定义内容，替代 activeText' },
  { name: 'inactive', description: '关闭状态的自定义内容，替代 inactiveText' }
]" />
