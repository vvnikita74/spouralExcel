import type {
	CSSProperties,
	FocusEvent,
	FocusEventHandler,
	LabelHTMLAttributes,
	MouseEvent
} from 'react'
import type { ControllerRenderProps } from 'react-hook-form'

import List from 'public/icons/list.svg'
import { memo } from 'react'
import InputWrapper, { InputWithIcon } from './input-wrapper'

const handleOpen = (
	event?: MouseEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
) => {
	const target = event.target as HTMLInputElement

	try {
		const accordion = document.getElementById(
			`accordion-${target.name}`
		)
		accordion?.classList?.add('opened')
	} catch {
		/* empty */
	}
}

const handleClose =
	(onBlur: FocusEventHandler) =>
	(event?: FocusEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement

		try {
			const accordion = document.getElementById(
				`accordion-${target.name}`
			)

			setTimeout(() => {
				accordion?.classList?.remove('opened')
			}, 0)
		} catch {
			/* empty */
		}

		onBlur(event)
	}

const handleSelect =
	(onChange: (value: string | undefined) => void) =>
	(event?: MouseEvent<HTMLButtonElement>) => {
		const target = event.target as HTMLElement
		const { value } = target.dataset

		onChange(value)
	}

const SelectInput = memo(
	({
		label = '',
		values = [],
		placeholder = '',
		error = '',
		required = false,
		inputProps,
		labelProps = {}
	}: {
		label?: string
		values?: string[]
		placeholder?: string
		error?: string
		required?: boolean
		inputProps?: ControllerRenderProps
		labelProps?: LabelHTMLAttributes<HTMLLabelElement>
	}) => {
		const { name, onBlur, onChange } = inputProps
		const onSelect = handleSelect(onChange)

		return (
			<InputWrapper
				labelProps={{
					...labelProps,
					htmlFor: name,
					id: `accordion-${name}`,
					className:
						'accordion' +
						(labelProps?.className ? ' ' + labelProps.className : '')
				}}
				label={label}
				name={name}
				error={error}
				required={required}
				placeholder={placeholder}>
				<InputWithIcon
					{...inputProps}
					id={`accordion-btn-${name}`}
					data-container-id={name}
					onMouseDown={handleOpen}
					// onFocus={handleOpen}
					onBlur={handleClose(onBlur)}
					readOnly
					containerStyle={{ width: '100%' }}
					placeholder={placeholder}
					className={`accordion-btn input-class w-full ${error ? 'input-error' : ''}`}
					icon={
						<List className='pointer-events-none size-full bg-white' />
					}
				/>
				<div
					className={`accordion-view mt-0 flex h-0 flex-col overflow-hidden rounded-xl
						border border-transparent ${error ? 'with-error' : ''}`}
					style={
						{
							'--height': values.length + (!required ? 1 : 0)
						} as CSSProperties
					}>
					{values.map(value => (
						<button
							type='button'
							onMouseDown={onSelect}
							data-container-id={name}
							className='base-text mt-2 truncate px-2.5 text-left last:mb-2'
							key={`${name}-${value}`}
							data-value={value}>
							{value}
						</button>
					))}
					{!required && (
						<button
							type='button'
							onMouseDown={onSelect}
							data-container-id={name}
							className='base-text mt-2 truncate px-2.5 text-left last:mb-2'
							data-value=''>
							{placeholder}
						</button>
					)}
				</div>
			</InputWrapper>
		)
	}
)

export default SelectInput
