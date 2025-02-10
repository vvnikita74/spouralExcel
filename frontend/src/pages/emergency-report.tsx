import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'

import type { Field } from 'types/field'

import FormManager from 'components/form/form-manager'
import Spinner from 'components/icons/Spinner'
import ErrorHandler from 'layout/error-handler'

export default function EmergencyReportPage() {
	const data = useLoaderData() as {
		fields: Field[]
	}

	return (
		<Suspense
			fallback={
				<div className='flex size-full flex-col items-center justify-center'>
					<Spinner className='size-6 rounded-full fill-black text-indigo-500' />
					<span className='mt-1 text-sm'>Получение данных</span>
				</div>
			}>
			<Await
				resolve={data.fields}
				errorElement={
					<ErrorHandler msg='Ошибка получения данных для заполнения' />
				}>
				{(fields: Field[]) => (
					<FormManager
						fields={fields}
						queryKey={['user-data']}
						path='emergency'
					/>
				)}
			</Await>
		</Suspense>
	)
}
