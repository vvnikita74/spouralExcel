import type { FocusEventHandler } from 'react'

import 'react-datepicker/dist/react-datepicker.css'
import Calendar from 'public/icons/calendar.svg'
import Chevron from 'public/icons/chevron.svg'

import { ru } from 'date-fns/locale'
import { memo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import InputWrapper, { InputWithIcon } from './input-wrapper'

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

const dateTypes = ['monthYear', 'dayMonth', 'monthFullYear'] as const
type dateType = (typeof dateTypes)[number]

export function getDateType(
	type: string
): (typeof dateTypes)[number] {
	return dateTypes.includes(type as dateType)
		? (type as (typeof dateTypes)[number])
		: dateTypes[0]
}

export function dateToString(type: dateType, date: Date | null) {
	try {
		const month = date.getMonth() + 1

		switch (type) {
			case 'monthYear': {
				return `${month < 10 ? '0' + month : month}.${date.getFullYear() % 1000}`
			}
			case 'monthFullYear': {
				return `${month < 10 ? '0' + month : month}.${date.getFullYear()}`
			}
			default:
				return date ? date.toString() : ''
		}
	} catch {
		return ''
	}
}

export function stringToDate(
	type: dateType,
	dateString: string | null
) {
	const [month, year] = dateString.split('.')

	switch (type) {
		case 'monthYear': {
			return new Date(2000 + Number(year), Number(month) - 1, 1)
		}
		case 'monthFullYear': {
			return new Date(Number(year), Number(month) - 1, 1)
		}
		default:
			return new Date()
	}
}

export function getDateMask(type: dateType) {
	switch (type) {
		case 'monthFullYear':
			return /^(0[1-9]|1[0-2])\.\d{4}$/
		case 'dayMonth':
			break
		default:
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
					<Chevron className='pointer-events-none size-6 -rotate-90 !text-black' />
				</button>
				{(type === 'monthYear' || type === 'monthFullYear') && (
					<span>{date.getFullYear()}</span>
				)}
				{type === 'dayMonth' && (
					<span>{months[date.getMonth()]}</span>
				)}
				<button
					type='button'
					onClick={increaseYear}
					disabled={nextMonthButtonDisabled}>
					<Chevron className='pointer-events-none size-6 rotate-90 !text-black' />
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
		required = false,
		inputProps: { onChange, onBlur, value },
		type = 'monthYear'
	}: {
		name?: string
		type?: dateType
		label?: string
		required: boolean
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
				required={required}
				labelProps={{ htmlFor: name }}
				placeholder={placeholder}>
				<DatePicker
					name={name}
					placeholderText={placeholder}
					dateFormat={dateFormat}
					renderCustomHeader={renderHeader(type)}
					className={error ? 'input-error' : ''}
					locale='ru'
					customInput={
						<InputWithIcon
							icon={
								<Calendar className='pointer-events-none size-full' />
							}
						/>
					}
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
