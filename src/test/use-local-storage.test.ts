import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/use-local-storage'
import { createMockLocalStorage } from './utils'

describe('useLocalStorage', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    mockStorage = createMockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    })
    vi.clearAllMocks()
  })

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    expect(result.current[0]).toBe('default-value')
    expect(mockStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should return stored value when it exists', () => {
    mockStorage.getItem.mockReturnValue(JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
    expect(result.current[0]).toBe('new-value')
  })

  it('should handle function updates', () => {
    mockStorage.getItem.mockReturnValue(JSON.stringify(5))
    
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    
    expect(result.current[0]).toBe(6)
    expect(mockStorage.setItem).toHaveBeenCalledWith('counter', JSON.stringify(6))
  })

  it('should handle complex objects', () => {
    const complexObject = {
      id: 1,
      name: 'Test',
      nested: { prop: 'value' },
      array: [1, 2, 3]
    }
    
    const { result } = renderHook(() => useLocalStorage('complex', {}))
    
    act(() => {
      result.current[1](complexObject)
    })
    
    expect(result.current[0]).toEqual(complexObject)
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'complex',
      JSON.stringify(complexObject)
    )
  })

  it('should handle arrays', () => {
    const arrayValue = ['item1', 'item2', 'item3']
    
    const { result } = renderHook(() => useLocalStorage('array', []))
    
    act(() => {
      result.current[1](arrayValue)
    })
    
    expect(result.current[0]).toEqual(arrayValue)
  })

  it('should handle null and undefined values', () => {
    const { result } = renderHook(() => useLocalStorage('nullable', 'default'))
    
    act(() => {
      result.current[1](null)
    })
    
    expect(result.current[0]).toBe(null)
    expect(mockStorage.setItem).toHaveBeenCalledWith('nullable', JSON.stringify(null))
  })

  it('should fall back to initial value when JSON parsing fails', () => {
    mockStorage.getItem.mockReturnValue('invalid-json{')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
  })

  it('should handle storage errors gracefully', () => {
    mockStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    // Should not throw error
    act(() => {
      result.current[1]('new-value')
    })
    
    // Value should still be updated in memory even if storage fails
    expect(result.current[0]).toBe('new-value')
  })

  it('should respond to storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('shared-key', 'initial'))
    
    // Simulate storage event from another tab by directly calling the handler
    const mockEvent = {
      key: 'shared-key',
      newValue: JSON.stringify('updated-from-other-tab'),
      storageArea: window.localStorage
    } as StorageEvent
    
    act(() => {
      // Trigger the storage event handler directly
      window.dispatchEvent(Object.assign(new Event('storage'), mockEvent))
    })
    
    expect(result.current[0]).toBe('updated-from-other-tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('my-key', 'initial'))
    
    const mockEvent = {
      key: 'other-key',
      newValue: JSON.stringify('other-value'),
      storageArea: window.localStorage
    } as StorageEvent
    
    act(() => {
      window.dispatchEvent(Object.assign(new Event('storage'), mockEvent))
    })
    
    expect(result.current[0]).toBe('initial')
  })

  it('should handle storage events with null newValue (key deleted)', () => {
    mockStorage.getItem.mockReturnValue(JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('deletable-key', 'default'))
    
    expect(result.current[0]).toBe('stored-value')
    
    const mockEvent = {
      key: 'deletable-key',
      newValue: null,
      storageArea: window.localStorage
    } as StorageEvent
    
    act(() => {
      window.dispatchEvent(Object.assign(new Event('storage'), mockEvent))
    })
    
    expect(result.current[0]).toBe('default')
  })

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function))
    
    removeEventListenerSpy.mockRestore()
  })
})