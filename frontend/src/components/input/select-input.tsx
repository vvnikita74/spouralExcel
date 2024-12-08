import ChevronDown from 'public/icons/chevron.svg'
import { CSSProperties, MouseEvent, memo } from 'react'

type handleChangeType = (name: string, value: string) => void

const toggleView = (event: MouseEvent<HTMLButtonElement>) => {
	try {
		const { currentTarget } = event

		const { containerId } = currentTarget.dataset
		if (containerId)
			document
				.getElementById(`accordion-${containerId}`)
				?.classList?.toggle('accordion-opened')

		currentTarget?.classList?.toggle('accordion-btn-opened')
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
			<label
				className='relative block caret-black transition-colors'
				htmlFor={name}>
				{label ? (
					<span className='base-text mb-1 block px-2.5'>{label}</span>
				) : (
					<span className='sr-only'>{placeholder || name}</span>
				)}
				<button
					type='button'
					id={`accordion-btn-${name}`}
					data-container-id={name}
					onClick={toggleView}
					className={`base-text base-padding flex w-full flex-row items-center
						justify-between rounded-xl border text-left transition-colors
						${error ? 'with-error border-red-500' : 'border-indigo-500'}`}>
					<span
						id={`text-${name}`}
						className='opacity-50 transition-opacity'>
						{placeholder}
					</span>
					<ChevronDown
						className={`pointer-events-none size-6 -rotate-180 transition-[transform,color]
							${error ? 'text-red-500' : 'text-indigo-500'}`}
					/>
				</button>
				<div
					id={`accordion-${name}`}
					className={`mt-0 flex h-0 flex-col overflow-hidden rounded-xl border
						border-transparent transition-[height,border-color,margin]
						${error ? 'with-error' : ''}`}
					style={{ '--height': values.length } as CSSProperties}>
					{values.map(({ name: valueName, value }) => (
						<button
							type='button'
							onClick={onChange(handleChange)}
							data-btn-id={name}
							className='base-text mt-2 px-2.5 text-left last:mb-2'
							key={`${name}-${valueName}`}
							data-name={name}
							data-value={value}>
							{valueName}
						</button>
					))}
				</div>
				<span
					className={`block text-right text-sm text-red-500 transition-[opacity,height]
						${error ? 'h-5 opacity-100' : 'h-0 opacity-0'}`}
					id='error-text'>
					{error || ''}
				</span>
			</label>
		)
	}
)

export default SelectInput
