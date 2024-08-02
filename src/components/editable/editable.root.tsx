'use client'

import React, { ReactNode, useState } from 'react'
import { Editable } from '.'

export type EditableProps = {
  children: ReactNode
}
type GetChildrenData = {
  children: React.ReactNode
  _inputValue?: number | string
  onEditable?: (isEdit: boolean) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  childType: (typeof Editable)[keyof typeof Editable]
}
function extractValueProp(element: React.ReactNode | React.ReactNode[]) {
  if (!element) {
    return
  }

  if (Array.isArray(element)) {
    return element
      .map((el) => {
        if (React.isValidElement(el)) {
          return (
            el.props.value !== undefined
              ? el.props.value
              : el.props.defaultValue
          ) as number | string
        }
        return null!
      })
      .filter(Boolean)[0]
  }

  if (React.isValidElement(element)) {
    return (
      element.props.value !== undefined
        ? element.props.value
        : element.props.defaultValue
    ) as number | string
  }
}

const getChildren = ({
  childType,
  onEditable,
  onChange,
  _inputValue,
  children,
}: GetChildrenData) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === childType) {
      return React.cloneElement(
        child,
        {
          onEditable,
          _inputValue,
          onChange,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        child.props.children,
      )
    }
    return null
  })
}

export const EditableRoot: React.FC<EditableProps> = ({ children }) => {
  const [isEditable, setIsEditable] = useState(false)
  const [inputValue, setInputValue] = useState(
    extractValueProp(
      getChildren({
        children,
        childType: Editable.Input,
      }),
    ),
  )

  const handlerEditable = (isEdit: boolean) => setIsEditable(isEdit)

  const contentChildren = getChildren({
    children,
    childType: Editable.Content,
  })

  const inputChildren = getChildren({
    children,
    onChange: (e) => setInputValue(e.target.value),
    childType: Editable.Input,
  })

  const triggerChildren = getChildren({
    children,
    _inputValue: inputValue,
    onEditable: handlerEditable,
    childType: Editable.Trigger,
  })

  return (
    <div className="flex items-center gap-2">
      {isEditable ? inputChildren : contentChildren}
      {triggerChildren}
    </div>
  )
}
