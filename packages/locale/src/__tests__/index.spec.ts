import { describe, it, expect, beforeEach } from 'vitest'
import { t, setLocale, getLocale, setFallbackLocale, getFallbackLocale, register } from '../index'

describe('locale core functions', () => {
  // Reset module-level singleton state before each test
  beforeEach(() => {
    setLocale('zh-CN')
    setFallbackLocale('zh-CN')
    register('zh-CN', {
      common: {
        confirm: '确定',
        cancel: '取消',
        loading: '加载中...',
        empty: '暂无数据',
        ok: '确定',
        save: '保存',
        delete: '删除',
        close: '关闭',
      },
    })
  })

  describe('t()', () => {
    it('translates a known key in zh-CN', () => {
      expect(t('common.confirm')).toBe('确定')
    })

    it('translates a known key in en-US', () => {
      setLocale('en-US')
      expect(t('common.confirm')).toBe('Confirm')
    })

    it('returns key itself for unknown key', () => {
      expect(t('nonexistent.key')).toBe('nonexistent.key')
    })

    it('supports named parameter interpolation', () => {
      register('zh-CN', { greeting: '你好, {name}' })
      expect(t('greeting', { name: '张三' })).toBe('你好, 张三')
    })
  })

  describe('setLocale / getLocale', () => {
    it('sets and gets the current locale', () => {
      setLocale('en-US')
      expect(getLocale()).toBe('en-US')
      setLocale('zh-CN')
      expect(getLocale()).toBe('zh-CN')
    })
  })

  describe('fallback locale', () => {
    it('setFallbackLocale / getFallbackLocale', () => {
      setFallbackLocale('en-US')
      expect(getFallbackLocale()).toBe('en-US')
      setFallbackLocale('zh-CN')
      expect(getFallbackLocale()).toBe('zh-CN')
    })

    it('falls back to fallback locale when key missing in current locale', () => {
      // Register a key ONLY in zh-CN (the fallback)
      register('zh-CN', { 'custom.fallback_test': '回退文案' })
      setLocale('en-US')

      // en-US doesn't have this key → should fall back to zh-CN
      expect(t('custom.fallback_test')).toBe('回退文案')
    })

    it('returns raw key when missing in both current and fallback locale', () => {
      setLocale('en-US')
      expect(t('totally.missing.key')).toBe('totally.missing.key')
    })

    it('respects custom fallback locale', () => {
      register('de-DE', { 'greeting.hello': 'Hallo' })
      setFallbackLocale('de-DE')

      // Current locale is zh-CN (no 'greeting.hello' registered)
      expect(t('greeting.hello')).toBe('Hallo')

      // Cleanup
      setFallbackLocale('zh-CN')
    })
  })

  describe('register()', () => {
    it('registers a new language with flat keys', () => {
      register('ja-JP', { 'common.confirm': '確認' })
      setLocale('ja-JP')
      expect(t('common.confirm')).toBe('確認')
    })

    it('registers a new language with nested keys', () => {
      register('ko-KR', { common: { confirm: '확인' } })
      setLocale('ko-KR')
      expect(t('common.confirm')).toBe('확인')
    })

    it('overrides existing keys without affecting others', () => {
      register('zh-CN', { 'common.confirm': '确认(改)' })
      expect(t('common.confirm')).toBe('确认(改)')
      expect(t('common.cancel')).toBe('取消')
    })

    it('merges new keys with existing ones', () => {
      register('zh-CN', { 'custom.key': '自定义' })
      expect(t('custom.key')).toBe('自定义')
      expect(t('common.confirm')).toBe('确定')
    })
  })
})
