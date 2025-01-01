'use client'
import { UnitForm } from '../components/unit-form'
import { Unit } from '../../board/[model-id]/(sidebar)/page'

type ConsoleContainerProps = {
  units: Unit[]
  currentModelId: string
}

export const ConsoleContainer = (props: ConsoleContainerProps) => {
  return <UnitForm {...props} />
}
