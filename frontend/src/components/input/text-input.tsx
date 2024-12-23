import { InputHTMLAttributes, memo } from 'react'
import InputWrapper from './input-wrapper'

const TextInput = memo(
	({
		name = '',
		type = 'text',
		label = '',
		placeholder = '',
		error = '',
		inputProps = {}
	}: {
		name?: string
		type?: string
		label?: string
		placeholder?: string
		error?: string
		inputProps?: InputHTMLAttributes<HTMLInputElement>
	}) => (
		<InputWrapper
			labelProps={{ htmlFor: name }}
			name={name}
			placeholder={placeholder}
			error={error}
			label={label}>
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				className={`base-text base-padding block rounded-xl border
					${error ? 'border-red-500 placeholder:text-red-500 focus:border-red-500' : 'border-indigo-500 focus:border-indigo-800'}`}
				{...inputProps}
			/>
		</InputWrapper>
	)
)

export default TextInput
