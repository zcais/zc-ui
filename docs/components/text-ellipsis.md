# TextEllipsis 文本省略

文本超出时自动省略并显示省略号，支持单行/多行省略、悬浮提示、展开收起。

## 基础用法

<DemoBlock>

```vue
<template>
  <div style="width: 200px; border: 1px solid #eee; padding: 8px">
    <ZcTextEllipsis content="这是一段很长的文字内容，超出部分将被自动省略并显示省略号" />
  </div>
</template>
```

</DemoBlock>

## 多行省略

通过 `lines` 设置最大行数。

<DemoBlock>

```vue
<template>
  <div style="width: 300px; border: 1px solid #eee; padding: 8px">
    <ZcTextEllipsis
      :lines="2"
      content="这是第一行内容。这是第二行内容。这是第三行内容，将会被省略。这是第四行内容，同样会被省略。"
    />
  </div>
</template>
```

</DemoBlock>

## 展开收起

设置 `expandable` 显示展开/收起按钮。

<DemoBlock>

```vue
<template>
  <div style="width: 300px; border: 1px solid #eee; padding: 8px">
    <ZcTextEllipsis
      :lines="2"
      expandable
      content="这是一段可以展开查看完整内容的文字。点击展开按钮可以查看所有内容。再次点击收起按钮可以折叠文字。"
    />
  </div>
</template>
```

</DemoBlock>

## 关闭提示

设置 `showTooltip="false"` 关闭悬浮提示。

<DemoBlock>

```vue
<template>
  <div style="width: 200px; border: 1px solid #eee; padding: 8px">
    <ZcTextEllipsis :show-tooltip="false" content="关闭提示后，鼠标悬浮不会显示完整内容" />
  </div>
</template>
```

</DemoBlock>

## API

### TextEllipsis Props

<ApiTable type="props" :data="[
{ name: 'content', description: '文本内容', type: 'string', default: '''' },
{ name: 'lines', description: '最大行数（0=单行省略）', type: 'number', default: '0' },
{ name: 'showTooltip', description: '是否显示悬浮提示', type: 'boolean', default: 'true' },
{ name: 'placement', description: '提示框位置', type: '`'top' \', default: ''bottom' \' },
{ name: 'expandable', description: '是否显示展开/收起按钮', type: 'boolean', default: 'false' },
{ name: 'ellipsis', description: '自定义省略符号', type: 'string', default: ''…'' },
{ name: 'tooltipClass', description: '提示框自定义类名', type: 'string', default: '''' }
]" />

### TextEllipsis Events

<ApiTable type="events" :data="[
{ name: '(expanded: boolean)', description: '展开/收起时触发' }
]" />

### Slots

<ApiTable type="slots" :data="[
{ name: 'default', description: '文本内容（与 content prop 二选一）' }
]" />
