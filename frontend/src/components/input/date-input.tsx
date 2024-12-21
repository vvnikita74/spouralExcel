// import { ru } from 'date-fns/locale'
// import { useState } from 'react'
// import DatePicker, { registerLocale } from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

// registerLocale('ru', ru)

// const renderHeader =
// 	mode =>
// 	({
// 		date,
// 		decreaseMonth,
// 		increaseMonth,
// 		prevMonthButtonDisabled,
// 		nextMonthButtonDisabled
// 	}) => {
// 		const months = [
// 			'Январь',
// 			'Февраль',
// 			'Март',
// 			'Апрель',
// 			'Май',
// 			'Июнь',
// 			'Июль',
// 			'Август',
// 			'Сентябрь',
// 			'Октябрь',
// 			'Ноябрь',
// 			'Декабрь'
// 		]

// 		return (
// 			<div className='flex flex-row items-center justify-between'>
// 				<button
// 					onClick={decreaseMonth}
// 					disabled={prevMonthButtonDisabled}>
// 					{'<'}
// 				</button>
// 				{mode === 'monthYear' && (
// 					<span>{date.getFullYear()}</span>
// 				)}
// 				{mode === 'dayMonth' && (
// 					<span>{months[date.getMonth()]}</span>
// 				)}
// 				<button
// 					onClick={increaseMonth}
// 					disabled={nextMonthButtonDisabled}>
// 					{'>'}
// 				</button>
// 			</div>
// 		)
// 	}

// const CustomDatePicker = ({ mode }) => {
// 	const [selectedDate, setSelectedDate] = useState(null)

// 	const handleDateChange = date => {
// 		setSelectedDate(date)
// 	}

// 	return (
// 		<div className='m-10'>
// 			<DatePicker
// 				placeholderText='дд.мм'
// 				selected={selectedDate}
// 				onChange={handleDateChange}
// 				dateFormat={mode === 'monthYear' ? 'MM/yyyy' : 'dd/MM'}
// 				renderCustomHeader={renderHeader(mode)}
// 				className='rounded-xl border border-blue-500 p-2'
// 				locale='ru'
// 				showMonthYearPicker={mode === 'monthYear'}
// 				showFullMonthYearPicker={mode === 'monthYear'}
// 			/>
// 		</div>
// 	)
// }

// export default CustomDatePicker
