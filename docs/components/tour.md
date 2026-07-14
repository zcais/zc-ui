# Tour 新手引导

用于引导用户了解产品功能的导览组件。支持高亮目标元素、遮罩镂空、多步骤导航、键盘操作等功能。

## 基础用法

通过 `v-model` 控制引导的显示和隐藏，`steps` 配置引导步骤。每个步骤通过 `target` 指定高亮元素（支持 CSS 选择器、HTMLElement 或函数）。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  {
    title: '开始引导',
    description: '欢迎使用 ZC UI！点击「下一步」继续。',
    target: '#tour-demo-btn-1',
  },
  {
    title: '功能介绍',
    description: '这是一个按钮组件，支持多种类型和尺寸。',
    target: '#tour-demo-btn-2',
  },
  {
    title: '更多功能',
    description: '探索更多组件和功能吧！',
    target: '#tour-demo-btn-3',
  },
]
</script>

<template>
  <ZcSpace>
    <ZcButton id="tour-demo-btn-1" type="primary" @click="open = true">
      开始引导
    </ZcButton>
    <ZcButton id="tour-demo-btn-2">功能按钮</ZcButton>
    <ZcButton id="tour-demo-btn-3" type="success">更多功能</ZcButton>
    <ZcTour v-model="open" :steps="steps" />
  </ZcSpace>
</template>
```

</DemoBlock>

## 弹出位置

支持 12 个方向的弹出位置：`top` / `top-start` / `top-end` / `bottom` / `bottom-start` / `bottom-end` / `left` / `left-start` / `left-end` / `right` / `right-start` / `right-end`。

可以在组件级别统一设置 `placement`，也可以在每个 step 中单独覆盖。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  {
    title: '右侧弹出',
    description: '引导面板从目标的右侧弹出。',
    target: '#tour-placement-demo',
    placement: 'right',
  },
]
</script>

<template>
  <div>
    <ZcButton id="tour-placement-demo" type="primary" @click="open = true">
      右侧弹出
    </ZcButton>
    <ZcTour v-model="open" :steps="steps" />
  </div>
</template>
```

</DemoBlock>

## 自定义指示器

通过 `indicator` 属性选择内置指示器类型，或通过 `indicator` 插槽完全自定义。

- `default`：页码（如 1/3）
- `dot`：圆点指示器
- `none`：不显示指示器

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  { title: '步骤一', description: '使用圆点指示器。', target: '#tour-dot-demo' },
  { title: '步骤二', description: '当前进度一目了然。', target: '#tour-dot-demo' },
  { title: '步骤三', description: '完成引导！', target: '#tour-dot-demo' },
]
</script>

<template>
  <div>
    <ZcButton id="tour-dot-demo" type="primary" @click="open = true">
      圆点指示器
    </ZcButton>
    <ZcTour v-model="open" :steps="steps" indicator="dot" />
  </div>
</template>
```

</DemoBlock>

## 键盘导航

开启 `keyboard` 属性后支持键盘操作：

- `ESC`：关闭引导
- `→` / `↓`：下一步
- `←` / `↑`：上一步

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  { title: '键盘操作', description: '尝试使用方向键切换步骤，ESC 关闭引导。', target: '#tour-keyboard-demo' },
]
</script>

<template>
  <div>
    <ZcButton id="tour-keyboard-demo" type="primary" @click="open = true">
      开启键盘导航
    </ZcButton>
    <ZcTour v-model="open" :steps="steps" :keyboard="true" />
  </div>
</template>
```

</DemoBlock>

## 自定义按钮文案

通过属性或插槽自定义按钮文案。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  { title: '自定义文案', description: '每个按钮的文案都可以自定义。', target: '#tour-text-demo' },
  { title: '第二步', description: '继续探索。', target: '#tour-text-demo' },
]
</script>

<template>
  <div>
    <ZcButton id="tour-text-demo" type="primary" @click="open = true">
      自定义文案
    </ZcButton>
    <ZcTour
      v-model="open"
      :steps="steps"
      prev-text="后退"
      next-text="前进"
      finish-text="结束"
      skip-text="退出"
    />
  </div>
</template>
```

</DemoBlock>

## 自定义内容

通过插槽自定义标题、描述和操作区域的渲染。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)

const steps = [
  { title: '自定义内容', description: '通过插槽完全自定义面板内容。', target: '#tour-slot-demo' },
]
</script>

<template>
  <div>
    <ZcButton id="tour-slot-demo" type="primary" @click="open = true">
      自定义内容
    </ZcButton>
    <ZcTour v-model="open" :steps="steps">
      <template #title="{ current }">
        <span style="color: var(--color-zc-primary-500)">✦ 自定义标题 #{{ current + 1 }}</span>
      </template>
      <template #actions="{ next, prev, isFirst, isLast }">
        <ZcButton size="small" :disabled="isFirst" @click="prev()">Prev</ZcButton>
        <ZcButton size="small" type="primary" @click="next()">
          {{ isLast ? 'Done' : 'Next' }}
        </ZcButton>
      </template>
    </ZcTour>
  </div>
</template>
```

