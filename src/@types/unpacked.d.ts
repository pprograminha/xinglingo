export type Unpacked<T> = T extends (infer U)[]
  ? U extends (infer I)[]
    ? Unpacked<I>
    : U
  : T
