import type { MouseEvent } from 'react'
import type {
  Control,
  FieldError,
  FieldValues,
  UseFormWatch
} from 'react-hook-form'
import { ConstructionMaterials } from 'types/constructions'

import { Fragment, useCallback } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import SelectInput from './select-input'

import MinusIcon from 'assets/icons/minus.svg?react'
import PlusIcon from 'assets/icons/plus.svg?react'
import MediaInput from './media-input'

function getDefsAndRecs(
  data: ConstructionMaterials[],
  targetName: string
): {
  defs: string[]
  recs: string[]
} {
  const targetObject = data.find(item => item.name === targetName)

  if (!targetObject) return { defs: [], recs: [] }

  const result = targetObject.values.reduce(
    (acc, { def, rec }) => {
      if (def) acc.defs.add(def)
      if (rec) acc.recs.add(rec)
      return acc
    },
    { defs: new Set<string>(), recs: new Set<string>() }
  )

  return {
    defs: Array.from(result.defs),
    recs: Array.from(result.recs)
  }
}

export interface DefectsError {
  def?: { message: string | FieldError }
  rec?: { message: string | FieldError }
}

// С мемоизации багается, не ререндериться несмотря на watch

const DefectsInputs = ({
  errors,
  values,
  name,
  watchFieldName,
  watch,
  control
}: {
  errors: DefectsError[]
  values: ConstructionMaterials[]
  name: string
  watchFieldName: string
  watch: UseFormWatch<FieldValues>
  control: Control<FieldValues>
}) => {
  const material = watch(watchFieldName)

  const { defs, recs } = getDefsAndRecs(values, material)

  const { fields, append, remove } = useFieldArray({
    control,
    name
  })

  const handleDeleteItem = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { currentTarget } = event
      const { index } = currentTarget.dataset
      remove(Number(index))
    },
    [remove]
  )

  const handleAddItem = useCallback(
    () => append({ def: '', rec: '', media: [] }),
    [append]
  )

  if (defs.length === 0) return null

  if (fields.length === 0)
    return (
      <div className='mt-2.5 flex flex-col'>
        <div className='flex flex-row items-start justify-between'>
          <span className='base-text px-2.5'>
            Дефекты и рекомендации *
          </span>
          <button
            type='button'
            className={`base-text base-padding w-fit rounded-xl text-white
              ${(errors as { message?: string })?.message ? 'bg-red-500' : 'bg-indigo-500'}`}
            onClick={handleAddItem}>
            <PlusIcon className='size-5' />
          </button>
        </div>
        <span
          className={`block text-right text-sm text-red-500
            ${(errors as { message?: string })?.message ? 'h-5 opacity-100' : 'h-0 opacity-0'}`}
          id='error-text'>
          {(errors as { message?: string })?.message || ''}
        </span>
      </div>
    )

  return (
    <>
      <span className='base-text mt-2.5 px-2.5'>
        Дефекты и рекомендации *
      </span>
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <div className='mt-2.5 flex flex-col'>
            <Controller
              name={`${name}.${index}.def`}
              control={control}
              render={({ field: arrField }) => (
                <SelectInput
                  placeholder='Дефект'
                  required={true}
                  inputProps={arrField}
                  labelProps={{
                    className: 'flex flex-col'
                  }}
                  values={defs}
                  error={
                    ((errors as DefectsError[])?.values?.[index]?.def
                      ?.message as string) || ''
                  }
                />
              )}
            />
            <Controller
              name={`${name}.${index}.rec`}
              control={control}
              render={({ field: arrField }) => (
                <SelectInput
                  placeholder='Рекомендация'
                  required={true}
                  inputProps={arrField}
                  labelProps={{
                    className: 'flex flex-col mt-2.5'
                  }}
                  values={recs}
                  error={
                    ((errors as DefectsError[])?.values?.[index]?.rec
                      ?.message as string) || ''
                  }
                />
              )}
            />
            <Controller
              name={`${name}.${index}.media`}
              control={control}
              render={({ field: arrField }) => (
                <MediaInput
                  placeholder='Загрузить изображение'
                  required={false}
                  inputProps={arrField}
                  labelProps={{
                    className: 'flex flex-col mt-2.5'
                  }}
                  error={
                    ((errors as DefectsError[])?.values?.[index]
                      ?.media?.message as string) || ''
                  }
                />
              )}
            />

            <div className='relative mt-2.5 min-h-9 w-full'>
              {index + 1 === fields.length && (
                <button
                  type='button'
                  className='base-text base-padding w-fit rounded-xl bg-indigo-500 text-white'
                  onClick={handleAddItem}>
                  <PlusIcon className='size-5' />
                </button>
              )}
              <button
                type='button'
                data-index={index}
                className='base-text base-padding absolute right-0 top-0 w-fit rounded-xl
                  bg-indigo-500 text-white'
                onMouseDown={handleDeleteItem}>
                <MinusIcon className='size-5' />
              </button>
            </div>
          </div>
        </Fragment>
      ))}
    </>
  )
}

export default DefectsInputs
