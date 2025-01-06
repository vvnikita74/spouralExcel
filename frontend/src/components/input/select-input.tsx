import ChevronDown from 'public/icons/chevron.svg'
import { CSSProperties, MouseEvent, memo } from 'react'
import InputWrapper from './input-wrapper'

type handleChangeType = (name: string, value: string) => void

export const onSelectFocus = (focusEl: HTMLElement | null = null) => {
	document
		.querySelectorAll('.accordion')
		.forEach(
			el => el && el !== focusEl && el.classList.remove('opened')
		)
}

const toggleView = (event: MouseEvent<HTMLButtonElement>) => {
	try {
		const { currentTarget } = event
		const { containerId } = currentTarget.dataset

		const accordion = document.getElementById(
			`accordion-${containerId}`
		)

		onSelectFocus(accordion)

		accordion?.classList?.toggle('opened')
	} catch {
		/* empty */
	}
}

const onChange =
	(handleChange: handleChangeType) =>
	(event: React.MouseEvent<HTMLButtonElement>) => {
		const { currentTarget } = event
		const { btnId, value, name } = currentTarget.dataset

		try {
			const accordionBtn = document.getElementById(
				`accordion-btn-${btnId}`
			)

			const btnText = accordionBtn?.querySelector(`#text-${btnId}`)

			if (btnText) {
				btnText.classList.remove('opacity-50')
				btnText.textContent = value
			}

			if (accordionBtn) accordionBtn.click()
		} catch {
			/* empty */
		}

		// Вызов оригинального onChange
		handleChange(name, value)
	}

const SelectInput = memo(
	({
		name = '',
		values = [],
		label = '',
		placeholder = '',
		error = '',
		handleChange = () => {}
	}: {
		name?: string
		values?: { name: string; value: string }[]
		label?: string
		placeholder?: string
		error?: string
		handleChange: handleChangeType
	}) => {
		return (
			<InputWrapper
				labelProps={{
					htmlFor: name,
					id: `accordion-${name}`,
					className: 'accordion'
				}}
				label={label}
				name={name}
				error={error}
				placeholder={placeholder}>
				<button
					type='button'
					id={`accordion-btn-${name}`}
					data-container-id={name}
					onClick={toggleView}
					className={`accordion-btn input-class flex w-full flex-row items-center
						justify-between text-left ${error ? 'input-error' : ''}`}>
					<span id={`text-${name}`} className='truncate opacity-50'>
						{placeholder}
					</span>
					<ChevronDown className='pointer-events-none size-6 -rotate-180' />
				</button>
				<div
					className={`accordion-view mt-0 flex h-0 flex-col overflow-hidden rounded-xl
						border border-transparent ${error ? 'with-error' : ''}`}
					style={{ '--height': values.length } as CSSProperties}>
					{values.map(({ name: valueName, value }) => (
						<button
							type='button'
							onClick={onChange(handleChange)}
							data-btn-id={name}
							className='base-text mt-2 truncate px-2.5 text-left last:mb-2'
							key={`${name}-${valueName}`}
							data-name={name}
							data-value={value}>
							{valueName}
						</button>
					))}
				</div>
			</InputWrapper>
		)
	}
)

export default SelectInput
