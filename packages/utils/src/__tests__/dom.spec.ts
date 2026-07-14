import { describe, it, expect, beforeEach } from 'vitest'
import {
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  on,
  off,
  once,
  querySelector,
  querySelectorAll,
  matches,
  closest,
  contains,
  isClient,
} from '../dom'

describe('DOM class utilities', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('hasClass', () => {
    it('returns true if element has the class', () => {
      el.classList.add('foo')
      expect(hasClass(el, 'foo')).toBe(true)
    })

    it('returns false if element does not have the class', () => {
      expect(hasClass(el, 'foo')).toBe(false)
    })
  })

  describe('addClass', () => {
    it('adds a single class', () => {
      addClass(el, 'foo')
      expect(el.classList.contains('foo')).toBe(true)
    })

    it('adds multiple space-separated classes', () => {
      addClass(el, 'foo bar baz')
      expect(el.classList.contains('foo')).toBe(true)
      expect(el.classList.contains('bar')).toBe(true)
      expect(el.classList.contains('baz')).toBe(true)
    })
  })

  describe('removeClass', () => {
    it('removes a single class', () => {
      el.classList.add('foo', 'bar')
      removeClass(el, 'foo')
      expect(el.classList.contains('foo')).toBe(false)
      expect(el.classList.contains('bar')).toBe(true)
    })

    it('removes multiple space-separated classes', () => {
      el.classList.add('foo', 'bar', 'baz')
      removeClass(el, 'foo bar')
      expect(el.classList.contains('foo')).toBe(false)
      expect(el.classList.contains('bar')).toBe(false)
      expect(el.classList.contains('baz')).toBe(true)
    })
  })

  describe('toggleClass', () => {
    it('toggles a class on', () => {
      toggleClass(el, 'active')
      expect(el.classList.contains('active')).toBe(true)
    })

    it('toggles a class off', () => {
      el.classList.add('active')
      toggleClass(el, 'active')
      expect(el.classList.contains('active')).toBe(false)
    })
  })
})

describe('DOM event utilities', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
  })

  describe('on / off', () => {
    it('adds an event listener that fires on trigger', () => {
      let count = 0
      on(el, 'click', () => count++)
      el.dispatchEvent(new MouseEvent('click'))
      expect(count).toBe(1)
    })

    it('returns a cleanup function that removes the listener', () => {
      let count = 0
      const cleanup = on(el, 'click', () => count++)
      el.dispatchEvent(new MouseEvent('click'))
      cleanup()
      el.dispatchEvent(new MouseEvent('click'))
      expect(count).toBe(1)
    })

    it('off removes the listener', () => {
      let count = 0
      const handler = () => count++
      on(el, 'click', handler)
      off(el, 'click', handler)
      el.dispatchEvent(new MouseEvent('click'))
      expect(count).toBe(0)
    })

    it('supports capture option', () => {
      const order: string[] = []
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)

      on(parent, 'click', () => order.push('parent'), true) // capture
      on(child, 'click', () => order.push('child'), false)

      child.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(order).toEqual(['parent', 'child'])
    })

    it('works on window target', () => {
      let count = 0
      const cleanup = on(window, 'resize', () => count++)
      window.dispatchEvent(new Event('resize'))
      cleanup()
      expect(count).toBe(1)
    })

    it('works on document target', () => {
      let count = 0
      const cleanup = on(document, 'keydown', () => count++)
      document.dispatchEvent(new KeyboardEvent('keydown'))
      cleanup()
      expect(count).toBe(1)
    })
  })

  describe('once', () => {
    it('fires only once and auto-removes', () => {
      let count = 0
      once(el, 'click', () => count++)
      el.dispatchEvent(new MouseEvent('click'))
      el.dispatchEvent(new MouseEvent('click'))
      el.dispatchEvent(new MouseEvent('click'))
      expect(count).toBe(1)
    })

    it('returns a cleanup function', () => {
      let count = 0
      const cleanup = once(el, 'click', () => count++)
      cleanup()
      el.dispatchEvent(new MouseEvent('click'))
      expect(count).toBe(0)
    })
  })
})

describe('DOM query utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('querySelector', () => {
    it('finds a single element', () => {
      const div = document.createElement('div')
      div.id = 'test'
      document.body.appendChild(div)

      const result = querySelector('#test')
      expect(result).toBe(div)
    })

    it('returns null when not found', () => {
      expect(querySelector('#nonexistent')).toBeNull()
    })
  })

  describe('querySelectorAll', () => {
    it('finds all matching elements', () => {
      const div1 = document.createElement('div')
      div1.className = 'item'
      const div2 = document.createElement('div')
      div2.className = 'item'
      document.body.append(div1, div2)

      const results = querySelectorAll('.item')
      expect(results).toHaveLength(2)
    })

    it('returns empty array when no matches', () => {
      expect(querySelectorAll('.nonexistent')).toEqual([])
    })
  })

  describe('matches', () => {
    it('returns true when element matches selector', () => {
      const el = document.createElement('div')
      el.className = 'foo'
      expect(matches(el, '.foo')).toBe(true)
    })

    it('returns false when element does not match', () => {
      const el = document.createElement('div')
      expect(matches(el, '.foo')).toBe(false)
    })
  })

  describe('closest', () => {
    it('finds the closest matching ancestor', () => {
      const parent = document.createElement('div')
      parent.className = 'parent'
      const child = document.createElement('span')
      parent.appendChild(child)

      expect(closest(child, '.parent')).toBe(parent)
    })

    it('returns the element itself if it matches', () => {
      const el = document.createElement('div')
      el.className = 'self'
      expect(closest(el, '.self')).toBe(el)
    })

    it('returns null when no ancestor matches', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      expect(closest(el, '.nonexistent')).toBeNull()
    })
  })

  describe('contains', () => {
    it('returns true when parent contains child', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      expect(contains(parent, child)).toBe(true)
    })

    it('returns true when parent is the same node', () => {
      const el = document.createElement('div')
      expect(contains(el, el)).toBe(true)
    })

    it('returns false when parent does not contain child', () => {
      const a = document.createElement('div')
      const b = document.createElement('span')
      expect(contains(a, b)).toBe(false)
    })
  })
})

describe('isClient (from dom)', () => {
  it('is true in jsdom', () => {
    expect(isClient).toBe(true)
  })
})
