import type {
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode
} from 'react'

import { forwardRef } from 'react'

const InputWithIcon = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    icon?: ReactNode
    containerStyle?: CSSProperties
  }
>(
  (
    {
      onFocus,
      onBlur,
      name,
      className,
      containerStyle,
      icon,
      ...props
    },
    ref
  ) => {
    const onInputFocus = (
      event?: FocusEvent<HTMLInputElement, Element>
    ) => {
      const container = document.querySelector(`label[for="${name}"]`)

      if (container) container.classList.add('input-focus')

      if (onFocus) onFocus(event)
    }

    const onInputBlur = (
      event?: FocusEvent<HTMLInputElement, Element>
    ) => {
      const container = document.querySelector(`label[for="${name}"]`)

      if (container) container.classList.remove('input-focus')

      if (onBlur) onBlur(event)
    }

    return (
      <div className='relative flex w-full flex-row items-center'>
        <input
          name={name}
          ref={ref}
          {...props}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          readOnly
          className={`${className} cursor-pointer`}
        />
        <div className='absolute right-2.5 size-6'>{icon}</div>
      </div>
    )
  }
)

export default InputWithIcon
