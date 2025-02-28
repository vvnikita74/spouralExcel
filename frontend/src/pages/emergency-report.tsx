import { Suspense } from 'react'
import { useLoaderData } from 'react-router'

import FormManager from 'components/form/manager'
import { SpinnerContainer } from 'components/icons/Spinner'

export default function EmergencyReportPage() {
  const searchParams = useLoaderData() as string

  return (
    <Suspense fallback={<SpinnerContainer />}>
      <FormManager
        queryKey={['emergency-report-fields']}
        path='emergency'
        search={searchParams}
      />
    </Suspense>
  )
}