</DemoBlock>

## Tour API

### Tour Props

<ApiTable type="props" :data="[
  { name: 'modelValue / v-model', description: '是否显示引导', type: 'boolean', default: 'false' },
  { name: 'open / v-model:open', description: '是否显示引导（别名）', type: 'boolean', default: 'false' },
  { name: 'steps', description: '引导步骤配置', type: 'TourStep[]', default: '[]' },
  { name: 'current / v-model:current', description: '当前步骤索引', type: 'number', default: '0' },
  { name: 'placement', description: '默认弹出位置', type: 'TourPlacement', default: '\'bottom\'' },
  { name: 'arrow', description: '是否显示箭头', type: 'boolean', default: 'true' },
  { name: 'showMask', description: '是否显示遮罩', type: 'boolean', default: 'true' },
  { name: 'closeOnOverlayClick', description: '点击遮罩是否关闭', type: 'boolean', default: 'true' },
  { name: 'keyboard', description: '是否启用键盘导航', type: 'boolean', default: 'true' },
  { name: 'gap', description: '高亮区域内边距 (px)', type: 'number', default: '6' },
  { name: 'offset', description: '面板与目标的间距 (px)', type: 'number', default: '12' },
  { name: 'maskColor', description: '遮罩颜色', type: 'string', default: '\'rgba(0,0,0,0.5)\'' },
  { name: 'zIndex', description: '层级', type: 'number', default: '—' },
  { name: 'indicator', description: '指示器类型', type: '\'default\' | \'dot\' | \'none\'', default: '\'default\'' },
  { name: 'scrollIntoViewOptions', description: '滚动到目标的选项', type: 'ScrollIntoViewOptions', default: '{ behavior: \'smooth\', block: \'center\' }' },
  { name: 'showPrevButton', description: '是否显示上一步按钮', type: 'boolean', default: 'true' },
  { name: 'showSkipButton', description: '是否显示跳过按钮', type: 'boolean', default: 'true' },
  { name: 'prevButtonText', description: '上一步按钮文案', type: 'string', default: '\'上一步\'' },
  { name: 'nextButtonText', description: '下一步按钮文案', type: 'string', default: '\'下一步\'' },
  { name: 'finishButtonText', description: '完成按钮文案', type: 'string', default: '\'完成\'' },
  { name: 'skipButtonText', description: '跳过按钮文案', type: 'string', default: '\'跳过\'' },
]" />

### TourStep

<ApiTable type="props" :data="[
  { name: 'title', description: '步骤标题', type: 'string', default: '—' },
  { name: 'description', description: '步骤描述', type: 'string', default: '—' },
  { name: 'target', description: '目标元素', type: 'string | HTMLElement | (() => HTMLElement)', default: '—' },
  { name: 'placement', description: '覆盖弹出位置', type: 'TourPlacement', default: '—' },
  { name: 'showArrow', description: '覆盖箭头显示', type: 'boolean', default: '—' },
  { name: 'gap', description: '覆盖高亮内边距', type: 'number', default: '—' },
  { name: 'offset', description: '覆盖面板间距', type: 'number', default: '—' },
]" />

### TourPlacement

```
'top' | 'top-start' | 'top-end'
'bottom' | 'bottom-start' | 'bottom-end'
'left' | 'left-start' | 'left-end'
'right' | 'right-start' | 'right-end'
```

### Tour Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '显隐状态变化', parameters: '(value: boolean)' },
  { name: 'update:open', description: '显隐状态变化', parameters: '(value: boolean)' },
  { name: 'update:current', description: '当前步骤变化', parameters: '(current: number)' },
  { name: 'change', description: '步骤切换', parameters: '(currentStep: number)' },
  { name: 'close', description: '引导关闭', parameters: '(currentStep: number)' },
  { name: 'finish', description: '引导完成（最后一步点击下一步）', parameters: '()' },
]" />

### Tour Slots

<ApiTable type="slots" :data="[
  { name: 'indicator', description: '自定义步骤指示器', type: '{ current: number, total: number }' },
  { name: 'title', description: '自定义标题', type: '{ step: TourStep, current: number }' },
  { name: 'description', description: '自定义描述内容', type: '{ step: TourStep, current: number }' },
  { name: 'actions', description: '自定义操作按钮', type: '{ step, current, prev, next, skip, isFirst, isLast }' },
  { name: 'prev-text', description: '上一步按钮文案' },
  { name: 'next-text', description: '下一步按钮文案' },
  { name: 'finish-text', description: '完成按钮文案' },
]" />

### Tour Methods (exposed)

<ApiTable type="methods" :data="[
  { name: 'open', description: '打开引导', parameters: '()' },
  { name: 'close', description: '关闭引导', parameters: '()' },
  { name: 'next', description: '下一步', parameters: '()' },
  { name: 'prev', description: '上一步', parameters: '()' },
  { name: 'goTo', description: '跳转到指定步骤', parameters: '(index: number)' },
]" />
