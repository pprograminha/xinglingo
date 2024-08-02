import React, { HtmlHTMLAttributes } from 'react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

export type EditableInputProps = HtmlHTMLAttributes<HTMLInputElement>

export const EditableInput: React.FC<EditableInputProps> = ({
  className,
  ...props
}) => {
  return <Input className={cn('', className)} {...props} />
}
