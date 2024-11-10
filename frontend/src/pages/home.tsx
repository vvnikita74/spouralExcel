import { Link } from 'react-router-dom'

export default function HomePage() {
	return (
		<div className='flex size-full flex-col items-center justify-center'>
			<div className='max-w-96 overflow-hidden rounded-xl border border-indigo-500 p-4'>
				<h2 className='text-xl font-medium sm:text-2xl'>
					Аварийные объекты
				</h2>
				<Link
					to='emergencyreport'
					className='base-padding mt-4 block rounded-xl bg-indigo-500 text-center
						text-white'>
					Начать заполнение
				</Link>
				<Link
					to='emergencyreport?type=continue'
					className='base-padding pointer-events-none mt-4 block rounded-xl
						bg-indigo-500 text-center text-white opacity-60'>
					Продолжить заполнение (В разработке)
				</Link>
			</div>
		</div>
	)
}
