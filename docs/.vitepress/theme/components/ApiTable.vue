<script setup lang="ts">
import { computed } from 'vue'
/**
 * ApiTable - Renders structured API documentation tables.
 *
 * Usage in Markdown:
 *
 * <ApiTable type="props" :data="[
 *   { name: 'type', description: '按钮类型', type: "'primary' | 'success' | ...", default: "'default'" },
 *   { name: 'size', description: '按钮尺寸', type: "'large' | 'medium' | 'small'", default: "'medium'" }
 * ]" />
 */

interface ApiRow {
  name: string
  description: string
  type?: string
  default?: string
  required?: boolean
  values?: string
  parameters?: string
}

const props = defineProps<{
  type: 'props' | 'events' | 'slots' | 'methods'
  data: ApiRow[]
}>()

const columns = computed(() => {
  switch (props.type) {
    case 'props':
      return ['参数', '说明', '类型', '默认值']
    case 'events':
      return ['事件名', '说明', '回调参数']
    case 'slots':
      return ['插槽名', '说明']
    case 'methods':
      return ['方法名', '说明', '参数']
    default:
      return ['名称', '说明']
  }
})
</script>

<template>
  <div class="api-table-wrapper">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
            <span v-if="row.required" style="color: var(--vp-c-danger-1)">*</span>
          </td>
          <td>{{ row.description }}</td>
          <td v-if="type === 'props' || type === 'events' || type === 'methods'">
            <code v-if="row.type || row.parameters">{{ row.type || row.parameters }}</code>
          </td>
          <td v-if="type === 'props'">
            <code v-if="row.default">{{ row.default }}</code>
            <span v-else style="color: var(--vp-c-text-3)">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 8px 0;
}

th,
td {
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

th {
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

td code {
  font-size: 13px;
  color: var(--vp-c-brand-1);
}

tr:hover td {
  background: var(--vp-c-bg-soft);
}
</style>
