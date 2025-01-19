import type {
	FocusEvent,
	InputHTMLAttributes,
	CSSProperties
} from 'react'
import { LabelHTMLAttributes, ReactNode, forwardRef } from 'react'

export default function InputWrapper({
	label = '',
	name = '',
	placeholder = '',
	error = '',
	labelProps = {},
	required = false,
	children = null
}: {
	label?: string
	name?: string
	placeholder?: string
	labelProps?: LabelHTMLAttributes<HTMLLabelElement>
	children?: ReactNode
	error?: string
	required?: boolean
}) {
	return (
		<label
			{...labelProps}
			className={`input-wrapper relative block caret-black ${labelProps.className || ''}
				${error ? 'input-wrapper-error' : ''}`}>
			{label ? (
				<span className='base-text mb-1 block px-2.5'>
					{label + (required ? ' *' : '')}
				</span>
			) : (
				<span className='sr-only'>{placeholder || name}</span>
			)}
			{children}
			<span
				className={`block text-right text-sm text-red-500
					${error ? 'h-5 opacity-100' : 'h-0 opacity-0'}`}
				id='error-text'>
				{error || ''}
			</span>
		</label>
	)
}

export const InputWithIcon = forwardRef<
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
			<div className='relative flex flex-row items-center'>
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
