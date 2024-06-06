'use client'
import { useSteps } from '@/hooks/use-steps'
import { Link as LinkPrimitive } from '@/navigation'
import React from 'react'

type LinkProps = {
  className?: string
  href: string
  children?: React.ReactNode
  step: number
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const Link = ({
  href,
  children,
  step,
  onClick,
  ...props
}: LinkProps) => {
  const { setStep } = useSteps()

  return (
    <LinkPrimitive
      href={href}
      onClick={(e) => {
        setStep(step)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </LinkPrimitive>
  )
}
