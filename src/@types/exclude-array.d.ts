// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExcludeArray<T> = T extends Array<any> ? never : T
