import { useState } from 'react'

export const useSessionStorage = <T>(
  key: string,
): [T | null, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    const item = window.sessionStorage.getItem(key)

    if (item) {
      try {
        return JSON.parse(item)
      } catch {}
    }

    return null
  })

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value)
    // Save to sessionStorage
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}
