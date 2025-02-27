import type { ChangeEvent, LabelHTMLAttributes } from 'react'
import { memo, useCallback, useMemo, useRef } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'

import ImageIcon from 'assets/icons/image.svg?react'
import InputWrapper from './input-wrapper'

const handleChange =
  (onChange: (value: File | undefined) => void) =>
  (event?: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files[0]) onChange(files[0])
  }

const MediaInput = memo(
  ({
    label = '',
    placeholder = '',
    error = '',
    inputProps,
    labelProps = {},
    required = false
  }: {
    label?: string
    placeholder?: string
    error?: string
    inputProps: ControllerRenderProps
    labelProps?: LabelHTMLAttributes<HTMLLabelElement>
    required?: boolean
  }) => {
    const {
      name,
      onChange,
      value,
      ref: refCallback,
      ...inputFileProps
    } = inputProps
    const inputRef = useRef<HTMLInputElement>(null)
    const handleMediaChange = useMemo(
      () => handleChange(onChange),
      [onChange]
    )

    const setRef = useCallback(
      (instance: HTMLInputElement | null) => {
        inputRef.current = instance
        if (refCallback) {
          refCallback(instance)
        }
      },
      [refCallback]
    )

    const handleBtnClick = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    }, [])

    console.log(value?.name)

    return (
      <InputWrapper
        labelProps={{ htmlFor: name, ...labelProps }}
        name={name}
        placeholder={placeholder}
        error={error}
        required={required}
        label={label}>
        <div className='relative flex w-full flex-row items-center'>
          <button
            type='button'
            className='input-class flex flex-row items-center text-left'
            onClick={handleBtnClick}>
            {value instanceof File && (
              <img
                src={URL.createObjectURL(value)}
                width={200}
                height={200}
                alt=''
                className='h-20 w-32 object-cover'
              />
            )}
            {value?.name ? (
              <span className='ml-2.5 w-[calc(100%-10.5rem)] truncate'>
                {value.name}
              </span>
            ) : (
              <span className='max-w-4/5 truncate opacity-40'>
                Выбрать изображение
              </span>
            )}
          </button>
          <div className='absolute right-2.5 size-6'>
            <ImageIcon className='pointer-events-none w-full bg-white' />
          </div>
        </div>
        <input
          type='file'
          accept='image/*'
          name={name}
          className='hidden'
          ref={setRef}
          onChange={handleMediaChange}
          {...inputFileProps}
        />
      </InputWrapper>
    )
  }
)

export default MediaInput
