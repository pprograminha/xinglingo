'use client'

import React, { useEffect, useLayoutEffect } from 'react'
type BreakpointReturn = {
  useBreakpoint<B>(breakpoint: B, defaultValue?: boolean): boolean

  useBreakpointEffect<B>(breakpoint: B, effect: (match: boolean) => void): void

  useBreakpointValue<B, T, U>(breakpoint: B, valid: T, invalid: U): T | U
}
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}
function create() {
  function useBreakpoint(breakpoint: string, defaultValue?: boolean) {
    const matchRef = React.useRef(defaultValue)

    const [match, setMatch] = React.useState<boolean>(() => {
      // @ts-expect-error accessing index with uncertain `screens` type
      const value = (screens[breakpoint] as string) ?? '999999px'

      if (isBrowser && 'matchMedia' in window) {
        const query = window.matchMedia(`(min-width: ${value})`)
        matchRef.current = query.matches
      }

      if (matchRef.current === undefined && defaultValue !== undefined) {
        return defaultValue
      }

      return !!matchRef.current
    })

    useIsomorphicEffect(() => {
      if (!(isBrowser && 'matchMedia' in window)) return undefined

      function track() {
        // @ts-expect-error accessing index with uncertain `screens` type
        const value = (screens[breakpoint] as string) ?? '999999px'
        const query = window?.matchMedia(`(min-width: ${value})`)
        matchRef.current = query.matches
        if (matchRef.current !== match) {
          setMatch(matchRef.current)
        }
      }

      window.addEventListener('resize', track)
      return () => window.removeEventListener('resize', track)
    })

    return match
  }

  function useBreakpointEffect<Breakpoint extends string>(
    breakpoint: Breakpoint,
    effect: (match: boolean) => void,
  ) {
    const match = useBreakpoint(breakpoint)
    React.useEffect(() => effect(match))
    return null
  }

  function useBreakpointValue<Breakpoint extends string, T, U>(
    breakpoint: Breakpoint,
    valid: T,
    invalid: U,
  ) {
    const match = useBreakpoint(breakpoint)
    const value = React.useMemo(
      () => (match ? valid : invalid),
      [invalid, match, valid],
    )
    return value
  }

  return {
    useBreakpoint,
    useBreakpointEffect,
    useBreakpointValue,
  } as BreakpointReturn
}

export const isSSR =
  typeof window === 'undefined' ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent)

export const isBrowser = !isSSR

const useIsomorphicEffect = isBrowser ? useLayoutEffect : useEffect

export const { useBreakpoint } = create()
