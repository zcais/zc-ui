import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ZcButton from '../button/button.vue'
import ZcInput from '../input/input.vue'
import ZcSwitch from '../switch/switch.vue'
import ZcCheckbox from '../checkbox/checkbox.vue'
import ZcRadio from '../radio/radio.vue'
import ZcSelect from '../select/select.vue'
import ZcPagination from '../pagination/pagination.vue'
import ZcBreadcrumb from '../breadcrumb/breadcrumb.vue'
import ZcCollapseItem from '../collapse/collapse-item.vue'
import ZcStep from '../steps/step.vue'
import ZcTag from '../tag/tag.vue'
import ZcAlert from '../alert/alert.vue'

/**
 * axe-core unit tests for ARIA compliance.
 * Scans mounted component DOM for WCAG 2.1 AA violations.
 * Only fails on 'critical' and 'serious' impact levels.
 */

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

function setupContainer(el: HTMLElement): HTMLElement {
  const container = document.createElement('div')
  container.id = 'axe-test-container'
  container.appendChild(el)
  document.body.appendChild(container)
  return container
}

function cleanupContainer() {
  const existing = document.getElementById('axe-test-container')
  if (existing) existing.remove()
}

async function runAxe(container: HTMLElement) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: AXE_TAGS },
    resultTypes: ['violations'],
    rules: {
      // Disable color-contrast in jsdom (no layout engine)
      'color-contrast': { enabled: false },
      // Disable region rules (jsdom has no layout)
      region: { enabled: false },
      'landmark-one-main': { enabled: false },
      // aria-required-parent needs parent components — covered in E2E axe tests
      'aria-required-parent': { enabled: false },
      // list rules require full page context
      list: { enabled: false },
      // nested-interactive: label+input pattern is a known component library pattern
      'nested-interactive': { enabled: false },
    },
  })
  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  )
  return critical
}

function formatViolations(violations: any[]): string {
  if (violations.length === 0) return 'No violations found.'
  return violations
    .map((v) => `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description} — ${v.helpUrl}`)
    .join('\n')
}

describe('axe-core: Button', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcButton, { slots: { default: 'Click me' } })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Input', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcInput, {
      props: { placeholder: 'Enter text', modelValue: '' },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Switch', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcSwitch)
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Checkbox', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcCheckbox, { props: { label: 'Agree' } })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Radio', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcRadio, { props: { label: 'Option A' } })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Select', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        placeholder: 'Select',
      },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Pagination', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcPagination, {
      props: { total: 100, layout: 'prev, pager, next' },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Breadcrumb', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcBreadcrumb, {
      slots: {
        default: '<span class="zc-breadcrumb__item">Home</span>',
      },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Collapse', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcCollapseItem, {
      props: { title: 'Panel 1', name: '1' },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Steps', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcStep, {
      props: { title: 'Step 1' },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Tag', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcTag, { slots: { default: 'Tag' } })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})

describe('axe-core: Alert', () => {
  afterEach(cleanupContainer)

  it('should have zero critical/serious violations', async () => {
    const wrapper = mount(ZcAlert, {
      props: { title: 'Warning', type: 'warning' },
    })
    const container = setupContainer(wrapper.element as HTMLElement)
    const violations = await runAxe(container)
    expect(violations, formatViolations(violations)).toEqual([])
  })
})
