import type {
	FocusEvent,
	FocusEventHandler,
	InputHTMLAttributes
} from 'react'

import { ru } from 'date-fns/locale'
import Calendar from 'public/icons/calendar.svg'
import ChevronDown from 'public/icons/chevron.svg'

import { forwardRef, memo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import InputWrapper from './input-wrapper'

registerLocale('ru', ru)

const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
]

export function dateToString(
	type: 'monthYear' | 'dayMonth' | 'monthFullYear' | null,
	date: Date | null
) {
	try {
		if (type === 'monthYear') {
			const month = date.getMonth() + 1

			return `${month < 10 ? '0' + month : month}.${date.getFullYear() % 1000}`
		} else {
			return date ? date.toString() : ''
		}
	} catch {
		return ''
	}
}

export function stringToDate(
	type: 'monthYear' | 'dayMonth' | 'monthFullYear' | null,
	dateString: string | null
) {
	if (type === 'monthYear') {
		const [month, year] = dateString.split('.')
		return new Date(2000 + Number(year), Number(month) - 1, 1)
	} else {
		return new Date()
	}
}

const renderHeader =
	(type: string) =>
	({
		date,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
		changeYear
	}) => {
		const decreaseYear = () => changeYear(date.getFullYear() - 1)
		const increaseYear = () => changeYear(date.getFullYear() + 1)

		return (
			<div className='base-text flex flex-row items-center justify-between'>
				<button
					type='button'
					onClick={decreaseYear}
					disabled={prevMonthButtonDisabled}>
					<ChevronDown className='size-6 -rotate-90 !text-black' />
				</button>
				{type === 'monthYear' && <span>{date.getFullYear()}</span>}
				{type === 'dayMonth' && (
					<span>{months[date.getMonth()]}</span>
				)}
				<button
					type='button'
					onClick={increaseYear}
					disabled={nextMonthButtonDisabled}>
					<ChevronDown className='size-6 rotate-90 !text-black' />
				</button>
			</div>
		)
	}

const CustomInput = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement>
>(({ onFocus, onBlur, name, ...props }, ref) => {
	const onInputFocus = (
		event: FocusEvent<HTMLInputElement, Element>
	) => {
		const container = document.querySelector(`label[for="${name}"]`)
		console.log(container, 'focus')
		if (container) {
			container.classList.add('input-focus')
		}
		onFocus(event)
	}

	const onInputBlur = (
		event: FocusEvent<HTMLInputElement, Element>
	) => {
		const container = document.querySelector(`label[for="${name}"]`)
		console.log(container, 'blur')
		if (container) {
			container.classList.remove('input-focus')
		}
		onBlur(event)
	}

	return (
		<div className='relative flex flex-row items-center'>
			<input
				name={name}
				ref={ref}
				{...props}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
			/>
			<Calendar className='absolute right-2.5 size-6' />
		</div>
	)
})

const DateInput = memo(
	({
		name = '',
		label = '',
		placeholder = '',
		error = '',
		inputProps: { onChange, onBlur, value },
		type = 'monthYear'
	}: {
		name?: string
		type?: 'monthYear' | 'monthFullYear' | 'dayMonth'
		label?: string
		placeholder?: string
		error?: string
		mode?: string
		inputProps?: {
			onBlur: FocusEventHandler<HTMLElement>
			onChange: (date: Date | null) => void
			value?: Date | null
		}
	}) => {
		const isMonthYear =
			type === 'monthYear' || type === 'monthFullYear'

		let dateFormat: string

		switch (type) {
			case 'dayMonth':
				dateFormat = 'dd.MM'
				break
			case 'monthFullYear':
				dateFormat = 'MM.yyyy'
				break
			default:
				dateFormat = 'MM.yy'
		}

		return (
			<InputWrapper
				name={name}
				label={label}
				error={error}
				labelProps={{ htmlFor: name }}
				placeholder={placeholder}>
				<DatePicker
					name={name}
					placeholderText={placeholder}
					dateFormat={dateFormat}
					renderCustomHeader={renderHeader(type)}
					className={error ? 'input-error' : ''}
					locale='ru'
					customInput={<CustomInput />}
					showMonthYearPicker={isMonthYear}
					showFullMonthYearPicker={isMonthYear}
					onChange={onChange}
					onBlur={onBlur}
					selected={value}
				/>
			</InputWrapper>
		)
	}
)

export default DateInput
