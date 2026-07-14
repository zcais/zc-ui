# Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中，支持 hover、click、contextmenu 三种触发方式。

## 基础用法

将需要展开的内容放在 `#dropdown` 插槽中。

<DemoBlock>

```vue
<template>
  <ZcDropdown @command="handleCommand">
    <ZcButton>下拉菜单</ZcButton>
    <template #dropdown>
      <ZcDropdownMenu>
        <ZcDropdownItem command="a">选项一</ZcDropdownItem>
        <ZcDropdownItem command="b">选项二</ZcDropdownItem>
        <ZcDropdownItem command="c" disabled>选项三（禁用）</ZcDropdownItem>
        <ZcDropdownItem command="d" divided>选项四</ZcDropdownItem>
      </ZcDropdownMenu>
    </template>
  </ZcDropdown>
</template>

<script setup>
function handleCommand(cmd) {
  console.log('选中:', cmd)
}
</script>
```

</DemoBlock>

## 点击触发

设置 `trigger="click"` 使用点击触发。

<DemoBlock>

```vue
<template>
  <ZcDropdown trigger="click">
    <ZcButton>点击展开</ZcButton>
    <template #dropdown>
      <ZcDropdownMenu>
        <ZcDropdownItem command="edit">编辑</ZcDropdownItem>
        <ZcDropdownItem command="copy">复制</ZcDropdownItem>
        <ZcDropdownItem command="delete" divided>删除</ZcDropdownItem>
      </ZcDropdownMenu>
    </template>
  </ZcDropdown>
</template>
```

</DemoBlock>

## 触发方式

通过 `trigger` 属性设置触发方式：hover（悬浮）、click（点击）、contextmenu（右键菜单）。

<DemoBlock>

```vue
<template>
  <ZcDropdown trigger="contextmenu">
    <ZcButton>右键触发</ZcButton>
    <template #dropdown>
      <ZcDropdownMenu>
        <ZcDropdownItem command="refresh">刷新</ZcDropdownItem>
        <ZcDropdownItem command="setting">设置</ZcDropdownItem>
      </ZcDropdownMenu>
    </template>
  </ZcDropdown>
</template>
```

</DemoBlock>

## Dropdown API

### Props

<ApiTable type="props" :data="[
{ name: 'trigger', description: '触发方式', type: `'hover' | 'click' | 'contextmenu'`, default: `'hover'` },
{ name: 'visible (v-model)', description: '可见性', type: 'boolean', default: 'false' },
{ name: 'placement', description: '弹出位置', type: `'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'`, default: `'bottom'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'showTimeout', description: '显示延迟（ms）', type: 'number', default: '250' },
{ name: 'hideTimeout', description: '隐藏延迟（ms）', type: 'number', default: '150' },
{ name: 'popperClass', description: '弹出层自定义类名', type: 'string', default: `''` },
{ name: 'hideOnClick', description: '点击外部是否关闭', type: 'boolean', default: 'true' },
{ name: 'maxHeight', description: '菜单最大高度', type: 'string', default: `''` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:visible', description: '可见性变化', parameters: '(val: boolean)' },
  { name: 'show', description: '显示时', parameters: '—' },
  { name: 'hide', description: '隐藏时', parameters: '—' },
  { name: 'command', description: '菜单项选中', parameters: '(command: string | number | object)' },
  { name: 'click', description: '点击触发器', parameters: '(event: MouseEvent)' },
]" />

### DropdownItem Props

<ApiTable type="props" :data="[
{ name: 'command', description: '命令值', type: 'string | number | object', default: `''` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'divided', description: '是否显示分隔线', type: 'boolean', default: 'false' },
{ name: 'icon', description: '图标类名', type: 'string', default: `''` },
]" />

### DropdownItem Slots

<ApiTable type="slots" :data="[
  { name: 'icon', description: '图标内容' },
  { name: 'default', description: '文本内容' },
]" />
