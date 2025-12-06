import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook that mimics the useKV behavior but uses localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value if nothing is stored
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage when value changes
  const setStoredValue = useCallback((newValue: React.SetStateAction<T>) => {
    try {
      setValue((currentValue) => {
        const valueToStore = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(currentValue) 
          : newValue
        
        try {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
        } catch (storageError) {
          console.warn(`Error setting localStorage key "${key}":`, storageError)
          // Don't throw - just continue with the state update
        }
        
        return valueToStore
      })
    } catch (error) {
      console.warn(`Error updating state for localStorage key "${key}":`, error)
    }
  }, [key])

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue === null) {
          // Key was deleted, revert to default value
          setValue(defaultValue)
        } else {
          try {
            setValue(JSON.parse(e.newValue))
          } catch (error) {
            console.warn(`Error parsing storage event for key "${key}":`, error)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [value, setStoredValue]
}