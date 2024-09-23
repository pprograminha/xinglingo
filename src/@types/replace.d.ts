// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Replace<T, R> = T extends any
  ? R
  : T extends Array<infer U>
    ? Array<Replace<U>>
    : T
