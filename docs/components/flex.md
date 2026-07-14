# Flex 弹性布局

Flex 组件是 CSS Flexbox 的语义化封装，提供简洁直观的弹性布局能力。相比 Space（专注于间距控制）和 Row/Col（保留 24 栅格能力），Flex 更适合需要完整 Flexbox 特性的通用布局场景。

## 基础用法

使用 `ZcFlex` 来快速创建一个水平排列的弹性容器。

<DemoBlock>

```vue
<template>
  <ZcFlex gap="middle">
    <div class="flex-demo-item">1</div>
    <div class="flex-demo-item">2</div>
    <div class="flex-demo-item">3</div>
  </ZcFlex>
</template>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## 垂直布局

通过 `vertical` 属性将排列方向改为垂直（column）。

<DemoBlock>

```vue
<template>
  <ZcFlex vertical gap="middle">
    <div class="flex-demo-item">1</div>
    <div class="flex-demo-item">2</div>
    <div class="flex-demo-item">3</div>
  </ZcFlex>
</template>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
}
</style>
```

</DemoBlock>

## 主轴对齐（justify）

使用 `justify` 控制主轴方向上的对齐方式。

<DemoBlock>

```vue
<template>
  <ZcRadioGroup v-model="justify" style="margin-bottom: 16px">
    <ZcRadio value="flex-start">flex-start</ZcRadio>
    <ZcRadio value="center">center</ZcRadio>
    <ZcRadio value="flex-end">flex-end</ZcRadio>
    <ZcRadio value="space-between">space-between</ZcRadio>
    <ZcRadio value="space-around">space-around</ZcRadio>
    <ZcRadio value="space-evenly">space-evenly</ZcRadio>
  </ZcRadioGroup>

  <ZcFlex :justify="justify" style="background: #f5f5f5; padding: 12px; border-radius: 4px">
    <div class="flex-demo-item">A</div>
    <div class="flex-demo-item">B</div>
    <div class="flex-demo-item">C</div>
  </ZcFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const justify = ref('center')
</script>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## 交叉轴对齐（align）

使用 `align` 控制交叉轴方向上的对齐方式。

<DemoBlock>

```vue
<template>
  <ZcRadioGroup v-model="align" style="margin-bottom: 16px">
    <ZcRadio value="flex-start">flex-start</ZcRadio>
    <ZcRadio value="center">center</ZcRadio>
    <ZcRadio value="flex-end">flex-end</ZcRadio>
    <ZcRadio value="stretch">stretch</ZcRadio>
    <ZcRadio value="baseline">baseline</ZcRadio>
  </ZcRadioGroup>

  <ZcFlex :align="align" gap="middle" style="background: #f5f5f5; padding: 12px; border-radius: 4px; height: 120px">
    <div class="flex-demo-item">A</div>
    <div class="flex-demo-item" style="height: 80px">B</div>
    <div class="flex-demo-item" style="height: 40px">C</div>
  </ZcFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const align = ref('center')
</script>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## 换行（wrap）

通过 `wrap` 属性控制子元素是否换行。

<DemoBlock>

```vue
<template>
  <ZcRadioGroup v-model="wrap" style="margin-bottom: 16px">
    <ZcRadio value="nowrap">nowrap</ZcRadio>
    <ZcRadio value="wrap">wrap</ZcRadio>
    <ZcRadio value="wrap-reverse">wrap-reverse</ZcRadio>
  </ZcRadioGroup>

  <ZcFlex :wrap="wrap" gap="small" style="background: #f5f5f5; padding: 12px; border-radius: 4px; width: 280px">
    <div v-for="i in 8" :key="i" class="flex-demo-item">{{ i }}</div>
  </ZcFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const wrap = ref('wrap')
</script>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## 间距（gap）

通过 `gap` 属性设置子元素间距。支持预设值 `small`（8px）、`middle`（16px）、`large`（24px）或自定义数值。

<DemoBlock>

