import type { FieldErrors } from 'react-hook-form'
import type {
  DateField,
  Field,
  SelectField,
  TableField,
  TextField
} from 'types/field'
import type {
  ZodObject,
  ZodRawShape,
  ZodString,
  ZodTypeAny
} from 'zod'

import { z } from 'zod'

import { getDateMask, getDateType } from 'components/input/date-input'
import { API_URL } from 'utils/config'

type TraverseCallback<R> = (
  parent: Record<string, unknown>,
  key: string,
  value: unknown
) => R

function traverseNestedObject<T, R = void>(
  obj: Record<string, unknown>,
  callback: TraverseCallback<R>,
  inputKey?: string
): T | R {
  if (!inputKey) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          traverseNestedObject(
            value as Record<string, unknown>,
            callback
          )
        }
        callback(obj, key, value)
      }
    }
    return obj as T
  }

  if (!inputKey.includes('.')) {
    if (obj[inputKey] !== undefined) {
      return callback(obj, inputKey, obj[inputKey])
    }
    return undefined as R
  }

  const keys = inputKey.split('.')
  let current: unknown = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined as R
    }
  }

  const lastKey = keys[keys.length - 1]
  if (
    current &&
    typeof current === 'object' &&
    !Array.isArray(current)
  ) {
    return callback(
      current as Record<string, unknown>,
      lastKey,
      (current as Record<string, unknown>)[lastKey]
    )
  }

  return undefined as R
}

const getErrorCallback: TraverseCallback<string> = (
  _parent,
  _key,
  value
) => {
  return typeof value === 'object' &&
    value !== null &&
    'message' in value
    ? (value as { message: string }).message
    : ''
}

export function getErrorByKey(
  inputKey: string,
  errors: FieldErrors<Record<string, unknown>>
): string {
  return (
    traverseNestedObject<string>(
      errors,
      getErrorCallback,
      inputKey
    ) || ''
  )
}

const convertNumbersCallback: TraverseCallback<unknown> = (
  parent,
  key,
  value
) => {
  parent[key] = typeof value === 'number' ? value.toString() : value
}

function convertNumbersToStrings<T extends object>(obj: T): T {
  return traverseNestedObject<T>(
    obj as Record<string, unknown>,
    convertNumbersCallback
  ) as T
}

const extractPrefixAndIndex = (str: string) => {
  const firstPart = str.split('.')[0]
  const indexMatch = str.match(/\[(\d+)\]/)
  return indexMatch ? `${firstPart}.${indexMatch[1]}` : null
}

function extractMediaFiles(
  data: { [key: string]: unknown },
  formData: FormData,
  prefix = ''
): { [key: string]: unknown } {
  const cleanedData: { [key: string]: unknown } = {}

  traverseNestedObject<{ [key: string]: unknown }>(
    data as Record<string, unknown>,
    (_parent, key, value) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (value instanceof File) {
        const cleanedKey = extractPrefixAndIndex(fullKey)

        if (formData.get(cleanedKey)) formData.delete(cleanedKey)

        formData.append(cleanedKey, value)
      } else if (Array.isArray(value)) {
        cleanedData[key] = value.map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            return extractMediaFiles(
              item as { [key: string]: unknown },
              formData,
              `${fullKey}[${index}]`
            )
          }
          return item
        })
      } else if (typeof value === 'object' && value !== null) {
        cleanedData[key] = extractMediaFiles(
          value as { [key: string]: unknown },
          formData,
          fullKey
        )
      } else {
        cleanedData[key] = value
      }
    }
  )

  return cleanedData
}

export function appendFormData(
  formData: FormData,
  data: { [key: string]: unknown }
) {
  for (const key in data) {
    const cleanedValue = extractMediaFiles(
      { [key]: data[key] },
      formData,
      key
    )[key]

    let formValue: string | File = String(cleanedValue ?? '')

    if (cleanedValue instanceof File) formValue = cleanedValue

    if (typeof cleanedValue === 'object' && cleanedValue !== null)
      formValue = JSON.stringify(cleanedValue)

    formData.append(key, formValue)
  }
}

