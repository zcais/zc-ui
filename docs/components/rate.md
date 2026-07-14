# Rate 评分

评分组件，支持半选、自定义图标、辅助文字等功能。

## 基础用法

最基础的用法，通过 `v-model` 绑定值。

<DemoBlock>

```vue
<template>
  <ZcRate v-model="value1" />
  <ZcRate v-model="value2" disabled show-text :texts="['很差', '一般', '不错', '很好', '非常好']" />
</template>
<script setup>
import { ref } from 'vue'
const value1 = ref(3)
const value2 = ref(4)
</script>
```

</DemoBlock>

## 半选与辅助文字

设置 `allow-half` 开启半选，`show-text` 显示辅助文字。

<DemoBlock>

```vue
<template>
  <ZcRate v-model="value" allow-half show-text />
</template>
<script setup>
import { ref } from 'vue'
const value = ref(2.5)
</script>
```

</DemoBlock>

## 其他属性

通过设置不同属性展示不同效果的评分。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <span style="margin-right: 16px;">显示分数：</span>
      <ZcRate v-model="value1" show-score score-template="{value} 分" />
    </div>
    <div>
      <span style="margin-right: 16px;">自定义颜色：</span>
      <ZcRate v-model="value2" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
    </div>
    <div>
      <span style="margin-right: 16px;">只读：</span>
      <ZcRate v-model="value3" readonly />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value1 = ref(3.7)
const value2 = ref(4)
const value3 = ref(5)
</script>
```

</DemoBlock>

## Rate API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'number', default: '0' },
{ name: 'max', description: '最大分值', type: 'number', default: '5' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'disabled', description: '是否为只读', type: 'boolean', default: 'false' },
{ name: 'allowHalf', description: '是否允许半选', type: 'boolean', default: 'false' },
{ name: 'lowThreshold', description: '低分和中等分数的界限值', type: 'number', default: '2' },
{ name: 'highThreshold', description: '中等分数和高分的界限值', type: 'number', default: '4' },
{ name: 'colors', description: '图标颜色数组', type: 'string[]', default: `['#F7BA2A', '#F7BA2A', '#F7BA2A']` },
{ name: 'voidColor', description: '未选中图标颜色', type: 'string', default: `'#C6D1DE'` },
{ name: 'disabledVoidColor', description: '禁用时未选中颜色', type: 'string', default: `'#EFF2F7'` },
{ name: 'showText', description: '是否显示辅助文字', type: 'boolean', default: 'false' },
{ name: 'showScore', description: '是否显示当前分数', type: 'boolean', default: 'false' },
{ name: 'textColor', description: '辅助文字颜色', type: 'string', default: `''` },
{ name: 'texts', description: '辅助文字数组', type: 'string[]', default: `['极差','失望','一般','满意','惊喜']` },
{ name: 'scoreTemplate', description: '分数显示模板', type: 'string', default: `'{value}'` },
{ name: 'clearable', description: '是否可以再次点击清除', type: 'boolean', default: 'false' },
{ name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '评分变化时触发', parameters: '(value: number, oldValue: number)' },
]" />
