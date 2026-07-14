# Space 间距

虽然我们拥有 Divider 组件，但很多时候我们需要不是一个被 Divider 组件分割开的页面结构，因此我们会重复的使用很多的 Divider 组件，这在我们的开发效率上造成了一定的困扰。间距组件就是为了解决这种困扰应运而生的。

## 基础用法

最基础的用法，通过这个组件来给组件之间提供统一的间距。

<DemoBlock>

```vue
<template>
  <ZcSpace>
    <ZcButton>按钮 1</ZcButton>
    <ZcButton>按钮 2</ZcButton>
    <ZcButton>按钮 3</ZcButton>
  </ZcSpace>
</template>
```

</DemoBlock>

## 垂直布局

使用 `direction` 来控制布局的方式，背后实际上是利用了 `flex-direction` 来控制。我们也提供垂直布局方式。

<DemoBlock>

```vue
<template>
  <ZcSpace direction="vertical">
    <ZcButton>按钮 1</ZcButton>
    <ZcButton>按钮 2</ZcButton>
    <ZcButton>按钮 3</ZcButton>
  </ZcSpace>
</template>
```

</DemoBlock>

## 控制间距的大小

通过调整 `size` 的值来控制间距的大小。可以使用内置的尺寸 `small`、`medium`、`large` 来设置大小，也可以通过自定义的 `size` 来控制大小。

<DemoBlock>

```vue

<template>
  <ZcSpace direction="vertical" alignment="start" :size="30">
    <ZcRadioGroup v-model="size">
      <ZcRadio value="small">Small</ZcRadio>
      <ZcRadio value="medium">Medium</ZcRadio>
      <ZcRadio value="large">Large</ZcRadio>
    </ZcRadioGroup>

    <ZcSpace wrap :size="size">
      <ZcCard v-for="i in 3" :key="i" style="width: 240px">
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px">
            <span>Card name</span>
            <ZcButton size="small" text>Operation</ZcButton>
          </div>
        </template>
        <div v-for="o in 4" :key="o" style="padding: 4px 0; color: #666">
          {{ 'List item ' + o }}
        </div>
      </ZcCard>
    </ZcSpace>
  </ZcSpace>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const size = ref('medium')
</script>
```

</DemoBlock>

## 自定义 Size

很多时候，内建的大小不满足需求，我们可以通过传入自己定义的大小（数值类型）来设置。

<DemoBlock>

```vue
<template>
  <ZcSpace direction="vertical" alignment="start" :size="20">
    <ZcSlider v-model="size" :min="4" :max="60" style="width: 300px" />

    <ZcSpace wrap :size="size">
      <ZcCard v-for="i in 2" :key="i" style="width: 240px">
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <span>Card name</span>
            <ZcButton size="small" text>Operation</ZcButton>
          </div>
        </template>
        <div v-for="o in 4" :key="o" style="padding: 4px 0; color: #666">
          {{ 'List item ' + o }}
        </div>
      </ZcCard>
    </ZcSpace>
  </ZcSpace>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref(20)
</script>
```

</DemoBlock>

## 自动换行

在水平模式下，通过使用 `wrap`（布尔类型）来控制自动换行行为。

<DemoBlock>

```vue
<template>
  <ZcSpace wrap>
    <div v-for="i in 20" :key="i">
      <ZcButton text>Text button {{ i }}</ZcButton>
    </div>
  </ZcSpace>
</template>
```

</DemoBlock>

## 行间分隔符

有时候，仅仅在行间加空白并不能满足日常需求，此时分隔符（`spacer`）就可以发挥非常好的作用了。

### 字符串类型分隔符

<DemoBlock>

```vue
<template>
  <ZcSpace :size="16" spacer="|">
    <div v-for="i in 2" :key="i">
      <ZcButton>button {{ i }}</ZcButton>
    </div>
  </ZcSpace>
</template>
```

</DemoBlock>

### VNode 类型分隔符

`spacer` 还可以传递 VNode。

<DemoBlock>

```vue
<template>
  <ZcSpace :size="16" :spacer="spacer">
    <div v-for="i in 2" :key="i">
      <ZcButton>button {{ i }}</ZcButton>
    </div>
  </ZcSpace>
</template>

<script setup lang="ts">
import { h } from 'vue'

const spacer = h('span', { style: 'color: #dcdfe6; font-size: 14px' }, '|')
</script>
```

</DemoBlock>

## 对齐方式

设置该值可以调整所有子节点在容器内的对齐方式，可设置的值与 `align-items` 一致。

<DemoBlock>

```vue
<template>
  <div class="alignment-container">
    <ZcSpace>
      string
      <ZcButton>button</ZcButton>
      <ZcCard>
        <template #header>header</template>
        body
      </ZcCard>
    </ZcSpace>
  </div>
  <div class="alignment-container">
    <ZcSpace alignment="flex-start">
      string
      <ZcButton>button</ZcButton>
      <ZcCard>
        <template #header>header</template>
        body
      </ZcCard>
    </ZcSpace>
  </div>
  <div class="alignment-container">
    <ZcSpace alignment="flex-end">
      string
      <ZcButton>button</ZcButton>
      <ZcCard>
        <template #header>header</template>
        body
      </ZcCard>
    </ZcSpace>
  </div>
</template>

<style>
.alignment-container {
  width: 240px;
  margin-bottom: 20px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
```

</DemoBlock>

## 填充容器

通过 `fill`（布尔类型）参数，可以控制子节点是否自动填充容器。当设置为 `fill` 时，子节点的宽度会自动适配容器的宽度。

<DemoBlock>

```vue
<template>
  <div>
    <div style="margin-bottom: 15px">fill: <ZcSwitch v-model="fill" /></div>
    <ZcSpace :fill="fill" wrap>
      <ZcCard v-for="i in 3" :key="i">
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <span>Card name</span>
            <ZcButton size="small" text>Operation</ZcButton>
          </div>
        </template>
        <div v-for="o in 4" :key="o" style="padding: 4px 0; color: #666">
          {{ 'List item ' + o }}
        </div>
      </ZcCard>
    </ZcSpace>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fill = ref(true)
</script>
```

</DemoBlock>

## 充满容器（垂直方向）

通过 `direction="vertical"` 结合 `fill` 属性让垂直排列的子元素填满容器高度。

<DemoBlock>

```vue
<template>
  <ZcSpace direction="vertical" fill style="width: 300px">
    <ZcButton>按钮 1（充满）</ZcButton>
    <ZcButton>按钮 2（充满）</ZcButton>
    <ZcButton>按钮 3（充满）</ZcButton>
  </ZcSpace>
</template>
```

</DemoBlock>

## Space API

<ApiTable type="props" :data="[
  { name: 'direction', description: '排列的方向', type: 'horizontal | vertical', default: 'horizontal' },
  { name: 'alignment', description: '对齐的方式', type: '\'start\' | \'end\' | \'center\' | \'baseline\' | \'stretch\' | flex 对应值', default: 'center' },
  { name: 'class', description: 'className', type: 'string / object / array', default: '—' },
  { name: 'style', description: '额外样式', type: 'string / object', default: '—' },
  { name: 'spacer', description: '间隔符', type: 'string / number / VNode', default: '—' },
  { name: 'size', description: '间隔大小', type: 'small | medium | large | number | [number, number]', default: 'medium' },
  { name: 'wrap', description: '设置是否自动折行', type: 'boolean', default: 'false' },
  { name: 'fill', description: '子元素是否填充父容器', type: 'boolean', default: 'false' },
  { name: 'fillRatio', description: '填充父容器的比例', type: 'number', default: '100' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'div' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '需要添加间隔的元素' }
]" />
