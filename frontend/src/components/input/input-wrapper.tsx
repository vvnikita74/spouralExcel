import { LabelHTMLAttributes, ReactNode } from 'react'

export default function InputWrapper({
	label = '',
	name = '',
	placeholder = '',
	error = '',
	labelProps = {},
	children = null
}: {
	label?: string
	name?: string
	placeholder?: string
	labelProps?: LabelHTMLAttributes<HTMLLabelElement>
	children?: ReactNode
	error?: string
}) {
	return (
		<label
			{...labelProps}
			className={`input-wrapper relative block caret-black ${labelProps.className || ''}
				${error ? 'input-wrapper-error' : ''}`}>
			{label ? (
				<span className='base-text mb-1 block px-2.5'>{label}</span>
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
