import type { ConstructionMaterials } from './constructions'

interface BaseField {
  type: string
  key: string
  name: string
  step: number
  position: number
  required: boolean
  placeholder?: string
}

export interface TextField extends BaseField {
  type: 'text'
  mask?: string
}

export interface SelectField extends BaseField {
  type: 'select'
  settings: {
    type?: string
    values: string[]
  }
}

export interface DateField extends BaseField {
  type: 'date'
  mask: string
}

export interface TableField extends BaseField {
  type: 'table'
  construction_type?: {
    name: string
    materials: ConstructionMaterials[]
  }
  settings: {
    cells?: TableFieldCell[]
  }
}

export type Field = TextField | TableField | DateField | SelectField

export interface TableFieldCell {
  label: string
  key: string
  mask?: string
}
