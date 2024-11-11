// import { useQuery } from '@tanstack/react-query'
import Spinner from 'components/icons/Spinner'
import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { Field } from 'types/input-model'

export default function EmergencyReportPage() {
	// const { data } = useQuery<Field[]>({
	// 	queryKey: ['emergencyreport']
	// })

	const data = useLoaderData() as {
		fields: Field[]
	}

	console.log(data)

	return (
		<Suspense
			fallback={
				<div className='flex size-full flex-col items-center justify-center'>
					<Spinner className='size-6 rounded-full fill-black text-indigo-500' />
					<span className='mt-1 text-sm'>Получение данных</span>
				</div>
			}>
			<Await resolve={data.fields} errorElement={<p>error</p>}>
				{(fields: Field[]) => (
					<h1>{fields.map(el => el.type).join(', ')}</h1>
				)}
			</Await>
		</Suspense>
	)
}
