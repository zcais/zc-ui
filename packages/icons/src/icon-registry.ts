/**
 * Global icon registry.
 *
 * Each icon's source file calls `registerIcon(name, def)` at module load
 * time, registering its raw SVG data. The dynamic `<ZcIcon name="..." />`
 * component (in @zc-ui/components) can then look up an icon by string name
 * without having to import every single icon component.
 *
 * The registry is a module-level singleton — there is exactly one instance
 * per bundle.
 */

import type { ZcIconDefinition } from './types'

const registry = new Map<string, ZcIconDefinition>()

/**
 * Register an icon by its kebab-case name.
 * Called by each individual icon's source file.
 */
export function registerIcon(name: string, def: ZcIconDefinition): void {
  registry.set(name, def)
}

/** Look up an icon's raw SVG data by kebab-case name. */
export function getIcon(name: string): ZcIconDefinition | undefined {
  return registry.get(name)
}

/** Returns all registered icon names (kebab-case). */
export function getAllIconNames(): string[] {
  return Array.from(registry.keys())
}

/** Returns all registered icon definitions. */
export function getAllIcons(): ZcIconDefinition[] {
  return Array.from(registry.values())
}

/** Total number of registered icons. */
export function getIconCount(): number {
  return registry.size
}