const createFileFromImageURL = async (
  imageURL: string,
  filename: string
): Promise<File | null> => {
  try {
    const response = await fetch(imageURL)
    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить изображение: ${response.statusText}`
      )
    }
    const blob = await response.blob()

    const file = new File([blob], filename, { type: blob.type })
    return file
  } catch {
    return null
  }
}

function findKeysWithNumber(
  obj: Record<string, unknown>,
  keyString?: string
): {
  key: string
  number: number
}[] {
  const regex = keyString
    ? new RegExp(`^${keyString.replace('.', '\\.')}\\.(\\d+)$`)
    : /\.(\d+)$/

  return Object.keys(obj)
    .map(key => {
      const match = key.match(regex)
      if (match) {
        return {
          key: key,
          number: Number(match[1])
        }
      }
      return null
    })
    .filter(result => result !== null)
    .sort((a, b) => a.number - b.number)
}

export async function generateDefaultValues(
  fields: Field[],
  initialValues?: Record<string, unknown>
) {
  const defaultValues = convertNumbersToStrings(initialValues) || {}

  const setDefaultValue = (key: string, value: unknown) => {
    const keys = key.split('.')
    let current = defaultValues

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (
        !(k in current) ||
        typeof current[k] !== 'object' ||
        current[k] === null
      ) {
        current[k] = {}
      }
      current = current[k] as Record<string, unknown>
    }

    const lastKey = keys[keys.length - 1]
    if (
      !(lastKey in current) ||
      current[lastKey] === undefined ||
      current[lastKey] === null
    ) {
      current[lastKey] = value
    }
  }

  for (const { type, key, ...rest } of fields) {
    switch (type) {
      case 'text': {
        const { required, placeholder } = rest as TextField
        setDefaultValue(key, required ? '' : placeholder || '')
        break
      }
      case 'select': {
        const { required, placeholder } = rest as SelectField
        setDefaultValue(key, required ? '' : placeholder)
        break
      }
      case 'date': {
        setDefaultValue(key, '')
        break
      }
      case 'table': {
        const { construction_type } = rest as TableField

        if (!construction_type) {
          setDefaultValue(key, [])
        } else {
          setDefaultValue(key, { material: '', values: [] })

          for (const { key: numberKey, number } of findKeysWithNumber(
            defaultValues,
            key
          )) {
            const mediaFile = await createFileFromImageURL(
              `${API_URL}/media/${initialValues[numberKey]}`,
              (initialValues[numberKey] as string) || ''
            )

            ;(
              defaultValues[key] as { values: { media: File }[] }
            ).values[number].media = mediaFile
          }
        }

        break
      }
    }
  }

  return defaultValues
}

export function generateSchema(fields: Field[]) {
  const schemaShape = {}

  const addFieldToSchema = (key: string, validator: ZodTypeAny) => {
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

  for (const { type, key, ...rest } of fields) {
    let validator: z.ZodType

    switch (type) {
      case 'text': {
        const { required, mask } = rest as TextField

        validator = z
          .string()
          .min(required ? 1 : 0, 'Обязательное поле')

        if (mask)
          (validator as z.ZodString).regex(
            new RegExp(mask || ''),
            'Введите корректное значение'
          )

        break
      }
      case 'select': {
        const { required } = rest as SelectField

        validator = z
          .string()
          .min(required ? 1 : 0, 'Обязательное поле')

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
        } else {
          objectCellSchema['material'] = z
            .string()
            .min(1, 'Выберите значение')

          objectCellSchema['values'] = z
            .array(
              z.object({
                def: z.string(),
                rec: z.string(),
                media: z.instanceof(File).optional()
              })
            )
            .min(1, 'Обязательное поле')

          validator = z.object(objectCellSchema)
        }

        break
      }
    }

    if (validator) {
      addFieldToSchema(key, validator)
    }
  }

  return z.object(schemaShape)
}
