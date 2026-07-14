import { describe, it, expect, vi } from 'vitest'
import { createApp, defineComponent } from 'vue'
import { withInstall, withInstallAll } from '../install'

describe('withInstall', () => {
  it('adds an install method to the component', () => {
    const Comp = defineComponent({
      name: 'ZcTest',
      template: '<div>test</div>',
    })

    const PluginComp = withInstall(Comp)
    expect(typeof PluginComp.install).toBe('function')
  })

  it('registers the component when app.use() is called', () => {
    const Comp = defineComponent({
      name: 'ZcTest',
      template: '<div>test</div>',
    })

    const PluginComp = withInstall(Comp)

    const app = createApp({})
    const componentSpy = vi.spyOn(app, 'component')

    app.use(PluginComp)

    expect(componentSpy).toHaveBeenCalledWith('ZcTest', PluginComp)
  })

  it('uses explicit name when provided', () => {
    const Comp = defineComponent({
      name: 'OriginalName',
      template: '<div>test</div>',
    })

    const PluginComp = withInstall(Comp, 'ZcCustomName')

    const app = createApp({})
    const componentSpy = vi.spyOn(app, 'component')

    app.use(PluginComp)

    expect(componentSpy).toHaveBeenCalledWith('ZcCustomName', PluginComp)
  })

  it('preserves component definition properties', () => {
    const Comp = defineComponent({
      name: 'ZcTest',
      props: { foo: { type: String, default: 'bar' } },
      template: '<div>{{ foo }}</div>',
    })

    const PluginComp = withInstall(Comp)
    expect((PluginComp as typeof Comp).name).toBe('ZcTest')
    expect((PluginComp as typeof Comp).props).toBeDefined()
  })
})

describe('withInstallAll', () => {
  it('creates a plugin that installs multiple components', () => {
    const CompA = withInstall(defineComponent({ name: 'ZcA', template: '<div>A</div>' }))
    const CompB = withInstall(defineComponent({ name: 'ZcB', template: '<div>B</div>' }))

    const plugin = withInstallAll({ ZcA: CompA, ZcB: CompB })
    expect(typeof plugin.install).toBe('function')

    const app = createApp({})
    const componentSpy = vi.spyOn(app, 'component')

    app.use(plugin)

    expect(componentSpy).toHaveBeenCalledWith('ZcA', CompA)
    expect(componentSpy).toHaveBeenCalledWith('ZcB', CompB)
  })

  it('install receives the app instance', () => {
    const plugin = withInstallAll({})
    const app = createApp({})
    app.use(plugin)
    // Plugin ran without errors
    expect(plugin.install).toBeDefined()
  })
})
