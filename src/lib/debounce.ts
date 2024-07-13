/* eslint-disable @typescript-eslint/no-explicit-any */

let timeoutId: NodeJS.Timeout | null = null

type Func = (...args: any) => any

export function debounce<T extends Func>(callback: T, delay: number) {
  return ((...args: any) => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      callback(args)
    }, delay)
  }) as T
}
