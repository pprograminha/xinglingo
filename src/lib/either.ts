// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...agrs: any) => any

type EitherResult<T extends Fn> = {
  pipe: (
    ...args: Parameters<T>
  ) => Promise<[Error | null, Awaited<ReturnType<T>> | null]>
}

export function either<T extends Fn>(fn: T): EitherResult<T> {
  return {
    pipe: async (...args: Parameters<T>) => {
      try {
        return [null, await fn(args)]
      } catch (error) {
        return [error as Error, null]
      }
    },
  }
}
