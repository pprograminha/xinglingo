const prefixKey = (key: string) => `@LingosAI:${key}`

type StorageKeys = 'firstTime' | 'getStarted:steps' | 'sound'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLocalStorage = (key: StorageKeys, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      prefixKey(key),
      typeof value === 'string' ? value : JSON.stringify(value),
    )
  }
}

const getLocalStorage = (key: StorageKeys) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(prefixKey(key))
  }

  return null
}

export const lingos = {
  prefixKey,
  storage: {
    set: setLocalStorage,
    get: getLocalStorage,
  },
}
