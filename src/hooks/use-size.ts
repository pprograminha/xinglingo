'use client'
import { MutableRefObject, useCallback, useEffect, useState } from 'react'

export const useSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const updateStates = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
      setHeight(ref.current.offsetHeight)
    }
  }, [ref])

  useEffect(() => {
    updateStates()
    window.addEventListener('resize', updateStates)

    return () => {
      window.removeEventListener('resize', updateStates)
    }
  }, [ref, updateStates])

  const getHeight = () => ref.current?.offsetHeight

  return { width, height, getHeight }
}
