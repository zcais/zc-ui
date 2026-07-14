# Calendar 日历

按照日历形式展示数据或日期的容器。

## 基础用法

使用 `v-model` 绑定当前日期，支持月份/年份切换导航。

<DemoBlock>

```vue
<template>
  <ZcCalendar v-model="date" @select="onSelect" />

  <p style="margin-top: 12px;">选中日期：{{ date?.toLocaleDateString() }}</p>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date(2025, 5, 15))

function onSelect(d) {
  console.log('selected:', d)
}
</script>
```

</DemoBlock>

## 自定义周起始日

通过 `first-day-of-week` 属性设置一周的起始日（0=周日, 1=周一, 以此类推）。

<DemoBlock>

```vue
<template>
  <ZcCalendar v-model="date" :first-day-of-week="1" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date())
</script>
```

</DemoBlock>

## 日期范围高亮

通过 `range` 属性高亮指定日期范围内的所有日期。

<DemoBlock>

```vue
<template>
  <ZcCalendar v-model="date" :range="range" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date(2025, 5, 15))

const range = {
  start: new Date(2025, 5, 8),
  end: new Date(2025, 5, 22),
}
</script>
```

</DemoBlock>

## 自定义日期单元格

通过 `date-cell` 作用域插槽自定义每个日期单元格的内容，插槽提供了完整的日期信息。

<DemoBlock>

```vue
<template>
  <ZcCalendar v-model="date">
    <template #date-cell="{ data }">
      <div
        :class="['custom-cell', { 'is-holiday': holidays.includes(data.day) }]"
        v-if="data.isInMonth"
      >
        <span>{{ data.day }}</span>
        <small v-if="holidays.includes(data.day)">休</small>
      </div>
      <span v-else style="color: var(--color-zc-text-placeholder);">{{ data.day }}</span>
    </template>
  </ZcCalendar>
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date(2025, 5, 15))

const holidays = [1, 7, 13, 14, 20, 21, 27, 28]
</script>

<style scoped>
.custom-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
}

.custom-cell.is-holiday {
  color: #f56c6c;
  font-weight: 600;
}

.custom-cell small {
  font-size: 10px;
  color: #f56c6c;
}
</style>
```

</DemoBlock>

## CSS 变量自定义

通过覆盖组件内部的 CSS 变量来定制日历外观。

<DemoBlock>

```vue
<template>
  <ZcCalendar
    v-model="date"
    style="--zc-calendar-cell-size: 48px; --zc-calendar-primary: #67c23a;"
  />
</template>

<script setup>
import { ref } from 'vue'

const date = ref(new Date())
</script>
```

</DemoBlock>

## Calendar API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值，当前选中的日期（支持 v-model）', type: 'Date', default: 'new Date()' },
  { name: 'range', description: '高亮日期范围', type: 'CalendarDateRange', default: '—' },
  { name: 'firstDayOfWeek', description: '周起始日（0=周日, 1=周一, … 6=周六）', type: 'number', default: '0' },
  { name: 'dateCellRender', description: '自定义日期单元格渲染函数', type: '(data: CalendarDateCell) => string', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: Date)' },
  { name: 'select', description: '点击选择日期时触发', parameters: '(value: Date)' },
  { name: 'change', description: '选中日期变化时触发', parameters: '(value: Date)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'date-cell', description: '自定义日期单元格内容', parameters: '{ data: CalendarDateCell }' }
]" />

### Exposed Methods

<ApiTable type="methods" :data="[
  { name: 'prevMonth', description: '切换到上个月', parameters: '()' },
  { name: 'nextMonth', description: '切换到下个月', parameters: '()' },
  { name: 'prevYear', description: '切换到上一年', parameters: '()' },
  { name: 'nextYear', description: '切换到下一年', parameters: '()' },
  { name: 'goToday', description: '跳转到今天', parameters: '()' }
]" />

### CalendarDateCell 结构

| 属性        | 说明                      | 类型      |
| ----------- | ------------------------- | --------- |
| `date`      | 日期对象                  | `Date`    |
| `day`       | 日（1–31）                | `number`  |
| `isInMonth` | 是否属于当前显示月份      | `boolean` |
| `isToday`   | 是否为今天                | `boolean` |
| `isInRange` | 是否在 `range` 范围内     | `boolean` |
| `dayOfWeek` | 星期几（0=周日 – 6=周六） | `number`  |
| `text`      | 日期文本                  | `string`  |

### CSS 变量

| 变量名                        | 说明                  | 默认值                         |
| ----------------------------- | --------------------- | ------------------------------ |
| `--zc-calendar-border-color`  | 边框颜色              | `var(--color-zc-border-light)` |
| `--zc-calendar-bg`            | 背景色                | `var(--color-zc-white)`        |
| `--zc-calendar-text`          | 主文本色              | `var(--color-zc-text-primary)` |
| `--zc-calendar-primary`       | 主题色                | `var(--color-zc-primary-500)`  |
| `--zc-calendar-primary-light` | 主题浅色（悬停/范围） | `var(--color-zc-primary-50)`   |
| `--zc-calendar-cell-size`     | 单元格最小高度        | `36px`                         |
| `--zc-calendar-cell-gap`      | 单元格间距            | `2px`                          |
