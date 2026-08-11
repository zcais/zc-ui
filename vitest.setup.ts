/**
 * Vitest global setup — mocks browser APIs that jsdom does not implement.
 */

// ---- IntersectionObserver (used by ZcImage lazy loading) ----
class MockIntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  elements: Set<Element> = new Set()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.elements.add(target)
    // Immediately trigger as intersecting (so lazy loading works in tests)
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: {} as DOMRect,
          intersectionRect: {} as DOMRect,
          rootBounds: null,
          time: Date.now(),
        },
      ],
      this
    )
  }

  unobserve(target: Element): void {
    this.elements.delete(target)
  }

  disconnect(): void {
    this.elements.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

// ---- ResizeObserver (used by TextEllipsis, Table, etc.) ----
class MockResizeObserver {
  callback: ResizeObserverCallback
  elements: Set<Element> = new Set()

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    this.elements.add(target)
  }

  unobserve(target: Element): void {
    this.elements.delete(target)
  }

  disconnect(): void {
    this.elements.clear()
  }
}

globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

// ---- matchMedia (used by useDark, useBreakpoints) ----
if (!window.matchMedia) {
  window.matchMedia = ((query: string): MediaQueryList => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }
  }) as unknown as typeof window.matchMedia
}
