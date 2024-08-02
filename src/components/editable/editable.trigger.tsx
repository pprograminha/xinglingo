'use client'

import { cn } from '@/lib/utils'
import { Check, Edit, X } from 'lucide-react'
import React, { HtmlHTMLAttributes, useState } from 'react'
import { Button } from '../ui/button'

export type EditableTriggerProps = HtmlHTMLAttributes<HTMLButtonElement> & {
  onEditable?: (isEdit: boolean) => void
  onSave?: (value: number | string) => void
  _inputValue?: number | string
}

export const EditableTrigger: React.FC<EditableTriggerProps> = ({
  onEditable,
  onSave,
  onClick,
  className,
  _inputValue,
  ...props
}) => {
  const [isEditable, setIsEditable] = useState(false)

  if (isEditable) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            setIsEditable(!isEditable)
            onEditable?.(!isEditable)
            onClick?.(e)
          }}
          size="icon"
          type="button"
          variant="secondary"
          className={cn('p-1 dark:text-violet-400', className)}
          {...props}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          onClick={(e) => {
            setIsEditable(!isEditable)
            onEditable?.(!isEditable)
            onClick?.(e)

            if (
              isEditable &&
              _inputValue !== undefined &&
              _inputValue !== null
            ) {
              onSave?.(_inputValue)
            }
          }}
          size="icon"
          type="button"
          variant="secondary"
          className={cn('p-1 dark:text-violet-400', className)}
          {...props}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={(e) => {
        setIsEditable(!isEditable)
        onEditable?.(!isEditable)
        onClick?.(e)

        if (isEditable && _inputValue !== undefined && _inputValue !== null) {
          onSave?.(_inputValue)
        }
      }}
      size="icon"
      type="button"
      variant="secondary"
      className={cn('p-1 dark:text-violet-400', className)}
      {...props}
    >
      <Edit className="h-4 w-4" />
    </Button>
  )
}
// {!isEditable ? (
// ) : (
//   <div className="flex gap-1">
//
//     <Check className="h-4 w-4" />
//   </div>
// )}
