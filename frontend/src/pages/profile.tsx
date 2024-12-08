import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import ErrorHandler from 'layout/error-handler'
import type Report from 'types/report'

import Spinner from 'components/icons/Spinner'
import ReportsList from 'components/profile/reports-list'

export default function ProfilePage() {
	const data = useLoaderData() as {
		userData: Report[]
	}

	return (
		<Suspense
			fallback={
				<div className='flex size-full flex-col items-center justify-center'>
					<Spinner className='size-6 rounded-full fill-black text-indigo-500' />
					<span className='mt-1 text-sm'>Получение отчетов</span>
				</div>
			}>
			<Await
				resolve={data.userData}
				errorElement={
					<ErrorHandler msg='Ошибка получения данных пользователя' />
				}>
				{userData => (
					<ReportsList
						data={userData}
						queryKey={['user-data']}
						path='user/data'
					/>
				)}
			</Await>
		</Suspense>
	)
}
