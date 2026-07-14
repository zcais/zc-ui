<script lang="ts">
import { defineComponent, h, type VNode, type PropType } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import type { TreeSelectOption } from './types'

const ZcTreeSelectNode = defineComponent({
  name: 'ZcTreeSelectNode',
  props: {
    node: { type: Object as PropType<TreeSelectOption>, required: true },
    level: { type: Number, required: true },
    expandedKeys: { type: Object as PropType<Set<string | number>>, required: true },
    selectedValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    checkedValues: { type: Array as PropType<(string | number)[]>, default: () => [] },
    multiple: { type: Boolean, default: false },
  },
  emits: ['toggle-expand', 'select'],
  setup(nodeProps, { emit }) {
    const nsNode = useNamespace('tree-select')

    function getLabelNode(opt: TreeSelectOption): string {
      return opt.label ?? String(opt.value)
    }
    function isLeafNode(opt: TreeSelectOption): boolean {
      return opt.isLeaf === true || !opt.children || opt.children.length === 0
    }

    return () => {
      const node = nodeProps.node
      const expanded = nodeProps.expandedKeys.has(node.value)
      const leaf = isLeafNode(node)
      const selected = !nodeProps.multiple && nodeProps.selectedValue === node.value
      const checked = nodeProps.multiple && nodeProps.checkedValues.includes(node.value)

      const nodeClasses = [
        nsNode.e('node'),
        nsNode.is('expanded', expanded),
        nsNode.is('leaf', leaf),
        nsNode.is('selected', selected || checked),
        nsNode.is('disabled', node.disabled),
      ]

      const contentChildren: VNode[] = []

      // Expand arrow
      if (!leaf) {
        contentChildren.push(
          h(
            'span',
            {
              class: nsNode.e('node-expand'),
              onClick: (e: Event) => {
                e.stopPropagation()
                emit('toggle-expand', node.value)
              },
            },
            [
              h(
                'svg',
                {
                  viewBox: '0 0 24 24',
                  width: 12,
                  height: 12,
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '2',
                },
                [
                  h('path', {
                    d: expanded ? 'M6 15l6-6 6 6' : 'M9 6l6 6-6 6',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  }),
                ]
              ),
            ]
          )
        )
      } else {
        contentChildren.push(h('span', { class: [nsNode.e('node-expand'), nsNode.is('leaf')] }))
      }

      // Checkbox
      if (nodeProps.multiple) {
        contentChildren.push(
          h('span', { class: [nsNode.e('node-checkbox'), nsNode.is('checked', checked)] }, [
            h(
              'svg',
              {
                viewBox: '0 0 24 24',
                width: 14,
                height: 14,
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
              },
              [
                h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
                checked
                  ? h('path', {
                      d: 'M7 12l3 3 7-7',
                      'stroke-linecap': 'round',
                      'stroke-linejoin': 'round',
                    })
                  : null,
              ]
            ),
          ])
        )
      }

      // Label
      contentChildren.push(h('span', { class: nsNode.e('node-label') }, getLabelNode(node)))

      const children: VNode[] = []
      children.push(
        h(
          'div',
          { class: nsNode.e('node-content'), onClick: () => emit('select', node) },
          contentChildren
        )
      )

      // Recursive children — self-reference via the named const
      if (!leaf && expanded && node.children) {
        children.push(
          ...node.children.map((child: TreeSelectOption) =>
            h(ZcTreeSelectNode, {
              key: String(child.value),
              node: child,
              level: nodeProps.level + 1,
              expandedKeys: nodeProps.expandedKeys,
              selectedValue: nodeProps.selectedValue,
              checkedValues: nodeProps.checkedValues,
              multiple: nodeProps.multiple,
              'onToggle-expand': (key: string | number) => emit('toggle-expand', key),
              onSelect: (opt: TreeSelectOption) => emit('select', opt),
            })
          )
        )
      }

      return h(
        'div',
        { class: nodeClasses, style: { paddingLeft: `${nodeProps.level * 24 + 8}px` } },
        children
      )
    }
  },
})

export default ZcTreeSelectNode
</script>
