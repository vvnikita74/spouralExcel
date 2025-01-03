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
				className={` ${error ? 'input-error' : ''}`}
				{...inputProps}
			/>
		</InputWrapper>
	)
)

export default TextInput
