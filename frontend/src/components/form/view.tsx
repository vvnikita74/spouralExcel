import type {
  DateField,
  Field,
  SelectField,
  TableField
} from 'types/field'
import type { ZodType } from 'zod'

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import useLoader from 'utils/use-loader'

import { zodResolver } from '@hookform/resolvers/zod'
import { getErrorByKey, processValue } from './utils'
import { v4 as uuidv4 } from 'uuid'

import { Spinner } from 'components/icons/Spinner'
import DateInput, {
  dateToString,
  getDateType,
  stringToDate
} from 'components/input/date-input'
import DefectsInputs from 'components/input/defects-inputs'
import SelectInput from 'components/input/select-input'
import TableInput from 'components/input/table-input'
import TextInput from 'components/input/text-input'

export default function FormView({
  validationSchema,
  fields,
  defaultValues,
  submitFn
}: {
  validationSchema: ZodType
  fields: Field[]
  defaultValues: { [key: string]: string }
  submitFn: (data: FormData) => void
}) {
  const { btnRef, toggleLoader } = useLoader()
  const formContainerRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const fieldsForCurrentStep = fields.filter(
    field => field.step === currentStep
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const maxStep = useMemo(
    () => Math.max(...fields.map(f => f.step)),
    [fields]
  )

  const onSubmit = useCallback(
    async (data: { [key: string]: string }) => {
      toggleLoader(true)

      const formData = new FormData()

      for (const key in data) {
        formData.append(key, processValue(data[key]) || '')
      }

      const uniqueId = uuidv4()
      formData.append('filename', data.address || uniqueId)
      formData.append('uniqueId', uniqueId)

      submitFn(formData)

      toggleLoader(false)
    },
    [toggleLoader, submitFn]
  )

  const scrollFormTop = useCallback(() => {
    const { current } = formContainerRef
    if (current) current.scrollTo({ top: 0 })
  }, [])

  const onPrev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    scrollFormTop()
  }, [scrollFormTop])

  const onNext = useCallback(async () => {
    if (currentStep < maxStep) {
      const fieldNames = fieldsForCurrentStep.map(field => field.key)
      if (await trigger(fieldNames)) {
        setCurrentStep(prev => Math.min(prev + 1, maxStep))
        scrollFormTop()
      }
    } else {
      handleSubmit(onSubmit)()
    }
  }, [
    currentStep,
    fieldsForCurrentStep,
    maxStep,
    trigger,
    handleSubmit,
    onSubmit,
    scrollFormTop
  ])

  const renderField = useCallback(
    ({
      type,
      key: inputKey,
      name,
      required,
      placeholder,
      ...rest
    }: Field) => {
      switch (type) {
        case 'text': {
          return (
            <TextInput
              key={inputKey}
              name={inputKey}
              placeholder={placeholder || ''}
              required={required || false}
              label={name}
              type='text'
              error={getErrorByKey(inputKey, errors)}
              inputProps={register(inputKey)}
            />
          )
        }
        case 'select': {
          const { settings: { values = [] } = { values: [] } } =
            rest as SelectField

          return (
            <Controller
              name={inputKey}
              control={control}
              key={inputKey}
              render={({ field }) => (
                <SelectInput
                  placeholder={placeholder || ''}
                  label={name}
                  inputProps={field}
                  required={required || false}
                  values={values}
                  error={getErrorByKey(inputKey, errors)}
                />
              )}
            />
          )
        }

        case 'date': {
          const { mask } = rest as DateField

          return (
            <Controller
              name={inputKey}
              control={control}
              key={inputKey}
              render={({
                field: { value, onBlur, onChange: fieldOnChange }
              }) => {
                const dateType = getDateType(mask)

                return (
                  <DateInput
                    type={dateType}
                    name={inputKey}
                    placeholder={placeholder || ''}
                    label={name}
                    required={required || false}
                    inputProps={{
                      value: value
                        ? stringToDate(dateType, value)
                        : null,
                      onBlur,
                      onChange: (date: Date | null) => {
                        fieldOnChange(dateToString(dateType, date))
                      }
                    }}
                    error={getErrorByKey(inputKey, errors)}
                  />
                )
              }}
            />
          )
        }

        case 'table': {
          const {
            construction_type,
            settings: { cells = [] } = { cells: [] }
          } = rest as TableField

          if (!construction_type)
            return (
              <TableInput
                key={inputKey}
                name={inputKey}
                label={name}
                control={control}
                errors={
                  (errors[inputKey] as unknown as {
                    [key: string]: { message: string }
                  }[]) || []
                }
                cells={cells}
              />
            )

          return (
            <Fragment key={inputKey}>
              <Controller
                name={`${inputKey}.material`}
                control={control}
                key={`${inputKey}.material`}
                render={({ field }) => (
                  <SelectInput
                    placeholder={placeholder || ''}
                    label={name}
                    inputProps={field}
                    required={required || false}
                    values={
                      construction_type.materials.map(
                        item => item.name
                      ) || []
                    }
                    error={
                      (
                        (
                          errors?.[inputKey] as unknown as {
                            material: FieldError
                          }
                        )?.material as FieldError
                      )?.message || ''
                    }
                  />
                )}
              />
              <DefectsInputs
                errors={
                  ((
                    errors?.[inputKey] as unknown as {
                      values: FieldError[]
                    }
                  )?.values as unknown as {
                    def?: { message: string | FieldError }
                    rec?: { message: string | FieldError }
                  }[]) || []
                }
                values={construction_type.materials}
                name={`${inputKey}.values`}
                watchFieldName={`${inputKey}.material`}
                watch={watch}
                control={control}
              />
            </Fragment>
          )
        }
        default:
          return null
      }
    },
    [control, errors, register, watch]
  )

  useEffect(() => {
    formContainerRef.current = document.querySelector('div#outlet')
  }, [])

  return (
    <form
      className='base-text mb-[calc(4.25rem+var(--safe-area-inset-top,0px))] flex
        flex-col'>
      {fieldsForCurrentStep.map(renderField)}
      <div
        className='absolute bottom-0 left-0 z-10 flex w-full flex-row justify-between
          bg-white px-4 py-3'>
        <button
          type='button'
          onClick={onPrev}
          className={`base-text base-padding z-10 w-fit rounded-xl bg-indigo-500 text-white
            ${currentStep > 1 ? '' : 'pointer-events-none opacity-60'}`}>
          <span className='pointer-events-none text-inherit'>
            Назад
          </span>
        </button>
        <div
          className='absolute bottom-0 top-0 flex w-[calc(100%-2rem)] items-center
            justify-center'>
          <span className='base-padding rounded-xl bg-indigo-500 text-white'>
            {currentStep} / {maxStep}
          </span>
        </div>
        <button
          type='button'
          onClick={onNext}
          ref={btnRef}
          className='base-text btn-loader base-padding z-10 w-fit self-end rounded-xl
            bg-indigo-500 text-white'>
          <span className='pointer-events-none text-inherit'>
            {currentStep < maxStep ? 'Далее' : 'Отправить'}
          </span>
          <Spinner
            className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
              rounded-full fill-black text-white'
          />
        </button>
      </div>
    </form>
  )
}
