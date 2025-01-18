import { InputHTMLAttributes, memo } from 'react'
import InputWrapper from './input-wrapper'

const TextInput = memo(
	({
		name = '',
		type = 'text',
		label = '',
		placeholder = '',
		error = '',
		inputProps = {},
		required = false
	}: {
		name?: string
		type?: string
		label?: string
		placeholder?: string
		error?: string
		inputProps?: InputHTMLAttributes<HTMLInputElement>
		required: boolean
	}) => (
		<InputWrapper
			labelProps={{ htmlFor: name }}
			name={name}
			placeholder={placeholder}
			error={error}
			required={required}
			label={label}>
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				className={`${error ? 'input-error' : ''}`}
				{...inputProps}
			/>
		</InputWrapper>
	)
)

export default TextInput
