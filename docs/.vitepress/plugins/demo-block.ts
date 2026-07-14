import type { Plugin } from 'vite'

/**
 * Matches <DemoBlock ...> ... ```vue ... ``` ... </DemoBlock>
 * Captures: opening tag attrs, inner content (up to closing tag)
 */
const DEMO_BLOCK_RE = /<DemoBlock([^>]*)>([\s\S]*?)<\/DemoBlock>/g

/** Extracts the first ```vue ... ``` fenced code block */
const VUE_FENCE_RE = /```vue\s*\n([\s\S]*?)```/

/**
 * Vite plugin that transforms <DemoBlock> usage in Markdown files.
 *
 * For each DemoBlock that contains a ```vue fenced code block, this plugin:
 *   1. Extracts the Vue SFC source code.
 *   2. Creates a virtual `.vue` module so Vite compiles it into a real component.
 *   3. Injects `<template #source><DemoN /></template>` into the DemoBlock so the
 *      rendered component is visible above the code.
 *   4. Adds the import statement to a page-level `<script setup>` block.
 *
 * This makes documentation demos fully interactive without manually duplicating
 * every code example as a live template.
 */
export function demoBlockPlugin(): Plugin {
  // Virtual module store: virtualId → vue source code
  const virtualModules = new Map<string, string>()

  // Prefix for virtual module IDs.
  // IMPORTANT: Do NOT prefix resolved IDs with '\0'. The 'virtual:' scheme is
  // natively recognized by Vite as a virtual module, and keeping the id as-is
  // (without '\0') allows @vitejs/plugin-vue to process the .vue SFC content.
  // When '\0' is used, @vitejs/plugin-vue skips the module, leaving raw Vue
  // template syntax that Vite's import-analysis cannot parse.
  const PREFIX = 'virtual:zc-demo/'

  return {
    name: 'vite-plugin-zc-demo-block',
    enforce: 'pre',

    resolveId(id) {
      if (id.startsWith(PREFIX)) {
        return id
      }
    },

    load(id) {
      if (id.startsWith(PREFIX)) {
        return virtualModules.get(id) ?? null
      }
    },

    transform(code, id) {
      if (!id.endsWith('.md')) return null
      if (!code.includes('<DemoBlock')) return null

      // Reset demo index for each file
      let demoIndex = 0
      const imports: string[] = []

      // Sanitize the file id for use in virtual module names
      const fileId = id.replace(/[^\w]/g, '_')

      const transformed = code.replace(DEMO_BLOCK_RE, (fullMatch, attrs, inner) => {
        const fenceMatch = inner.match(VUE_FENCE_RE)
        if (!fenceMatch) return fullMatch

        demoIndex++
        const vueSource = fenceMatch[1].trim()
        const demoName = `ZcDemo_${fileId}_${demoIndex}`
        const virtualId = `${PREFIX}${fileId}_${demoIndex}.vue`

        // Store the virtual module
        virtualModules.set(virtualId, vueSource)

        imports.push(`import ${demoName} from '${virtualId}'`)

        // Insert the source slot right before the code fence
        const sourceSlot = `<template #source><${demoName} /></template>`
        const newInner = inner.replace(fenceMatch[0], `${sourceSlot}\n\n${fenceMatch[0]}`)

        return `<DemoBlock${attrs}>${newInner}</DemoBlock>`
      })

      if (imports.length === 0) return null

      // Prepend a <script setup> block with all demo imports.
      // VitePress will merge this with any existing script in the markdown.
      const scriptBlock = `<script setup>\n${imports.join('\n')}\n</script>\n`

      return scriptBlock + transformed
    },
  }
}
