'use client'
import { MutableRefObject, useCallback, useEffect, useState } from 'react'

export const useSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0)

  const updateWidth = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }, [ref])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [ref, updateWidth])

  return { width }
}
