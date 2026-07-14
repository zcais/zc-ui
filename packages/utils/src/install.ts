import type { App, Plugin, Component } from 'vue'

/**
 * Augment a Vue component with an `install` method so it can be registered
 * via `app.use(Component)` or used individually with tree-shaking.
 *
 * The returned component is typed as the original component intersected with
 * `Plugin`, ensuring both the component itself and the `install` method are
 * accessible.
 *
 * @example
 * import Button from './button.vue'
 * export const ZcButton = withInstall(Button, 'ZcButton')
 *
 * // In app entry:
 * app.use(ZcButton) // registers <ZcButton> globally
 *
 * // Or import individually:
 * import { ZcButton } from '@zc-ui/components'
 */
export function withInstall<T extends Component>(component: T, name?: string): T & Plugin {
  const componentWithInstall = component as T & Plugin

  componentWithInstall.install = (app: App) => {
    const registeredName = name || (component as { name?: string }).name
    if (registeredName) {
      app.component(registeredName, componentWithInstall)
    }
  }

  return componentWithInstall
}

/**
 * Create a single plugin that installs multiple components at once.
 *
 * @example
 * export default withInstallAll({ ZcButton, ZcInput })
 */
export function withInstallAll(components: Record<string, Component & Plugin>): Plugin {
  return {
    install(app: App) {
      for (const [name, comp] of Object.entries(components)) {
        app.component(name, comp)
      }
    },
  }
}
