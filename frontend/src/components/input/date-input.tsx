import { InputHTMLAttributes, memo } from 'react'

import { ru } from 'date-fns/locale'
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
			<div className='flex flex-row items-center justify-between'>
				<button
					type='button'
					onClick={decreaseYear}
					disabled={prevMonthButtonDisabled}>
					{'<'}
				</button>
				{type === 'monthYear' && <span>{date.getFullYear()}</span>}
				{type === 'dayMonth' && (
					<span>{months[date.getMonth()]}</span>
				)}
				<button
					type='button'
					onClick={increaseYear}
					disabled={nextMonthButtonDisabled}>
					{'>'}
				</button>
			</div>
		)
	}

const DateInput = memo(
	({
		name = '',
		label = '',
		placeholder = '',
		error = '',
		// inputProps = {},
		type = ''
	}: {
		name?: string
		type?: string
		label?: string
		placeholder?: string
		error?: string
		mode?: string
		inputProps?: InputHTMLAttributes<HTMLInputElement>
	}) => {
		const isMonthYear = type === 'monthYear'

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
					dateFormat={isMonthYear ? 'MM/yyyy' : 'dd/MM'}
					renderCustomHeader={renderHeader(type)}
					className='base-text base-padding block rounded-xl border border-indigo-500
						focus:border-indigo-800'
					locale='ru'
					showMonthYearPicker={isMonthYear}
					showFullMonthYearPicker={isMonthYear}
				/>
			</InputWrapper>
		)
	}
)

export default DateInput
