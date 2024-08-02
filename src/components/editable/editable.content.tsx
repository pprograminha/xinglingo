import React, { ReactNode } from 'react'

export type EditableProps = {
  children: ReactNode
}

export const EditableContent: React.FC<EditableProps> = ({ children }) => {
  return children
}
