import type { FieldErrors } from 'react-hook-form'
import type {
  DateField,
  Field,
  SelectField,
  TableField,
  TextField
} from 'types/field'
import type {
  ZodString,
  ZodObject,
  ZodTypeAny,
  ZodRawShape
} from 'zod'

import { z } from 'zod'

import { getDateMask, getDateType } from 'components/input/date-input'

export function getErrorByKey(
  inputKey: string,
  errors: FieldErrors<{ [key: string]: string }>
): string {
  if (!inputKey.includes('.')) {
    return errors[inputKey]?.message
  }

  const keys = inputKey.split('.')

  let current: unknown = errors

  for (const key of keys) {
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return typeof current === 'object' &&
    current !== null &&
    'message' in current
    ? (current as { message: string }).message
    : ''
}

export function processValue(value: unknown): string | Blob {
  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
  ) {
    return JSON.stringify(value)
  } else if (Array.isArray(value)) {
    return JSON.stringify(value)
  }
  return value as string
}

export function addFieldToSchema(
  schemaShape: Record<string, ZodTypeAny>,
  key: string,
  validator: ZodTypeAny
) {
  const keysArr = key.split('.')

  if (keysArr.length > 1) {
    const parentKey = keysArr[0]
    const childKey = keysArr[1]

    if (schemaShape[parentKey] instanceof z.ZodObject) {
      const parentSchema = schemaShape[
        parentKey
      ] as ZodObject<ZodRawShape>

      schemaShape[parentKey] = parentSchema.extend({
        [childKey]: validator
      })
    }
  } else {
    schemaShape[key] = validator
  }
}

export function generateSchema(fields: Field[]) {
  const schemaShape = {}
  const defaultValues = {}

  fields.forEach(({ type, key, ...rest }) => {
    let validator: z.ZodType

    switch (type) {
      case 'text': {
        const { required, mask, placeholder } = rest as TextField

        validator = z
          .string()
          .min(required ? 1 : 0, 'Обязательное поле')

        if (mask)
          (validator as z.ZodString).regex(
            new RegExp(mask || ''),
            'Введите корректное значение'
          )

        defaultValues[key] = required ? '' : placeholder || ''
        break
      }
      case 'select': {
        const { required, placeholder } = rest as SelectField

        validator = z
          .string()
          .min(required ? 1 : 0, 'Обязательное поле')
        defaultValues[key] = required ? '' : placeholder
        break
      }
      case 'date': {
        const { mask } = rest as DateField

        validator = z.string({
          message: 'Введите корректное значение'
        })

        const regex: RegExp = getDateMask(getDateType(mask))

        if (regex)
          validator = (validator as z.ZodString).regex(
            new RegExp(regex),
            'Введите корректное значение'
          )

        break
      }
      case 'table': {
        const {
          construction_type,
          required,
          settings: { cells = [] } = { cells: [] }
        } = rest as TableField

        const objectCellSchema: Record<string, z.ZodTypeAny> = {}
        if (!construction_type) {
          cells.forEach(({ key: cellKey, mask: cellMask }) => {
            objectCellSchema[cellKey] = z
              .string()
              .min(1, 'Введите значение')

            if (cellMask) {
              objectCellSchema[cellKey] = (
                objectCellSchema[cellKey] as ZodString
              ).regex(
                new RegExp(cellMask),
                'Введите корректное значение'
              )
            }
          })

          validator = z
            .array(z.object(objectCellSchema))
            .min(required ? 1 : 0, 'Обязательное поле')
          defaultValues[key] = []
        } else {
          objectCellSchema['material'] = z
            .string()
            .min(1, 'Выберите значение')

          objectCellSchema['values'] = z
            .array(
              z.object({
                def: z.string(),
                rec: z.string()
              })
            )
            .min(1, 'Обязательное поле')

          validator = z.object(objectCellSchema)

          defaultValues[key] = {
            material: '',
            values: []
          }
        }
      }
    }

    if (validator) addFieldToSchema(schemaShape, key, validator)
  })

  return { schemaShape: z.object(schemaShape), defaultValues }
}
