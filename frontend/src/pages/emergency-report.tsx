import { Suspense } from 'react'

import FormManager from 'components/form/form-manager'
import Spinner from 'components/icons/Spinner'

export default function EmergencyReportPage() {
	return (
		<Suspense
			fallback={
				<div className='flex size-full flex-col items-center justify-center'>
					<Spinner className='size-6 rounded-full fill-black text-indigo-500' />
					<span className='mt-1 text-sm'>Получение данных</span>
				</div>
			}>
			<FormManager
				queryKey={['emergency-report-fields']}
				path='emergency'
			/>
		</Suspense>
	)
}
