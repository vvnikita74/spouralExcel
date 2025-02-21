import type { FocusEventHandler } from 'react'

import Calendar from 'assets/icons/calendar.svg?react'
import Chevron from 'assets/icons/chevron.svg?react'
import 'react-datepicker/dist/react-datepicker.css'

import { ru } from 'date-fns/locale'
import { memo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import InputWithIcon from './input-with-icon'
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

const dateTypes = [
	'monthYear',
	'dayMonth',
	'monthFullYear',
	'fullDate'
] as const
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
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()

		switch (type) {
			case 'monthYear': {
				return `${month}.${year % 1000}`
			}
			case 'monthFullYear': {
				return `${month}.${year}`
			}
			case 'fullDate': {
				return `${String(date.getDate()).padStart(2, '0')}.${month}.${year}`
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
	switch (type) {
		case 'monthYear': {
			const [month, year] = dateString.split('.')

			return new Date(2000 + Number(year), Number(month) - 1, 1)
		}
		case 'monthFullYear': {
			const [month, year] = dateString.split('.')

			return new Date(Number(year), Number(month) - 1, 1)
		}
		case 'fullDate': {
			const [day, month, year] = dateString.split('.').map(Number)

			return new Date(year, month - 1, day)
		}
		default:
			return new Date()
	}
}

export function getDateMask(type: dateType) {
	switch (type) {
		case 'monthFullYear':
			return /^(0[1-9]|1[0-2])\.\d{4}$/
		case 'monthYear':
			return /^(0[1-9]|1[0-2])\.\d{2}$/
		case 'fullDate':
			return /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(16[0-9]{2}|1[7-9][0-9]{2}|20[0-9]{2}|2100)$/
		default:
			return null
	}
}

const renderHeader =
	(type: string) =>
	({
		date,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
		changeYear,
		increaseMonth,
		decreaseMonth
	}) => (
		<div className='-my-0.5 flex flex-col px-2.5'>
			{type !== 'dayMonth' && (
				<div className='base-text my-0.5 flex flex-row items-center justify-between'>
					<button
						type='button'
						onClick={() => changeYear(date.getFullYear() - 1)}
						disabled={prevMonthButtonDisabled}>
						<Chevron className='pointer-events-none size-6 -rotate-90 !text-black' />
					</button>
					<span>{date.getFullYear()}</span>
					<button
						type='button'
						onClick={() => changeYear(date.getFullYear() + 1)}
						disabled={nextMonthButtonDisabled}>
						<Chevron className='pointer-events-none size-6 rotate-90 !text-black' />
					</button>
				</div>
			)}
			{(type === 'dayMonth' || type === 'fullDate') && (
				<div className='base-text my-0.5 flex flex-row items-center justify-between'>
					<button
						type='button'
						onClick={decreaseMonth}
						disabled={prevMonthButtonDisabled}>
						<Chevron className='pointer-events-none size-6 -rotate-90 !text-black' />
					</button>
					<span>{months[date.getMonth()]}</span>
					<button
						type='button'
						onClick={increaseMonth}
						disabled={nextMonthButtonDisabled}>
						<Chevron className='pointer-events-none size-6 rotate-90 !text-black' />
					</button>
				</div>
			)}
		</div>
	)

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
			case 'fullDate':
				dateFormat = 'dd.MM.yyyy'
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
