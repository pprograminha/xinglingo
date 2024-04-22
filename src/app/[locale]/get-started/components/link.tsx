'use client'
import { useSteps } from '@/hooks/use-steps'
import LinkPrimitive, { LinkProps as LinkPrimitiveProps } from 'next/link'

type LinkProps = LinkPrimitiveProps & {
  children?: React.ReactNode
  step: number
}

export const Link = ({ href, children, step, ...props }: LinkProps) => {
  const { setStep } = useSteps()

  return (
    <LinkPrimitive href={href} onClick={() => setStep(step)} {...props}>
      {children}
    </LinkPrimitive>
  )
}
