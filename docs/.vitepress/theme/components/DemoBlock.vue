<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'

const props = defineProps<{
  title?: string
  defaultExpanded?: boolean
}>()

const slots = useSlots()
const isExpanded = ref(props.defaultExpanded ?? false)
const copied = ref(false)

const hasSource = computed(() => !!slots.source)

// Ref to this instance's code container (avoids global querySelector bug)
const codeContainer = ref<HTMLElement>()

async function toggleCode() {
  isExpanded.value = !isExpanded.value
}

async function copyCode() {
  if (!codeContainer.value) return
  const codeEl = codeContainer.value.querySelector('pre')
  if (codeEl) {
    const text = codeEl.textContent || ''
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    } catch {
      // Fallback - ignore clipboard errors
    }
  }
}

/**
 * Open the current example in StackBlitz.
 * Encodes the Vue SFC source as a URL parameter so the playground
 * can fetch and display it.
 */
function openInStackBlitz() {
  if (!codeContainer.value) return
  const codeEl = codeContainer.value.querySelector('pre')
  if (!codeEl) return

  const code = codeEl.textContent || ''
  // Build a minimal project that imports Zc UI and renders the example
  const appVue = code
  const mainTs = `import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
import App from './App.vue'

const app = createApp(App)
app.use(ZcUI)
app.mount('#app')`

  // The closing script tag is split so its literal does not terminate this SFC block during parsing.
  const indexHtml =
    '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>ZC UI Playground</title></head>\n<body><div id="app"></div><script type="module" src="/src/main.ts"></scr' +
    'ipt></body>\n</html>'

  // Use StackBlitz SDK URL to create a project dynamically
  const project = {
    files: {
      'src/App.vue': appVue,
      'src/main.ts': mainTs,
      'index.html': indexHtml,
    },
    title: 'ZC UI Playground',
    description: 'ZC UI component example',
    template: 'vue-ts' as const,
    dependencies: {
      vue: '^3.4.0',
      '@zc-ui/components': 'latest',
      '@zc-ui/theme': 'latest',
    },
  }

  // Open StackBlitz with the project config
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = 'https://stackblitz.com/run'
  form.target = '_blank'

  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = 'project'
  input.value = JSON.stringify(project)
  form.appendChild(input)

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
</script>

<template>
  <div class="demo-block">
    <div v-if="hasSource" class="demo-block__source">
      <slot name="source" />
    </div>
    <div class="demo-block__meta">
      <div class="demo-block__controls">
        <button
          v-if="hasSource"
          class="demo-block__control-btn demo-block__control-btn--stackblitz"
          title="在 StackBlitz 中打开"
          @click="openInStackBlitz"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="flex-shrink: 0"
          >
            <path d="M10.797 14.182H3.404L13.488 0l-2.797 7.818h7.393L8 22l2.797-7.818Z" />
          </svg>
          StackBlitz
        </button>
        <button class="demo-block__control-btn" @click="copyCode">
          {{ copied ? '✓ 已复制' : '复制代码' }}
        </button>
        <button class="demo-block__control-btn" @click="toggleCode">
          {{ isExpanded ? '隐藏代码' : '显示代码' }}
        </button>
      </div>
      <div v-show="isExpanded" class="demo-block__code">
        <div ref="codeContainer" class="demo-block__code-inner vp-raw">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
