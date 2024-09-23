export type NextedArray<T, Depth extends number = 20> = Depth extends 1
  ? T[]
  : Depth extends 2
    ? T[] | NextedArray<T, 1>[]
    : Depth extends 3
      ? T[] | NextedArray<T, 2>[]
      : Depth extends 4
        ? T[] | NextedArray<T, 3>[]
        : Depth extends 5
          ? T[] | NextedArray<T, 4>[]
          : Depth extends 6
            ? T[] | NextedArray<T, 5>[]
            : Depth extends 7
              ? T[] | NextedArray<T, 6>[]
              : Depth extends 8
                ? T[] | NextedArray<T, 7>[]
                : Depth extends 9
                  ? T[] | NextedArray<T, 8>[]
                  : Depth extends 10
                    ? T[] | NextedArray<T, 9>[]
                    : Depth extends 11
                      ? T[] | NextedArray<T, 10>[]
                      : Depth extends 12
                        ? T[] | NextedArray<T, 11>[]
                        : Depth extends 13
                          ? T[] | NextedArray<T, 12>[]
                          : Depth extends 14
                            ? T[] | NextedArray<T, 13>[]
                            : Depth extends 15
                              ? T[] | NextedArray<T, 14>[]
                              : Depth extends 16
                                ? T[] | NextedArray<T, 15>[]
                                : Depth extends 17
                                  ? T[] | NextedArray<T, 16>[]
                                  : Depth extends 18
                                    ? T[] | NextedArray<T, 17>[]
                                    : Depth extends 19
                                      ? T[] | NextedArray<T, 18>[]
                                      : Depth extends 20
                                        ? T[] | NextedArray<T, 19>[]
                                        : never