```vue
<template>
  <ZcFlex vertical gap="middle">
    <ZcFlex :gap="gap" align="center">
      <div class="flex-demo-item">1</div>
      <div class="flex-demo-item">2</div>
      <div class="flex-demo-item">3</div>
    </ZcFlex>

    <ZcRadioGroup v-model="gap">
      <ZcRadio value="small">small (8px)</ZcRadio>
      <ZcRadio value="middle">middle (16px)</ZcRadio>
      <ZcRadio value="large">large (24px)</ZcRadio>
      <ZcRadio :value="40">40px</ZcRadio>
    </ZcRadioGroup>
  </ZcFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const gap = ref('middle')
</script>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## 子项缩放（flex）

通过 `flex` 属性为容器自身设置 CSS `flex` 简写值。在嵌套布局中，内层 ZcFlex 可以按比例分配空间。

<DemoBlock>

```vue
<template>
  <ZcFlex style="height: 120px; gap: 12px">
    <ZcFlex :flex="1" align="center" justify="center" class="flex-nested">
      flex=1
    </ZcFlex>
    <ZcFlex :flex="2" align="center" justify="center" class="flex-nested">
      flex=2
    </ZcFlex>
    <ZcFlex :flex="1" align="center" justify="center" class="flex-nested">
      flex=1
    </ZcFlex>
  </ZcFlex>
</template>

<style scoped>
.flex-nested {
  background: var(--color-zc-primary-100);
  border-radius: 4px;
  color: var(--color-zc-primary-700);
  font-weight: 600;
}
</style>
```

</DemoBlock>

## 组合使用

Flex 组件的属性可以自由组合，实现复杂的布局需求。

<DemoBlock>

```vue
<template>
  <ZcFlex vertical gap="middle" style="background: #f5f5f5; padding: 16px; border-radius: 4px">
    <ZcFlex justify="space-between" align="center">
      <span style="font-weight: 600">Header</span>
      <ZcButton size="small">操作</ZcButton>
    </ZcFlex>
    <ZcFlex justify="center" align="center" gap="middle">
      <div class="flex-demo-item">A</div>
      <div class="flex-demo-item">B</div>
      <div class="flex-demo-item">C</div>
    </ZcFlex>
    <ZcFlex justify="flex-end">
      <span style="color: #999; font-size: 12px">Footer</span>
    </ZcFlex>
  </ZcFlex>
</template>

<style scoped>
.flex-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-zc-primary-500);
  color: #fff;
  border-radius: 4px;
  font-size: 18px;
}
</style>
```

</DemoBlock>

## Flex API

### Props

<ApiTable type="props" :data="[
  { name: 'vertical', description: '垂直方向排列（flex-direction: column）', type: 'boolean', default: 'false' },
  { name: 'justify', description: '主轴对齐方式', type: '\'flex-start\' | \'center\' | \'flex-end\' | \'space-between\' | \'space-around\' | \'space-evenly\'', default: '\'flex-start\'' },
  { name: 'align', description: '交叉轴对齐方式', type: '\'flex-start\' | \'center\' | \'flex-end\' | \'stretch\' | \'baseline\'', default: '\'flex-start\'' },
  { name: 'wrap', description: '换行方式', type: '\'wrap\' | \'nowrap\' | \'wrap-reverse\'', default: '\'nowrap\'' },
  { name: 'gap', description: '子元素间距，支持预设值或像素数值', type: '\'small\' | \'middle\' | \'large\' | number', default: '0' },
  { name: 'flex', description: 'CSS flex 简写，用于嵌套布局中按比例分配空间', type: 'string | number', default: '—' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: '\'div\'' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: 'Flex 容器的内容' }
]" />

### CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--zc-flex-display` | 容器的 display 属性 | `flex` |
| `--zc-flex-box-sizing` | 容器的 box-sizing | `border-box` |
| `--zc-flex-gap-small` | `gap="small"` 对应的间距值 | `8px` |
| `--zc-flex-gap-middle` | `gap="middle"` 对应的间距值 | `16px` |
| `--zc-flex-gap-large` | `gap="large"` 对应的间距值 | `24px` |
